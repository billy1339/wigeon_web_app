 var ProfileFactory = function($http, $q, $cookies, $rootScope) {
  'use strict';

  // function getUser(calls, start) {
  //   var cookie = $cookies.get("wigeon_user_token").split("~");
  //   var deferred = $q.defer();
  //   var promises = userRequest;
  //   for(var i = start; i < calls; i ++) {
  //     promises.push(inboxRequest(cookie, i.toString())); 
  //   }
  //   $q.all(promises).then(function(result) {
  //     for(var i=0; i < result.length; i++) {
  //       sugs = sugs.concat(result[i]);
  //     }
  //     deferred.resolve(sugs); 
  //   });
  //   return deferred.promise; 
  // };

  function userRequest() {
      var cookie = $cookies.get("wigeon_user_token");
      cookie = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
      var deferred = $q.defer();
      var fetchUser = new FormData();
      fetchUser.append("user_id", cookie[1]);
      fetchUser.append("requesting_user_id", cookie[1]); // needs to be replaced with actual users id (somehow attach to )
      fetchUser.append("user_token", cookie[0]);

      $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "http://52.201.120.48/Wigeon/scripts/fetch-user.php",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": fetchUser
      }).done(function (response) {
        var userData = JSON.parse(response);
        deferred.resolve(userData) 
      });
      return deferred.promise;
  }

    function userFeed(page) {
      var cookie = $cookies.get("wigeon_user_token");
      cookie = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
      var deferred = $q.defer();
      var getUser = new FormData();
      getUser.append("user_id", cookie[1]);
      getUser.append("requesting_user_id", cookie[1]); // needs to be replaced with actual users id (somehow attach to )
      getUser.append("user_token", cookie[0]);
      getUser.append("page", page);
      getUser.append("search_query", "");



      $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "http://52.201.120.48/Wigeon/scripts/fetch-user-feed.php",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": getUser
      }).done(function (response) {
        var feedData = JSON.parse(response);
        feedData = addTypeInfoToData(feedData.objects);
        deferred.resolve(feedData) 
      });
      return deferred.promise;
  }


  function addTypeInfoToData(data) {
    for(var i=0; i < data.length; i++) {
      var type = populateType(data[i].feed_suggestion.suggestion_type);
      data[i].feed_suggestion.suggestion_type = type; 
    }
    return data; 
  };

  function populateType(typeid) {
    return $rootScope.types[typeid]
  }


  return {
    fetch: userRequest,
    get: userFeed
  };

};

ProfileFactory.$inject = ['$http', '$q', '$cookies', '$rootScope'];
angular.module('WigeonApp').factory('ProfileFactory', ProfileFactory);
