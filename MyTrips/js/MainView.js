var MyTrips = MyTrips || {};


MyTrips.MainView = function (controller) {

    var _self = this;
    var _template = {
        tmpl_LV: null,
        tmpl_GV: null,
        tmpl_Header: null,
        tmpl_Body: null,
        tmpl_MiddleLayer: null,
        tmpl_SideBar: null
    };

    var _view = {

        controls: {
            headerHolder: null,
            bodyHolder: null,
            middleLayerHolder: null,
            sideBarHolder: null,
            listViewHolder: null,
            gridViewHolder: null,
            gridViewBtn: null,
            trip: null,
            preLoader: null,
			btnMenu:null,
            init: function () {
                _view.controls.trip = $(".jTrip", _view.controls.listViewHolder);
                _view.controls.listViewHolder = $(".jLVTripHolder");
                _view.controls.gridViewHolder = $(".jGVTripHolder");
				_view.controls.btnMenu = $("#simple-menu");

            }
        },

        init: function () {

            _view.controls.headerHolder = $("#header");
            _view.controls.middleLayerHolder = $("#middleLayer");
            _view.controls.bodyHolder = $("#body");
            _view.controls.sideBarHolder = $("#sideBar");
            _template.tmpl_Header = $("#tmpl_HomeHeader").html();
            _template.tmpl_Body = $("#tmpl_HomeBody").html();
            _template.tmpl_SideBar = Handlebars.compile($("#tmpl_HomeSideBar").html());
            _template.tmpl_MiddleLayer = $("#tmpl_MiddleLayer").html();
            _template.tmpl_LV = Handlebars.compile($("#tmpl_HomeListView").html());
            _template.tmpl_GV = Handlebars.compile($("#tmpl_HomeGridView").html());
            _view.controls.preLoader = $(".jPreloader");
            _view.controls.gridViewBtn = $("#jGridView");
        },

        display: function (trips) {
            var html = '';
            if (trips != null) {
                html = _template.tmpl_LV(trips);
                _view.controls.listViewHolder.append(html);
            } else {
                html = _template.tmpl_LV(controller.model.trips.listOfTrips);
                _view.controls.listViewHolder.html(html);
                _helper.bindClickToTrip(controller.model.trips.listOfTrips);
            }
            //var htmlGV = _template.tmpl_GV(trips);
            //_view.controls.gridViewHolder.append(htmlGV);
        },

        displayHeader: function () {
            _view.controls.headerHolder.html(_template.tmpl_Header);
        },

        displayMiddleLayer: function () {
            _view.controls.middleLayerHolder.html(_template.tmpl_MiddleLayer);
        },
        displayBody: function () {
            _view.controls.bodyHolder.html(_template.tmpl_Body);
        },
        displaySideBar: function () {
            var html = _template.tmpl_SideBar(controller.model.user);
            _view.controls.sideBarHolder.html(html);
			
			var flag = false;
			
			$('#dummy').sidr();
			$('#simple-menu').click(function(e){
				$('#dummy').trigger('click');
			});
			
			$(document).click(function(){
				if(parseInt($('#sidr').css('left').replace('px',''), 10) < 0) return;
				
				setTimeout(function(){
					flag = false;
				}, 1000);
				
				if(flag) return;
				flag = true;
				$('#dummy').trigger('click');
			});
			
			$('#sidr').click(function(e) {
				e.stopPropagation();
			});
        },


        bind: function () {
            _view.controls.gridViewBtn.click(function () {
                _view.controls.listViewHolder.toggle();
                _view.controls.gridViewHolder.toggle();
            });
				
        }

    }

    var _helper = {
        successCallBack: function(trips) {
            var tripTemplateObj = _helper.converToTemplateObj(trips);
            _view.init();
            _view.controls.init();
            _view.display(tripTemplateObj);
            _view.controls.preLoader.hide();
            $('.jpageEndPreloader').hide();
            _view.controls.init();
            //controller.event.resultLoaded.notify();
            _helper.bindClickToTrip(tripTemplateObj);
        },
        bindClickToTrip: function(trips) {
            for (var i = 0; i < trips.length; i++) {
                var id = "#" + trips[i].__id;
                _view.controls.listViewHolder.on("click", id, function() {
                    _helper.saveCurrentTrip($(this).attr('id'));
                    controller.event.loadTripDetails.notify({rec:"detailsView",sender:"mainView"});
                });
            }
        },
        converToTemplateObj: function(trips) {
            var tripArray = [];
            for (var i = 0; i < trips.length; i++) {
                tripArray[i] = trips[i].getObject();
                tripArray[i].start_date = _helper.getDisplayDate(tripArray[i].start_date);
                tripArray[i].end_date = _helper.getDisplayDate(tripArray[i].end_date);
                controller.model.trips.listOfTrips.push(tripArray[i]);
            }
            return tripArray;
        },
        getDisplayDate: function(date) {
            var dt = date.split('-');
            var dt1 = new Date( dt[0], dt[1],dt[2].substr(0, 2)).toDateString()
            return dt1.substring(4);
        },
        saveCurrentTrip: function(id) {
            var trips = controller.model.trips.listOfTrips;
            for (var i = 0; i < trips.length; i++) {
                if (trips[i].__id === id) {
                    controller.model.currentTrip = trips[i];
                }
            }
			controller.model.posts = [];
        }


    };

    controller.event.pageRendered.attach(function (src, data) {

        _view.init();

        controller.model.currentPage = "mainView";

        
        _view.displayHeader();
        _view.displayMiddleLayer();
        _view.displaySideBar();
        _view.displayBody();
        if (data !== "mainView") {
            $('.jPreloader').show();
            controller.connector.loadTrips(_helper.successCallBack);
        } else {
            _view.controls.init();
            _view.display();
            $('.jPreloader').hide();
        }
        _view.bind();

    });


    //$(window).scroll(function () {
    //    if ($(window).scrollTop() + $(window).height() == $(document).height()) {

    //        $('.jpageEndPreloader').show();
    //        controller.event.pageEnd.notify("mainView");
    //    }
    //});



};