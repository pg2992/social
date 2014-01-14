var MyTrips = MyTrips || {};

MyTrips.LoginView = function (controller) {

    var _template = {
        tmpl_LoginView: null,
        init: function () {
            this.tmpl_LoginView = $("#loginTemplate").html();
        }
    };

    var _view = {
        placeHolders: {
            headerHolder: null,
            bodyHolder: null,
            middleLayerHolder: null,
			loginHolder:null,
            init: function () {
                _view.placeHolders.headerHolder = $("#header");
                _view.placeHolders.middleLayerHolder = $("#middleLayer");
                _view.placeHolders.bodyHolder = $("#body");
				_view.placeHolders.loginHolder = $("#loginView");
				controller.model.currentPage = 'loginView';
            }
        },

        controls: {
            btnLogin: null,
            dvError: null,
            init: function () {
                _view.controls.btnLogin = $(".jsLogin");
            }
        },

        display: function () {

            _view.placeHolders.headerHolder.html('');
            _view.placeHolders.middleLayerHolder.html('');
			_view.placeHolders.loginHolder.html(_template.tmpl_LoginView);
            _view.placeHolders.bodyHolder.html('');
			$(".jpageEndPreloader").hide();
            _view.controls.init();
            _view.bind();
        },

        bind: function () {

            _view.controls.btnLogin.click(function () {
				if(($('.username').val().length > 0) && ($('.username').val().length > 0)){
				$(this).button('loading');
                var request = {

                    username: $('.username').val(),
                    password: $('.password').val()

                };
                controller.connector.isAuthenticated(request, _view.onAuth);
				}
            });

        },

        onAuth: function (response) {

            if (response) {
				$("body").removeClass("login");
                controller.model.user = response.user.getObject();
				_view.placeHolders.loginHolder.html('');
                initApp();
            } else {
				_view.controls.btnLogin.button("reset");
                _view.controls.dvError.show();
            }
        }
    };
    controller.event.logoutEvent.attach(function (src, data) {
        if (data === "loginview") {
            _template.init();
            _view.placeHolders.init();
            _view.display();
        }
    });

    _template.init();
    _view.placeHolders.init();
    _view.display();

};