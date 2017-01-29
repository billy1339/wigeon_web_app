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

