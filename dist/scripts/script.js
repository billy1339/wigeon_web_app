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
	$rootScope.SignedIn = IsUserSignedIn(); 
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
    $rootScope.SignedIn = undefined; 
    $window.location.href = '/#/sign-in';
  }

  function IsUserSignedIn() {
    return $cookies.get("wigeon_user_token");
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
var appRoutes = function($routeProvider, $locationProvider) {
  'use strict';
  $routeProvider
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
      redirectTo: '/sign-in'
    });
    
    // $locationProvider.html5Mode(true);
};
appRoutes.$inject = ['$routeProvider', '$locationProvider'];
angular.module('WigeonApp').config(appRoutes);



var NestCtrl = function($scope, $http, $cookies, $window, SuggestionFactory, $rootScope, $sce, YelpFactory) {
  'use strict'

  const vm = this; 
  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();
  initListeners();
  getUserImgUrl();

  $scope.view = "GRID";//"LIST";
  $scope.quantity = 20; 
  vm.filterViewName = "All Suggestions";
  vm.swapFilterViewName = swapFilterViewName;
  vm.seeMore = seeMore;

  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/sign-in';
      return; 
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

      $(".search-icon").on("click", function() {
        $(".search-suggestions").show("slow");
      });

      $('.sort-buttons li').on('click', function() {
        var old = $('.sort-buttons span.active');
        var oldId = '#' + $('.sort-buttons span.active').siblings('a').children('img').prop('id');
        getFilterImgSrc(oldId);
        old.removeClass('active');
        $(this).children('.filter-bullet').addClass('active');
        var newId = '#' + $('.sort-buttons span.active').siblings('a').children('img').prop('id');
        getFilterImgSrc(newId);
      });

    });
  }

  function seeMore() {
    $scope.quantity += 20; 
  }

  function getUserImgUrl() {
    $rootScope.userImg = $cookies.get("wigeon_user_img");
  }

  function swapFilterViewName(text, id) {
    vm.filterViewName = text; 
    // var newActive = '#'+id;
    // var oldActive = $('.filter-bullet.active').siblings('a').children('img').prop('id');
    // debugger;
    // getFilterImgSrc(newActive);
    // getFilterImgSrc(oldActive);
  }

  function getFilterImgSrc(id) {
    var src = $(id).prop('src');
    var newSrc = swapActiveImages(src);
    $(id).prop('src', newSrc);
  }

  function swapActiveImages(src) {
    if(src.indexOf('green') > 0) {
      src = src.replace('green', 'black');
    } else if (src.indexOf('black') > 0) {
      src = src.replace('black', 'green');
    }
    return src; 
  }
};

NestCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'SuggestionFactory', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('NestCtrl', NestCtrl);


var ProfileCtrl = function($scope, $http, $cookies, $window, ProfileService, $rootScope, $sce, YelpFactory) {
  'use strict'

  getUserInfo();
  initListeners();

  $scope.view = "GRID";
  $scope.quantity = 20; 
  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	getUserProfile();
    PopulateSuggestions();
  }


function getUserProfile() {
  ProfileService.getProfile().then(
    function(response) {
      $scope.profile = JSON.parse(response);
    });
}

  
function PopulateSuggestions() {
  ProfileService.getUserFeed(1,0).then(function(response) {
    $scope.suggestions = response.data;
    ProfileService.getUserFeed(10, 1).then(function(response) {
      $scope.suggestions = $scope.suggestions.concat(response.data);
    })
  })
}

 $scope.populateModal = function(id) {
    var sug = findSuggestion(id);
    $scope.suggestionModelInfo = sug;
    if (sug.suggestion_type.title === "GO") {
      var promise = YelpFactory.fetch(sug.suggestion_source_item_id); 
      promise.then(function(response) {
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

ProfileCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'ProfileService', '$rootScope', '$sce', 'YelpFactory'];
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
        $rootScope.IsSignedIn = true; 
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
            setUserImgCookie(result.user_img);
            $rootScope.IsSignedIn = true; 
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

  function setUserImgCookie(url) {
    // TODO if cookie exists, remove it.
    var today = new Date();
    var exp = new Date(today.getFullYear(), today.getMonth()+3, today.getDate());
    $cookies.put('wigeon_user_img', url, { 'expires' : exp })
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
                                  appId: '872785199480947',
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


 var ProfileService = function($http, $q, $cookies, $rootScope) {
  'use strict';

  function getProfile() {
    var config = {}; 
    return $http.get("/api/profile", config)
        .then(
        // success
        function (response) {
            return response.data;
        },
        // error
        function (response) {
            console.error("error: ");
            console.error(response);
        });
    }

    function getUserFeed(calls, start) {
      var config = {
        params : {
            calls : calls,
            start : start
          }
      }
      return $http.get('/api/profile/suggestions', config).success(function(response) {
        return addTypeInfoToData(response);
      });
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


  const profileService = {
    getProfile: getProfile,
    getUserFeed: getUserFeed
  };
  return profileService; 

};

ProfileService.$inject = ['$http', '$q', '$cookies', '$rootScope'];
angular.module('WigeonApp').service('ProfileService', ProfileService);

 var SuggestionFactory = function($http, $q, $cookies, $rootScope) {
  'use strict';

  function getAllSuggestions(calls, start) {
    var deferred = $q.defer(); 
    var data = {
      calls : calls,
      start : start 
    }
    $http.post('/api/nest', data).success(function(response) {
      var inboxData = addTypeInfoToData(response);
      deferred.resolve(inboxData); 
    });
    return deferred.promise; 
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