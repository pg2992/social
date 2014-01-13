var MyTrips = MyTrips || {};


MyTrips.Controller = function (model) {

    var _self = this;

    _self.event = {
        tripCreated: new UIEvent(this),
        resultLoaded: new UIEvent(this),
        pageRendered: new UIEvent(this),
        pageEnd: new UIEvent(this),
        loadTripDetails: new UIEvent(this),
        showGallery: new UIEvent(this),
        postLoaded: new UIEvent(this),
        logoutEvent: new UIEvent(this)
    };
    _self.model = model;

    _self.connector = {
        loadTrips: function (successCallBack) {

            var user = new Appacitive.Object({ __type: 'user', __id: _self.model.user.__id });

            var query = user.fetchConnectedObjects({
                relation: 'collaborators',
                returnEdge: true,
                label: 'trip',
                pageSize: _self.model.tripsPageModel.pageSize,
                orderby: '__utcdatecreated'
            });

            var successHandler = function (trips) {
                _self.model.tripsPageModel.totalItems = trips.total;
                _self.model.tripsPageModel.isLastPage = trips.isLastPage;
                _self.model.isPageEnd = false;
                successCallBack(trips);
            };
            _self.event.pageEnd.attach(function (src, data) {
                if (!_self.model.trips.isLastPage && data === 'mainView') {
                    query.fetchNext().then(successHandler);
                }
				
            });
            query.fetch().then(function (trips) {
                successHandler(trips);
                //_self.event.resultLoaded.notify();
            },
                function (errors) {
                    console.log(errors);
                });


        },

        createTrip: function () {
            var trip = new Appacitive.Object('trip');
            trip.set('trip_id', '888555');
            trip.set('name', 'FIFA Fever in Brazil');
            trip.set('start_date', Date(2014, 03, 15, 0, 0, 0).toISOString());
            trip.set('end_date', Date(2014, 03, 25, 0, 0, 0).toISOString());
            trip.set('photo', "photo.png");

            trip.save().then(function (obj) {
                console.log("trip created");
                _self.event.tripCreated.notify();
            },
                function (status) {
                    console.log("failed to create trip");
                });
        },

        getPostForTrip: function (onGetImageSuccess) {
            var tripId = _self.model.currentTrip.__id;
            var trip = new Appacitive.Object({ __type: 'trip', __id: tripId });

            var query = trip.fetchConnectedObjects({
                relation: 'posts',
                returnEdge: false,
                label: 'post',
                pageSize: _self.model.postsPageModel.pageSize,
                orderBy: '__utcdatecreated'
            });

            var successHandler = function (posts) {
                _self.model.postsPageModel.totalItems = posts.total;
                _self.model.postsPageModel.isLastPage = posts.isLastPage;
                if (posts && posts.length > 0) {
                    //_self._helper.getPostType(posts);
                    _self.event.postLoaded.notify(_self._helper.getPostType(posts));
                    _self.model.isPageEnd = false;
                } else {

                    onGetImageSuccess();
                }

                //onGetImageSuccess(posts);
            };

            _self.event.pageEnd.attach(function (src, data) {
                if (!_self.model.postsPageModel.isLastPage && data === 'detailsView') {
                    query.fetchNext().then(successHandler);
                } else {

                    onGetImageSuccess();
                }
            });
            query.fetch().then(successHandler,
                function (error) {
                    console.log(errors);
                });
        },

        createPostForTrip: function () {
            var trip = new Appacitive.Object({ __type: 'trip', __id: 'someid' });

            var post = new Appacitive.Object({ __type: 'post', type: 'photo', target_id: '', title: '', decription: '' });
            var posts = new Appacitive.Connection({
                relation: 'post',
                endpoints: [
                    {
                        object: trip,
                        label: 'trip'
                    }, {
                        object: post,
                        label: 'post'
                    }
                ]

            });
        },

        getImagesFortrip: function (onSuccessCallback) {
            var tripId = _self.model.currentTrip.__id;
            var trip = new Appacitive.Object({ __type: 'trip', __id: tripId });

            var query = trip.fetchConnectedObjects({
                relation: 'photos',
                returnEdge: false,
                label: 'photo',
                pageSize: _self.model.galleryPageModel.pageSize,
                orderby: '__utcdatecreated'
            });

            query.fetch().then(function (photos) {
                onSuccessCallback(photos);
            },
            function () {
                console.log('error');
            });

        },

        getImagesForPost: function (photoId, onGetImageSuccess) {

            Appacitive.Object.get({
                type: 'photo',
                id: photoId,
                fields: ['title', 'url', 'thumb_url', 'geocode']
            }).then(function (obj) {
                //console.log(obj);
                onGetImageSuccess(obj);
            },
                function () {
                    console.log("cannot load the specified trip")
                });


        },
		
		getVideosForPost: function (videoId, onGetVideoSuccess) {

            Appacitive.Object.get({
                type: 'video',
                id: videoId,
                fields: ['title', 'url']
            }).then(function (obj) {
                //console.log(obj);
                onGetVideoSuccess(obj);
            },
                function () {
                    console.log("cannot load the specified trip")
                });


        },

        isAuthenticated: function (request, onAuth) {
            Appacitive.Users.login(request.username, request.password).then(function (authResult) {
                // user has been logged in successfully
                onAuth(authResult);
            }, function () {
                onAuth();
            });
        }
    };

    _self._helper = {

        getPostType: function (posts) {
            var postArray = [];
            for (var i = 0; i < posts.length; i++) {

                var post = new _self.model.post();
                var obj = posts[i].getObject();
                post.type = obj.type;
                post.id = obj.__id;
                post.targetId = obj.target_id;
                post.description = obj.description;
                post.createdDate = obj.__utcdatecreated;

                post.createdBy = obj.__createdby;
                post.duration = _self._helper.getDuration(Date.parse(post.createdDate));
                post.url = "";
                _self.model.posts.push(post);
                postArray.push(post);
            }
            return postArray;
        },
        getDuration: function (date1) {
            //Get 1 day in milliseconds
            var one_day = 1000 * 60 * 60 * 24;
            var date2 = new Date();
            // Convert both dates to milliseconds
            var date1_ms = date1;
            var date2_ms = date2.getTime();

            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;
            //take out milliseconds
            difference_ms = difference_ms / 1000;
            var seconds = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            var minutes = Math.floor(difference_ms % 60);
            difference_ms = difference_ms / 60;
            var hours = Math.floor(difference_ms % 24);
            var days = Math.floor(difference_ms / 24);
            if (days != 0)
                return days + ' days ago';
            if (hours != 0)
                return hours + ' hours ago';
            if (minutes != 0)
                return minutes + ' minutes ago';
            return '';

        }

    };
};

