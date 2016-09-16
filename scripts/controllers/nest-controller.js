var NestCtrl = function($scope, $http, $cookies, $window) {
  'use strict'

  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();

  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	PopulateSuggestions();
  }

  function PopulateSuggestions() {
  	debugger 
  	var fetchInbox = new FormData();
    fetchInbox.append("requesting_user_id", 115);
    fetchInbox.append("page", "");
    fetchInbox.append("search_query", "");
    fetchInbox.append("suggestion_type", "");
    fetchInbox.append("starred_only", "");
    fetchInbox.append("reminders_only", "");
    fetchInbox.append("user_token", "df0614d17a66e94fe0a76b66847d002c1a822b5c589856a9b820f286bd4d11a1")
    //fetchInbox.append("user_token", $cookies.get("wigeon_user_token"));

    $.ajax({
      "async": true,
      "crossDomain": true,
      "url": "http://52.201.120.48/Wigeon/scripts/fetch-inbox.php",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": fetchInbox
    }).done(function (response) {
      debugger; 
      var deserialized = JSON.parse(response);
      if (deserialized.error_name !== undefined) {
        alert(deserialized.error_name + deserialized.error_message)
      }
      else {
        //setUserCookie(deserialized.user_token);
      }
    });







    var suggestionData = new FormData();
  	suggestionData.append("requesting_user_id", 929);
  	suggestionData.append("page", 0);
  	suggestionData.append("search_query", "");
    suggestionData.append("suggestion_type", 4);
  	suggestionData.append("user_token", $cookies.get("wigeon_user_token"));

  	// $.ajax({
   //    "async": true,
   //    "crossDomain": true,
   //    "url": "http://52.201.120.48/Wigeon/scripts/fetch-feed.php",
   //    "method": "POST",
   //    "processData": false,
   //    "contentType": false,
   //    "mimeType": "multipart/form-data",
   //    "data": suggestionData
   //  }).done(function (response) {
   //  	debugger; 
   //    var deserialized = JSON.parse(response);
   //    if (deserialized.error_name !== undefined) {
   //      alert(deserialized.error_name + deserialized.error_message)
   //    }
   //    else {
   //      //setUserCookie(deserialized.user_token);
   //    }
   //  });
  }

  $scope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $window.location.href = '/#/';
  }
};

NestCtrl.$inject = ['$scope', '$http', '$cookies', '$window'];
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