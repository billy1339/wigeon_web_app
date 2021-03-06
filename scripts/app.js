angular.module('WigeonApp', ['ngRoute', 'ngCookies']);

var appRun = function ($rootScope, $cookies, $window, $http) {
	$rootScope.SignedIn = SignedIn(); 
  $rootScope.facebookAppId = '872785199480947';
	$rootScope.baseApiUrl = 'http://52.70.139.161/Wigeon/';
  $rootScope.types = {
    0 : {
      'title' : 'ALL',
      'name' : 'All Suggestions',
      'id': '0'
    },
    1 : {
      'title' : 'WATCH',
      'name' : 'Watch',
      'img' : '/assets/images/wigeon-webapp_watch-black.png',
      'id' : '1',
      'color' : '#4257A6'
    },
    2 : {
      'title' : 'LISTEN',
      'name' : 'Listen',
      'img' : '/assets/images/wigeon-webapp_listen-black.png',
      'id' : '2',
      'color' : '#F37221'
    },
    3 : {
      'title' : 'GO',
      'name' : 'Go',
      'img' : '/assets/images/wigeon-webapp_go-black.png',
      'id' : '3',
      'color' : '#FEBC22'
    },
    4 : {
      'title' : 'READ',
      'name' : 'Read',
      'img' : '/assets/images/wigeon-webapp_read-black.png',
      'id' : '4',
      'color' : '#D83939'
    },
    5 : {
      'title' : 'OTHER',
      'name' : 'Other',
      'img' : '/assets/images/wigeon-webapp_other-black.png',
      'id' : '5',
      'color' : '#1C706F'
    }
  }

  $rootScope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $rootScope.IsUserSignedIn(); 
    $window.location.href = '/sign-in';
  }

  $rootScope.IsUserSignedIn = function() {
    SignedIn(); 
  }

  function SignedIn() {
    var result = $cookies.get("wigeon_user_token");
    $rootScope.SignedIn = result;
    return result;
  }

  $rootScope.sendContactUs = function(contact) {
    var data = {
      Email : contact.Email,
      Note : contact.Note
    }
    $http.post("/api/contact-us-email", data).then(function(response) {
      debugger; 
    });
  }

  $rootScope.calculateTimeDifference = function(createdDate) {
    var date1 = new Date(createdDate * 1000);
    var date2 = new Date();
    var dayDiff = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));
    if(dayDiff>= 365) {
      var yrs = dayDiff / 365;
      yrs = Math.round( yrs * 10 ) / 10;
      return yrs + "y ago";
    } else if(dayDiff >= 30) {
      var months = dayDiff / 30;
      months = Math.round( months * 10 ) / 10;
      return months + "m ago";
    }
    else if(dayDiff >= 7) {
      var weeks = dayDiff / 7;
      weeks = Math.round( weeks * 10 ) / 10;
      return weeks + "w ago"
    } else if(dayDiff > 0) {
      return dayDiff + "d ago";
    } else {
      var hourDiff = parseInt((date2 - date1) / (1000 * 60 * 60));
      if(hourDiff === 1 || hourDiff === 0) {
        return "1h ago";
      }
      return hourDiff + "h ago";
    }
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

appRun.$inject = ['$rootScope', '$cookies', '$window', '$http'];
angular.module('WigeonApp').run(appRun);