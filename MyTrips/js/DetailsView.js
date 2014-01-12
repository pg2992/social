var MyTrips = MyTrips || {};

MyTrips.DetailsView = function (controller) {


    var _template = {
        tmpl_detailsHeader: null,
        tmpl_detailsMiddleLayer: null,
        tmpl_details_body: null,

        init: function () {
            this.tmpl_detailsHeader = Handlebars.compile($("#tmpl_detailsHeader").html());
            this.tmpl_detailsMiddleLayer = Handlebars.compile($("#tmpl_detailsMiddleLayer").html());
            this.tmpl_details_body = Handlebars.compile($("#tmpl_details_body").html());
        }
    };


    var _view = {
        placeHolders: {
            headerHolder: null,
            bodyHolder: null,
            middleLayerHolder: null,
            init: function () {
                _view.placeHolders.headerHolder = $("#header");
                _view.placeHolders.middleLayerHolder = $("#middleLayer");
                _view.placeHolders.bodyHolder = $("#body");
            }
        },

        controls: {
            showGallery: null,
            btnBack: null,
            init: function () {
                _view.controls.showGallery = $(".jsShowGallery");

            }
        },

        display: function () {
            _view.placeHolders.headerHolder.html(_template.tmpl_detailsHeader);
            _view.placeHolders.middleLayerHolder.html(_template.tmpl_detailsMiddleLayer);
            _view.placeHolders.bodyHolder.html(_template.tmpl_details_body);
        },

        displayHeader: function () {
            var html = _template.tmpl_detailsHeader(controller.model.currentTrip);
            _view.placeHolders.headerHolder.html(html);
            _view.controls.btnBack = $(".jsBack");
            _view.controls.btnBack.click(function () {
                controller.event.pageRendered.notify("mainView");
            });
        },

        displayMiddleLayerHolder: function () {
            var html = _template.tmpl_detailsMiddleLayer(controller.model.currentTrip);
            _view.placeHolders.middleLayerHolder.html(html);
        },

        displayBodyHolder: function (post) {

            var html = _template.tmpl_details_body(post);
            _view.placeHolders.bodyHolder.append(html);

        },


        bind: function () {
            _view.controls.showGallery.click(function () {
                controller.event.showGallery.notify("showGallery");
            });
        },

        onTripPostsSucess: function (response) {
            _view.display();
            _view.controls.init();

        },

        onGetImageSuccess: function (response) {
            if (response) {
                var post = _helper.getPostForImage(response.getObject());
                _view.displayBodyHolder(post);
                _view.controls.init();
               
            } 
            $('.jPreloader').hide();
            $('.jpageEndPreloader').hide();
        }
    };

    var _helper = {
        getPostForImage: function (resObject) {

            var posts = controller.model.posts;

            for (var i = 0; i < posts.length; i++) {

                if (posts[i].targetId === resObject.__id) {
                    posts[i].url = resObject.url;
                    return posts[i];
                }
            }
        },
        clearHolder: function () {
            _view.placeHolders.headerHolder.html('');
            _view.placeHolders.middleLayerHolder.html('');
            _view.placeHolders.bodyHolder.html('');
        }
    };

    controller.event.loadTripDetails.attach(function (src, data) {

        if (data && data === "detailsView") {
            controller.model.currentPage = data;
            $('.jPreloader').show();
            _template.init();
            _view.placeHolders.init();
            _helper.clearHolder();
            _view.displayHeader();
            _view.displayMiddleLayerHolder();
            _view.controls.init();
            _view.bind();
            controller.connector.getPostForTrip(_view.onGetImageSuccess);
        }
    });


    controller.event.postLoaded.attach(function (src, data) {
        if (data) {
            for (var i = 0; i < data.length; i++) {

                if (data[i].type === "photo") {
                    controller.connector.getImagesForPost(data[i].targetId, _view.onGetImageSuccess);
                }
            }
        }
        $('.jpageEndPreloader').hide();
    });

    $(window).scroll(function () {
        if (!controller.model.isPageEnd) {

            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                controller.model.isPageEnd = true;
                $('.jpageEndPreloader').show();
                controller.event.pageEnd.notify(controller.model.currentPage);
            }
        }
    });

};