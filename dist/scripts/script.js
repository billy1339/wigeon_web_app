angular.module('WigeonApp', ['ngRoute', 'ngCookies']);

// .config(function( $locationProvider) {
//    if(window.history && window.history.pushState){
// 	   $locationProvider.html5Mode({
// 		   enabled: true,
// 		   requireBase: false
// 		});
//    }
// })	
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
var appRoutes = function($routeProvider) {
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
    .otherwise({
      redirectTo: '/'
    });
    
    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
};
appRoutes.$inject = ['$routeProvider'];
angular.module('WigeonApp').config(appRoutes);



var SignInCtrl = function($scope, $http, $cookies) {
  'use strict'

  $scope.UserLogin = function(user) {

    var signInForm = new FormData();
    signInForm.append("user_email", user.email);
    signInForm.append("user_password", user.password);

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "http://52.201.120.48/Wigeon/scripts/email-login.php",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": signInForm
    }).done(function (response) {
      debugger; 
      setUserCookie('hi');
      console.log(response);
    });
  };

  function setUserCookie(token) {
    $cookies.put('user_token', token)
  };
};

SignInCtrl.$inject = ['$scope', '$http', '$cookies'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);

var SignUpCtrl = function($scope, $http) {
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
      debugger; 
      console.log(response);
    });

  };
};

SignUpCtrl.$inject = ['$scope', '$http'];
angular.module('WigeonApp').controller('SignUpCtrl', SignUpCtrl);
