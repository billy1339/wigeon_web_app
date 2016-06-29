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

    // var settings = {
    //   "async": true,
    //   "crossDomain": true,
    //   "url": "http://52.201.120.48/Wigeon/scripts/email-login.php",
    //   "method": "POST",
    //   "processData": false,
    //   "contentType": false,
    //   "mimeType": "multipart/form-data",
    //   "data": signInForm
    // }

    // $.ajax(settings).done(function (response) {
    //   debugger; 
    //   console.log(response);
    // });

// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "http://52.201.120.48/Wigeon/scripts/email-signup.php",
//   "method": "POST",
//   "headers": {
//     "cache-control": "no-cache",
//     "postman-token": "0cddfe87-f976-4e9f-5319-d1457316b249"
//   },
//   "processData": false,
//   "contentType": false,
//   "mimeType": "multipart/form-data",
//   "data": form
// }

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });  




    // var params = new FormData();
    //   params.append("user_email", "will3@test.com");
    //   params.append("user_password", "will123");
    //   params.append("user_full_name", "will_test");
    // var requestUrl = 'http://52.201.120.48/Wigeon/scripts/email-signup.php?'
    //       + 'user_email=' + params.user_email 
    //       + '&user_password=' + params.user_password
    //       + '&user_full_name=' + params.user_full_name
          // + '&user_token=' + params.user_token
          // + '&requesting_user_id=' + params.requesting_user_id
    // //var thing = encodeURI('http://52.201.120.48/Wigeon/scripts/email-signup.php?user_email=will1@test.com&user_password=will123&user_full_name=will_test&user_token=super_token&requestion_user_id=0') 
    // var params = new FormData();
    //   params.append("user_email", "will2@test.com");
    //   params.append("user_password", "will123");
    //   params.append("user_full_name", "will_test");

    // // var params = {
    // //   user_full_name : "will_test",
    // //   user_email : "will4@test.com", 
    // //   user_password : "will123"
    // // }
    // debugger; 
    // $http({
    //   "method" : 'POST',
    //   "url" : 'http://52.201.120.48/Wigeon/scripts/email-signup.php', 
    //   "headers" : {'Content-Type' : 'application/x-www-form-urlencoded'},
    //   "data" : params,
    // }).error(function(response) {
    //   debugger; 
    //   console.log(response)
    // }).success(function(response) {
    //   debugger; 
    //   console.log(response);
    // });
//?user_email=will1@test.com&user_password=will123&user_full_name=will_test',
    // $http.post('http://52.201.120.48/Wigeon/scripts/email-signup.php', JSON.stringify(params))
    //   .then(function(response) {
    //     console.log(response);
    //     debugger; 
    //   });


  // var form = new FormData();
  // form.append("user_email", "will8@test.com");
  // form.append("user_password", "will123");
  // form.append("user_full_name", "will_test");
  // console.log(form);
  // var settings = {
  //   "async": true,
  //   "crossDomain": true,
  //   "url": "http://52.201.120.48/Wigeon/scripts/email-signup.php",
  //   "method": "POST",
  //   "processData": false,
  //   "contentType": false,
  //   "mimeType": "multipart/form-data",
  //   "data": form
  // }

  // $.ajax(settings).done(function (response) {
  //   debugger; 
  //   console.log(response);
  // });
  };

  // facebook sign in  
  // $scope.FacebookSignIn = function(){

  // };

};

SignInCtrl.$inject = ['$scope', '$http'];
angular.module('WigeonApp').controller('SignInCtrl', SignInCtrl);
