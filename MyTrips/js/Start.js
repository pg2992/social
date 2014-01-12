var MyTrips = MyTrips || {};
var controller = null;
$(document).ready(function () {

    Appacitive.initialize({
        apikey: "8SFBixlTTR+L2uWOpHR70QqORjx4MKsV5Td/+nm0NJI=",
        env: "sandbox",
        appId: "47679752659665434"
    });


    var model = new MyTrips.Model();
    controller = new MyTrips.Controller(model);
    var mainView = new MyTrips.MainView(controller);
    var detailsView = new MyTrips.DetailsView(controller);
    var galleryView = new MyTrips.GalleryView(controller);
    var login = new MyTrips.LoginView(controller);


});
function initFacebook() {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_UK/all.js', function () {

        window.fbAsyncInit = function () {
            Appacitive.Facebook.initialize({
                appId: '274333522716311', // Facebook App ID 631446003579649  
                status: false, // check login status
                cookie: true, // enable cookies to allow Appacitive to access the session
                xfbml: true // parse XFBML
            });

            Appacitive.Facebook.requestLogin().then(function (fbResponse) {
                console.log('Facebook login successfull with access token: ' + Appacitive.Facebook.accessToken());

                // signup with Appacitive
                return Appacitive.Users.loginWithFacebook(Appacitive.Facebook.accessToken()); //changed function

            }).then(function (authResult) {
                // user has been successfully signed up and set as current user
                // authresult contains the user and Appacitive-usertoken
                //Write the code here
                var model = new MyTrips.Model(authResult);
                var controller = new MyTrips.Controller(model);
                var mainView = new MyTrips.MainView(controller);
                var detailsView = new MyTrips.DetailsView(controller);
                var galleryView = new MyTrips.GalleryView(controller);

                controller.event.pageRendered.notify();

            }, function (err) {
                window.location.reload();
                if (global.Appacitive.Facebook.accessToken()) {
                    // there was an error during facebook login
                } else {
                    // there was an error signing up the user
                }
            });
        };


    });


};


function initApp() {

    //var model = new MyTrips.Model(authResult);

    controller.event.pageRendered.notify();
}

//function logoutFacebook() {
//    Appacitive.Users.logout(true).then(function () {
//        FB.logout(function (response) {
//            alert("Logout Successfully...");
//            //For logout we are refreshing page
//            window.location.reload();
//        });
//    });

//}