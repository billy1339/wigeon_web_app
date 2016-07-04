var NestCtrl = function($scope, $http, $cookies) {
  'use strict'

  $scope.SignOut = function() {
    debugger; 
    $cookies.remove("wigeon_user_token");
    // $location.path('/HomePage');
  }
};

NestCtrl.$inject = ['$scope', '$http', '$cookies'];
angular.module('WigeonApp').controller('NestCtrl', NestCtrl);


// .controller('LoginCtrl', function ($scope, LoginService, $ionicPopup,,$location.) {
//     $scope.data = {};

//     $scope.login = function () {
//         LoginService.loginUser($scope.data.username, $scope.data.password).success(function (data) {

//             $location.path('/HomePage'); // working

//         }).error(function (data) {
//             var alertPopup = $ionicPopup.alert({
//                 title: 'Login failed!',
//                 template: 'Please check your credentials!'
//             });
//         });
//     }
// })