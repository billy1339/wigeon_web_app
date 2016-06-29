var SignInCtrl = function($scope, $http) {
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
      console.log(response);
    });
  };
};

SignInCtrl.$inject = ['$scope', '$http'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);
