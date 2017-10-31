var SignInCtrl = function($scope, $http, $cookies, $location, $window, FacebookFactory, $rootScope, $q) {
  'use strict'

  const vm = this; 
  vm.forgotPassword = forgotPassword; 
  vm.forgotPasswordSuccessmessage = "";
  getUserInfo();

  function getUserInfo() {
    var user_token = $cookies.get("wigeon_user_token");
    if (user_token) {
      $window.location.href = '/nest';
    } 
  }


  $scope.UserLogin = function(user) {
    $http.post('/api/email-sign-in', user).success(function(response){
      if(response.success) {
          // w/correct url.
          setUserImgCookie(response.user_img);
          $rootScope.IsUserSignedIn(); 
          $window.location.href = '/nest';
        } else {
          alert(response.error_message);
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
            $rootScope.IsUserSignedIn(); 
            $window.location.href = '/nest';
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

  function forgotPassword(email){
    var data = {
      email: email
    }
    $http.post("/api/forgot-password", data).success(function(response) {
      var deserialized = JSON.parse(response);
      $(".password-recover-items").hide();
      vm.forgotPasswordSuccessmessage = deserialized.success_message; 
    });
  }
};

SignInCtrl.$inject = ['$scope', '$http', '$cookies', '$location', '$window', 'FacebookFactory', '$rootScope', '$q'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);

