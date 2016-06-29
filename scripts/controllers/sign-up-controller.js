var SignUpCtrl = function($scope, $http) {
  'use strict'

  $scope.EmailSignUp = function(user) {

    var form = new FormData();
    form.append("user_email", "will8@test.com");
    form.append("user_password", "will123");
    form.append("user_full_name", "will_test");

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
