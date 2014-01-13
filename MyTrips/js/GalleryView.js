MyTrips = MyTrips || {};

MyTrips.GalleryView = function (controller) {
    var _self = this;
    var _template = {

        tmpl_Header: null,
        tmpl_Body: null,

        init: function () {
            _template.tmpl_Header = $("#tmpl_GalleryHeader").html();
            _template.tmpl_Body = Handlebars.compile($("#tmpl_GalleryBody").html());
        }
    };
    var _view = {
        controls: {
            headerHolder: null,
            middleLayerHolder: null,
            bodyHolder: null,
            backDetailsView: null,
            init: function () {
                _view.controls.headerHolder = $("#header");
                _view.controls.bodyHolder = $("#body");
                _view.controls.middleLayerHolder = $("#middleLayer");
            }
        },

        displayHeader: function () {
            _view.controls.headerHolder.html(_template.tmpl_Header);
            _view.controls.middleLayerHolder.html("");
            _view.controls.backDetailsView = $(".jsBackToDetailsView");
            _view.controls.backDetailsView.click(function () {
                controller.event.loadTripDetails.notify({rec:"detailsView",sender:"galleryView"});
            });
        },

        displayBody: function (gallery) {
            var html = _template.tmpl_Body(gallery);
            _view.controls.bodyHolder.html(html);
        },
        onImageLoaded: function (photos) {
            var galleryObject = _view.convertToGalleryTemplateObj(photos);
            console.log(galleryObject);
            _view.displayBody(galleryObject);
            $("#Gallery a").photoSwipe();
								
        },
        convertToGalleryTemplateObj: function (photos) {
            var galleryArray = [];
            for (var i = 0; i < photos.length ; i++) {
                galleryArray[i] = photos[i].getObject();

            }
            return galleryArray;
        }
    };

    controller.event.showGallery.attach(function (src, data) {
        controller.model.currentPage = data;
        if (data === "showGallery") {
            _template.init();
            _view.controls.init();
            _view.displayHeader();
            controller.connector.getImagesFortrip(_view.onImageLoaded);
        }
    });
};