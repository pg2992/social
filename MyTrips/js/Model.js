var MyTrips = MyTrips || {};

MyTrips.Model = function (authResult) {
    this.trips = {
        isLastPage: false,
        listOfTrips: []
    };

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

    this.pageModel = { currentPage: 0, pageSize: 10, totalItems: 0, totalFilterItems: 0, isLastPage: false };

    this.currentTrip = {
        trip: null
    };
};


