var SignUpCtrl = function($scope, $http, $cookies) {
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
        setUserCookie(deserialized.user_token);
      }
    });

  };

  function setUserCookie(token) {
    var today = new Date();
    var exp = new Date(today.getFullYear(), today.getMonth()+3, today.getDate());
    $cookies.put('wigeon_user_token', token, { 'expires' : exp })
  };

  //$cookies.remove("wigeon_user_token");
};

SignUpCtrl.$inject = ['$scope', '$http', '$cookies'];
angular.module('WigeonApp').controller('SignUpCtrl', SignUpCtrl);
