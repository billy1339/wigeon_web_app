var SignInCtrl = function($scope, $http, $cookies, $location, $window, FacebookFactory, $rootScope) {
  'use strict'

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
        //$location.path("/nest");
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
        GetFacebookInfo(response);
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

  function GetFacebookInfo(info) {
    var hash = getHash(info.id)
    var facebookSignInForm = new FormData();
    facebookSignInForm.append("user_email", "");
    facebookSignInForm.append("user_fb_id", info.id);
    facebookSignInForm.append("user_full_name", info.name)
    facebookSignInForm.append("user_security_check", hash)

    //const SALT_A = "Superior";
    //const SALT_B = "Boisterious";
    //user user_security_check needs to be sha-256 salted and hashed; 

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": $rootScope.baseApiUrl + "facebook-login.php",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": facebookSignInForm
    }).done(function (response) {
      var deserialized = JSON.parse(response);
      if (deserialized.error_name !== undefined) {
        alert(deserialized.error_name + deserialized.error_message)
      }
      else {
        setUserCookie(deserialized.user_token, deserialized.user_id);
        console.log(deserialized);
        $window.location.href = '/#/nest';
        //$location.path("/nest");
      } 
    });
  }

  function getHash(id) {
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update("Superior"+id+"Boisterious");
    return shaObj.getHash("HEX");
  }

  function setUserCookie(token, id) {
    var cookie = token + "~" + id;
    var today = new Date();
    var exp = new Date(today.getFullYear(), today.getMonth()+1, today.getDate());
    $cookies.put('wigeon_user_token', cookie, { 'expires' : exp })
  };
};

SignInCtrl.$inject = ['$scope', '$http', '$cookies', '$location', '$window', 'FacebookFactory', '$rootScope'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);

