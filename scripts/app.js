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
var appRun = function ($rootScope, $cookies, $window) {
	$rootScope.facebookAppId = '872785199480947';
	$rootScope.baseApiUrl = 'http://52.201.120.48/Wigeon/scripts/';
  $rootScope.types = {
    0 : {
      'title' : 'ALL',
      'name' : 'All Suggestions',
      'id': '0'
    },
    1 : {
      'title' : 'WATCH',
      'name' : 'Watch',
      'img' : '/assets/images/watch.png',
      'id' : '1',
      'color' : '#4257A6'
    },
    2 : {
      'title' : 'LISTEN',
      'name' : 'Listen',
      'img' : '/assets/images/listen.png',
      'id' : '2',
      'color' : '#F37221'
    },
    3 : {
      'title' : 'GO',
      'name' : 'Go',
      'img' : '/assets/images/go.png',
      'id' : '3',
      'color' : '#FEBC22'
    },
    4 : {
      'title' : 'READ',
      'name' : 'Read',
      'img' : '/assets/images/read.png',
      'id' : '4',
      'color' : '#D83939'
    },
    5 : {
      'title' : 'OTHER',
      'name' : 'Other',
      'img' : '/assets/images/other.png',
      'id' : '5',
      'color' : '#1C706F'
    }
  }

  $rootScope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $window.location.href = '/#/';
  }

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

	   //    FB.getLoginStatus(function(response) {
		  //   statusChangeCallback(response);
		  // });
    };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

};

appRun.$inject = ['$rootScope', '$cookies', '$window'];
angular.module('WigeonApp').run(appRun);