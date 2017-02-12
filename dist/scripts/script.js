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
	$rootScope.facebookAppId = "U2FsdGVkX1/CiPk3U3ceQZHwQ/nvMdc2p3tqq6gy62g=";
	$rootScope.baseApiUrl = 'http://52.201.120.48/Wigeon/scripts/';
  $rootScope.types = {
    0 : {
      'title' : 'ALL',
      'id': '0'
    },
    1 : {
      'title' : 'WATCH',
      'img' : '/assets/images/watch.png',
      'id' : '1',
      'color' : '#4257A6'
    },
    2 : {
        'title' : 'LISTEN',
        'img' : '/assets/images/listen.png',
        'id' : '2',
        'color' : '#F37221'
    },
    3 : {
      'title' : 'GO',
      'img' : '/assets/images/go.png',
      'id' : '3',
      'color' : '#FEBC22'
    },
    4 : {
      'title' : 'READ',
      'img' : '/assets/images/read.png',
      'id' : '4',
      'color' : '#D83939'
    },
    5 : {
      'title' : 'OTHER',
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
    		appId      : CryptoJS.AES.decrypt($rootScope.facebookAppId, "Wigeon").toString(CryptoJS.enc.Utf8),
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
var appRoutes = function($routeProvider, $locationProvider) {
  'use strict';
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html'
    })
    .when('/sign-in', {
      templateUrl: 'views/sign-in.html'
    })
    .when('/sign-up', {
      templateUrl: 'views/sign-up.html'
    })
    .when('/nest', {
      templateUrl: 'views/nest.html'
    })
    .when('/profile', {
      templateUrl: 'views/profile.html'
    })
    .otherwise({
      redirectTo: '/'
    });
    
    // $locationProvider.html5Mode(true);
};
appRoutes.$inject = ['$routeProvider', '$locationProvider'];
angular.module('WigeonApp').config(appRoutes);



var NestCtrl = function($scope, $http, $cookies, $window, SuggestionFactory, $rootScope, $sce, YelpFactory) {
  'use strict'

  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();
  initListeners();

  $scope.view = "GRID";//"LIST";
  $scope.quantity = 20; 
  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	PopulateSuggestions();
  }

  function PopulateSuggestions() {
    var promise = SuggestionFactory.fetch(1, 0); 
    promise.then(function(response) {
      $scope.suggestions = response; 
      var secondPromise = SuggestionFactory.fetch(10, 1);
      secondPromise.then(function(response) {
        $scope.suggestions = $scope.suggestions.concat(response);
      });
    });
  }

  $scope.populateModal = function(id) {
    var sug = findSuggestion(id);
    $scope.suggestionModelInfo = sug;
    if (sug.suggestion_type.title === "GO") {
      var promise = YelpFactory.fetch(sug.suggestion_source_item_id);
      promise.then(function(response) {
        debugger; 
        $scope.yelp = response; 
        $("#SuggestionDetailModal").modal();
      });
    } else {
      $("#SuggestionDetailModal").modal();
    };
  }

  function findSuggestion(id) {
    var sugs, item;
    sugs = $scope.suggestions;
    for(var i=0; i < sugs.length; i++) {
      if (id == sugs[i].inbox_suggestion.suggestion_id) {
        item = sugs[i].inbox_suggestion;
        break;
      }
    }
    return item;
  }

  $scope.getIframeSrc = function(src) {
    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + src);
  };

  $scope.returnTrustedSrc = function(src) {
    src = src + "?cb=" + new Date().getTime();
    return $sce.trustAsResourceUrl(src);
  };

  $scope.changeLayout = function(layout) {
    $(".layout-buttons a").each(function() {
      $(this).removeClass("active");
    });
    $("#"+layout+"-LAYOUT").addClass("active");
    $scope.view = layout;
  };

  function initListeners() {
    $(document).ready(function() {

      $("#NestCtrl").on('hidden.bs.modal', '#SuggestionDetailModal', function () {
        var audio = $("#MusicPreview")[0];
        if (audio !== undefined) {
          audio.pause(); 
        } 
      });

      $(".search-icon .icon").on("click", function() {
        $(".search-icon").hide();
        $(".search-suggestions").show("slow");
      });

    });
  }

  $scope.seeMore = function() {
    $scope.quantity += 20; 
  }

};

NestCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'SuggestionFactory', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('NestCtrl', NestCtrl);


var ProfileCtrl = function($scope, $http, $cookies, $window, ProfileFactory, $rootScope, $sce, YelpFactory) {
  'use strict'

  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();
  initListeners();

  $scope.view = "GRID";
  $scope.quantity = 20; 
  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	getUser();
    PopulateSuggestions();
  }


function getUser() {
  var promise = ProfileFactory.fetch();
  promise.then(function(response) {
    console.log(response)
    $scope.profile = response;
  });
}

  
function PopulateSuggestions() {
    var promise = ProfileFactory.get(1, 0);
    promise.then(function(response) {
      console.log(response);
      $scope.suggestions = response; 
      var secondPromise = ProfileFactory.get(10, 1);
      secondPromise.then(function(response) {
        $scope.suggestions = $scope.suggestions.concat(response);
      });
    });
  }

 $scope.populateModal = function(id) {
    var sug = findSuggestion(id);
    $scope.suggestionModelInfo = sug;
    if (sug.suggestion_type.title === "GO") {
      var promise = YelpFactory.fetch(sug.suggestion_source_item_id); 
      promise.then(function(response) {
        console.log(response); 
        $scope.yelp = response; 
        $("#SuggestionDetailModal").modal();
      });
    } else {
      $("#SuggestionDetailModal").modal();
    };
  }

  function findSuggestion(id) {
    var sugs, item;
    sugs = $scope.suggestions;
    for(var i=0; i < sugs.length; i++) {
      if (id == sugs[i].feed_suggestion.suggestion_id) {
        item = sugs[i].feed_suggestion;
        break;
      }
    }
    return item;
  }

  $scope.getIframeSrc = function(src) {
    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + src);
  };

  $scope.returnTrustedSrc = function(src) {
    src = src + "?cb=" + new Date().getTime();
    return $sce.trustAsResourceUrl(src);
  };

  $scope.changeLayout = function(layout) {
    $(".layout-buttons a").each(function() {
      $(this).removeClass("active");
    });
    $("#"+layout+"-LAYOUT").addClass("active");
    $scope.view = layout;
  };


  function initListeners() {
    $(document).ready(function() {

      $("#ProfileCtrl").on('hidden.bs.modal', '#SuggestionDetailModal', function () {
        var audio = $("#MusicPreview")[0];
        if (audio !== undefined) {
          audio.pause(); 
        } 
      });

      $(".search-icon .icon").on("click", function() {
        console.log('hiIIII ');
        $(".search-icon").hide();
        $(".search-suggestions").show("slow");
      });

    });
  }
$scope.getProfileImg = function(img) {
  if (img !== undefined) {
      if (img.indexOf('http') === -1){
        return "http://52.201.120.48/Wigeon/" + img;
       }
      return img;
    }
  return;   
}
  $scope.seeMore = function() {
    $scope.quantity += 20; 
  }

  $scope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $window.location.href = '/#/';
  }

 }

ProfileCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'ProfileFactory', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('ProfileCtrl', ProfileCtrl);


var SignInCtrl = function($scope, $http, $cookies, $location, $window, FacebookFactory, $rootScope, $q) {
  'use strict'

  getUserInfo();

  function getUserInfo() {
    var user_token = $cookies.get("wigeon_user_token");
    if (user_token) {
      $window.location.href = '/#/nest';
    }
  }


  $scope.UserLogin = function(user) {
    var signInForm = new FormData();
    signInForm.append("user_email", user.email);
    signInForm.append("user_password", user.password);

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": $rootScope.baseApiUrl + "email-login.php",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": signInForm
    }).done(function (response) {
      var deserialized = JSON.parse(response);
      if (deserialized.error_name !== undefined) {
        alert(deserialized.error_name + deserialized.error_message)
      }
      else {
        setUserCookie(deserialized.user_token, deserialized.user_id);
        console.log(deserialized);
        $window.location.href = '/#/nest';
      }
    });
  };



  $scope.facebookLogIn = function() {
    FB.getLoginStatus(function(response) {
      initiateFacebookLogin(response);
    });
  }


  function initiateFacebookLogin(facebookStatusResponse) {
    if (facebookStatusResponse.status === 'connected') {
      var promise = FacebookFactory.getMyLastName();
      promise.then(function(response) {
        var apiSignIn = WigeonFacebookSignIn(response);
        apiSignIn.then(function(result) {
          if(result.success) {
            $window.location.href = '/#/nest';
          } else {
            alert(result.error_message);
          }
        })
      });
    // below this needs to be refactored in case a user is not logged in
    // HELP!!! 

    } else if (facebookStatusResponse.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  function WigeonFacebookSignIn(data) {
    var deferred = $q.defer();
    $http.post('/api/facebook-sign-in', data).success(function(response){
      deferred.resolve(response); 
    });
    return deferred.promise; 
  }

  function getHash(id) {
    return CryptoJS.SHA256(CryptoJS.AES.decrypt($rootScope.saltA, "Wigeon").toString(CryptoJS.enc.Utf8)+id+CryptoJS.AES.decrypt($rootScope.saltB, "Wigeon").toString(CryptoJS.enc.Utf8));;
  }

  function setUserCookie(token, id) {
    var cookie = CryptoJS.AES.encrypt(token + "~" + id, "Wigeon");
    var today = new Date();
    var exp = new Date(today.getFullYear(), today.getMonth()+3, today.getDate());
    $cookies.put('wigeon_user_token', cookie, { 'expires' : exp })
  };
};

SignInCtrl.$inject = ['$scope', '$http', '$cookies', '$location', '$window', 'FacebookFactory', '$rootScope', '$q'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);


var SignUpCtrl =  function($scope, $http, $cookies, $location, $window, FacebookFactory, $rootScope) {
  'use strict'

  $scope.EmailSignUp = function(user) {

    var form = new FormData();
    form.append("user_email", user.email);
    form.append("user_password", user.password);
    form.append("user_full_name", user.full_name);

    $.ajax({
      "async": true,
      "crossDomain": true,
      "url": "http://52.201.120.48/Wigeon/scripts/email-signup.php",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }).done(function (response) {
      var deserialized = JSON.parse(response);
      if (deserialized.error_name !== undefined) {
        alert(deserialized.error_name + deserialized.error_message)
      }
      else {
        setUserCookie(deserialized.user_token, deserialized.user_id);
        $window.location.href = '/#/nest';
      }
    });

  };

  function setUserCookie(token) {
    var today = new Date();
    var exp = new Date(today.getFullYear(), today.getMonth()+3, today.getDate());
    $cookies.put('wigeon_user_token', token, { 'expires' : exp })
    $window.location.href = '/#/nest';
  };

  //$cookies.remove("wigeon_user_token");
};

SignUpCtrl.$inject = ['$scope', '$http', '$cookies', '$location', '$window', 'FacebookFactory', '$rootScope'];
angular.module('WigeonApp').controller('SignUpCtrl', SignUpCtrl);

// special thanks to angulike... this could be cut down more. 
var fbButton = function ($window, $rootScope) {
              return {
                  link: function (scope, element, attrs) {
                      if (!$window.FB) {
                          // Load Facebook SDK if not already loaded
                          $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
                              $window.FB.init({
                                  appId: CryptoJS.AES.decrypt($rootScope.facebookAppId, "Wigeon").toString(CryptoJS.enc.Utf8),
                                  xfbml: true,
                                  version: 'v2.0'
                              });
                              renderFBButton();
                          });
                      } else {
                          renderFBButton();
                      }

					  var watchAdded = false;
                      function renderFBButton() {
                          if (!!attrs.fbButton && !scope.fbButton && !watchAdded) {
                          	  console.log('debug this senerio..... fb directive')
                              // wait for data if it hasn't loaded yet
							  var watchAdded = true;
                              var unbindWatch = scope.$watch('fbButton', function (newValue, oldValue) {
							      if (newValue) {
								      renderFBButton();

									  // only need to run once
									  unbindWatch();
								  }

                              });
                              return;
                          } else {
                              $window.FB.XFBML.parse(element.parent()[0]);
                          }
                      }
                  }
              };
          }

fbButton.$inject = ['$window', '$rootScope'];
angular.module('WigeonApp').directive('fbButton', fbButton);





var imageFallback = function() {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
      	var newSrc = "http://52.201.120.48/Wigeon/" + iAttrs.fallbackSrc;
        angular.element(this).attr("src", newSrc);
      });
    }
   }
   return fallbackSrc;
};

angular.module('WigeonApp').directive('fallbackSrc', imageFallback);

var FacebookFactory = function($q) {
        return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'name, email',
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
}

FacebookFactory.$inject = ["$q"];
angular.module('WigeonApp').factory('FacebookFactory', FacebookFactory);


 var ProfileFactory = function($http, $q, $cookies, $rootScope) {
  'use strict';

  // function getUser(calls, start) {
  //   var cookie = $cookies.get("wigeon_user_token").split("~");
  //   var deferred = $q.defer();
  //   var promises = userRequest;
  //   for(var i = start; i < calls; i ++) {
  //     promises.push(inboxRequest(cookie, i.toString())); 
  //   }
  //   $q.all(promises).then(function(result) {
  //     for(var i=0; i < result.length; i++) {
  //       sugs = sugs.concat(result[i]);
  //     }
  //     deferred.resolve(sugs); 
  //   });
  //   return deferred.promise; 
  // };

  function userRequest() {
      var cookie = $cookies.get("wigeon_user_token");
      cookie = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
      var deferred = $q.defer();
      var fetchUser = new FormData();
      fetchUser.append("user_id", cookie[1]);
      fetchUser.append("requesting_user_id", cookie[1]); // needs to be replaced with actual users id (somehow attach to )
      fetchUser.append("user_token", cookie[0]);

      $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "http://52.201.120.48/Wigeon/scripts/fetch-user.php",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": fetchUser
      }).done(function (response) {
        var userData = JSON.parse(response);
        deferred.resolve(userData) 
      });
      return deferred.promise;
  }

    function userFeed(page) {
      var cookie = $cookies.get("wigeon_user_token");
      cookie = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
      var deferred = $q.defer();
      var getUser = new FormData();
      getUser.append("user_id", cookie[1]);
      getUser.append("requesting_user_id", cookie[1]); // needs to be replaced with actual users id (somehow attach to )
      getUser.append("user_token", cookie[0]);
      getUser.append("page", page);
      getUser.append("search_query", "");



      $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "http://52.201.120.48/Wigeon/scripts/fetch-user-feed.php",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": getUser
      }).done(function (response) {
        var feedData = JSON.parse(response);
        feedData = addTypeInfoToData(feedData.objects);
        deferred.resolve(feedData) 
      });
      return deferred.promise;
  }


  function addTypeInfoToData(data) {
    for(var i=0; i < data.length; i++) {
      var type = populateType(data[i].feed_suggestion.suggestion_type);
      data[i].feed_suggestion.suggestion_type = type; 
    }
    return data; 
  };

  function populateType(typeid) {
    return $rootScope.types[typeid]
  }


  return {
    fetch: userRequest,
    get: userFeed
  };

};

ProfileFactory.$inject = ['$http', '$q', '$cookies', '$rootScope'];
angular.module('WigeonApp').factory('ProfileFactory', ProfileFactory);

 var SuggestionFactory = function($http, $q, $cookies, $rootScope) {
  'use strict';

  function getAllSuggestions(calls, start) {
    var deferred = $q.defer(); 
    var data = {
      calls : calls,
      start : start 
    }
    $http.post('/api/nest', data).success(function(response) {
      // var inboxData = JSON.parse(response);
      var inboxData = addTypeInfoToData(response);
      deferred.resolve(inboxData); 
    });
    return deferred.promise; 
  //   var cookie = $cookies.get("wigeon_user_token");
  //   var cookie = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
  //   var sugs = [];
  //   var deferred = $q.defer();
  //   var promises = [];
  //   for(var i = start; i < calls; i ++) {
  //     promises.push(inboxRequest(cookie, i.toString())); 
  //   }
  //   $q.all(promises).then(function(result) {
  //     for(var i=0; i < result.length; i++) {
  //       sugs = sugs.concat(result[i]);
  //     }
  //     deferred.resolve(sugs); 
  //   });
  //   return deferred.promise; 
  // };

  // function inboxRequest(cookie, page) {
  //     var deferred = $q.defer();
  //     var fetchInbox = new FormData();
  //     fetchInbox.append("requesting_user_id", cookie[1]); // needs to be replaced with actual users id (somehow attach to )
  //     fetchInbox.append("page", page);
  //     fetchInbox.append("search_query", "");
  //     fetchInbox.append("suggestion_type", "");
  //     fetchInbox.append("starred_only", "");
  //     fetchInbox.append("reminders_only", "");
  //     fetchInbox.append("user_token", cookie[0]);

  //     $.ajax({
  //       "async": true,
  //       "crossDomain": true,
  //       "url": "http://52.201.120.48/Wigeon/scripts/fetch-inbox.php",
  //       "method": "POST",
  //       "processData": false,
  //       "contentType": false,
  //       "mimeType": "multipart/form-data",
  //       "data": fetchInbox
  //     }).done(function (response) {
  //       var inboxData = JSON.parse(response);
  //       inboxData = addTypeInfoToData(inboxData.objects);
  //       deferred.resolve(inboxData) 
  //     });
  //     return deferred.promise;
  }

  function addTypeInfoToData(data) {
    for(var i=0; i < data.length; i++) {
      var type = populateType(data[i].inbox_suggestion.suggestion_type);
      data[i].inbox_suggestion.suggestion_type = type; 
    }
    return data; 
  };

  function populateType(typeid) {
    return $rootScope.types[typeid]
  }

  return {
    fetch: getAllSuggestions
  };

};

SuggestionFactory.$inject = ['$http', '$q', '$cookies', '$rootScope'];
angular.module('WigeonApp').factory('SuggestionFactory', SuggestionFactory);

 var YelpFactory = function($http, $q, $rootScope, $sce) {
  'use strict';

  function fetch(yelp_app_id) {
    var config = {
      params : {
        yelpId : yelp_app_id
      }
    };
    
    var deferred = $q.defer();
    $http.get('/api/yelp', config).then(function(response) {
      var parsed = JSON.parse(response.data)
      deferred.resolve(parsed);
    });
    return deferred.promise;
  }

  return {
    fetch: fetch
  };



};

YelpFactory.$inject = ['$http', '$q', '$rootScope', '$sce'];
angular.module('WigeonApp').factory('YelpFactory', YelpFactory);

//http://stackoverflow.com/questions/18095727/limit-the-length-of-a-string-with-angularjs
var CutFilter =  function() {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;
            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
}

angular.module('WigeonApp').filter('cut', CutFilter);