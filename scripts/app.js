angular.module('WigeonApp', ['ngRoute', 'ngCookies']);
// .config(function($locationProvider) {
//    if(window.history && window.history.pushState){
// 	   $locationProvider.html5Mode({
// 		   enabled: true,
// 		   requireBase: false
// 		});
//    }
// });	
// .config([
//     '$httpProvider',
//     function($httpProvider) {
//       // Expose XHR requests to server
//       $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//     }
//   ]);


  // .run([
  //   '$rootScope'
  // ]);
var appRun = function ($rootScope) {
	$rootScope.facebookAppId = '872785199480947';
	$rootScope.baseApiUrl = 'http://52.201.120.48/Wigeon/scripts/';

	// can we put this somewhere else?? 
    window.fbAsyncInit = function () {
        FB.init({
    		appId      : $rootScope.facebookAppId,
    		cookie     : true, 
    		xfbml      : true,  
    		version    : 'v2.5'
        });
        
        FB.Event.subscribe('auth.statusChange', function(response) {
            $rootScope.$broadcast("fb_statusChange", {'status': response.status});
        });

          FB.getLoginStatus(function(response) {
		    statusChangeCallback(response);
		  });
    };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

};

appRun.$inject = ['$rootScope'];
angular.module('WigeonApp').run(appRun);