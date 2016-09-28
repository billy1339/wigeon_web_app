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
        setUserCookie(deserialized.user_token);
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
        debugger; 
        GetFacebookInfo(response, facebookStatusResponse.authResponse.signedRequest);
      });
      //var fbToken = response.AuthResponse.userID;
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

  function GetFacebookInfo(info, accessToken) {
    var facebookSignInForm = new FormData();
    console.log(info)
    console.log(accessToken)
    facebookSignInForm.append("user_email", "");
    facebookSignInForm.append("user_fb_id", info.id);
    facebookSignInForm.append("user_full_name", info.name)
    facebookSignInForm.append("user_security_check", accessToken)

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
      debugger; 
      var deserialized = JSON.parse(response);
      if (deserialized.error_name !== undefined) {
        alert(deserialized.error_name + deserialized.error_message)
      }
      else {
        setUserCookie(deserialized.user_token);
        console.log(deserialized);
        $window.location.href = '/#/nest';
        //$location.path("/nest");
      } 
    });
  }



  // This is called with the results from from FB.getLoginStatus().
  // function statusChangeCallback(response) {
  //   console.log('statusChangeCallback');
  //   console.log(response);
  //   // The response object is returned with a status field that lets the
  //   // app know the current login status of the person.
  //   // Full docs on the response object can be found in the documentation
  //   // for FB.getLoginStatus().
  //   if (response.status === 'connected') {
  //     // Logged into your app and Facebook.
  //     // testAPI();
  //   } else if (response.status === 'not_authorized') {
  //     // The person is logged into Facebook, but not your app.
  //     document.getElementById('status').innerHTML = 'Please log ' +
  //       'into this app.';
  //   } else {
  //     // The person is not logged into Facebook, so we're not sure if
  //     // they are logged into this app or not.
  //     document.getElementById('status').innerHTML = 'Please log ' +
  //       'into Facebook.';
  //   }
  // }

  function setUserCookie(token) {
    var today = new Date();
    var exp = new Date(today.getFullYear(), today.getMonth()+1, today.getDate());
    $cookies.put('wigeon_user_token', token, { 'expires' : exp })
  };
};

SignInCtrl.$inject = ['$scope', '$http', '$cookies', '$location', '$window', 'FacebookFactory', '$rootScope'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);

