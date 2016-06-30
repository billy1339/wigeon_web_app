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
      var deserialized = JSON.parse(response);
      setUserCookie(deserialized.user_token);
    });
  };

  function setUserCookie(token) {
    var today = new Date();
    var exp = new Date(today.getFullYear(), today.getMonth()+1, today.getDate());
    $cookies.put('wigeon_user_token', token, { 'expires' : exp })
  };
};

SignInCtrl.$inject = ['$scope', '$http', '$cookies'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);
