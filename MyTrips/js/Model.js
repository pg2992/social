var MyTrips = MyTrips || {};

MyTrips.Model = function (authResult) {
    this.trips = {
        isLastPage: false,
        listOfTrips: []
    };

    this.currentPage = '';

    this.posts = [];

    this.post = function () {
        this.id = '';
        this.type = '';
        this.targetId = '';
        this.url = '';
        this.description = '';
        this.createdDate = '';
        this.createdBy = '';
        this.duration = '';
    };

    this.user = null;//authResult.user.getObject();

    this.tripsPageModel = { currentPage: 0, pageSize: 5, totalItems: 0, totalFilterItems: 0, isLastPage: false };

    this.postsPageModel = { currentPage: 0, pageSize: 5, totalItems: 0, totalFilterItems: 0, isLastPage: false };
	
	this.galleryPageModel = { currentPage: 0, pageSize: 5, totalItems: 0, totalFilterItems: 0, isLastPage: false };
	
    this.currentTrip = {
        trip: null
    };

    this.isPageEnd = false;
};


