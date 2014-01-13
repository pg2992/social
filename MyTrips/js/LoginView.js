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
            init: function () {
                _view.placeHolders.headerHolder = $("#header");
                _view.placeHolders.middleLayerHolder = $("#middleLayer");
                _view.placeHolders.bodyHolder = $("#body");
            }
        },

        controls: {
            btnLogin: null,
            dvError: null,
            init: function () {
                _view.controls.btnLogin = $(".jsLogin");
                _view.controls.dvError = $(".jsError");
            }
        },

        display: function () {

            _view.placeHolders.headerHolder.html('<h1>Login</h1>');
            _view.placeHolders.middleLayerHolder.html(_template.tmpl_LoginView);
            _view.placeHolders.bodyHolder.html('');
            _view.controls.init();
            _view.bind();
        },

        bind: function () {

            _view.controls.btnLogin.click(function () {



                var request = {

                    username: $('#inputUsername').val(),
                    password: $('#inputPassword').val()

                };


                controller.connector.isAuthenticated(request, _view.onAuth);

            });

        },

        onAuth: function (response) {

            if (response) {
                controller.model.user = response.user.getObject();
                initApp();
            } else {
                
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