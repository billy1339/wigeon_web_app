 var SuggestionFactory = function($http, $q, $cookies, $rootScope) {
  'use strict';

  function getAllSuggestions(calls, start) {
    var deferred = $q.defer(); 
    var data = {
      calls : calls,
      start : start 
    }
    $http.post('/api/nest', data).success(function(response) {
      // var inboxData = JSON.parse(response);
      var inboxData = addTypeInfoToData(response);
      deferred.resolve(inboxData); 
    });
    return deferred.promise; 
  //   var cookie = $cookies.get("wigeon_user_token");
  //   var cookie = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
  //   var sugs = [];
  //   var deferred = $q.defer();
  //   var promises = [];
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

  // function inboxRequest(cookie, page) {
  //     var deferred = $q.defer();
  //     var fetchInbox = new FormData();
  //     fetchInbox.append("requesting_user_id", cookie[1]); // needs to be replaced with actual users id (somehow attach to )
  //     fetchInbox.append("page", page);
  //     fetchInbox.append("search_query", "");
  //     fetchInbox.append("suggestion_type", "");
  //     fetchInbox.append("starred_only", "");
  //     fetchInbox.append("reminders_only", "");
  //     fetchInbox.append("user_token", cookie[0]);

  //     $.ajax({
  //       "async": true,
  //       "crossDomain": true,
  //       "url": "http://52.201.120.48/Wigeon/scripts/fetch-inbox.php",
  //       "method": "POST",
  //       "processData": false,
  //       "contentType": false,
  //       "mimeType": "multipart/form-data",
  //       "data": fetchInbox
  //     }).done(function (response) {
  //       var inboxData = JSON.parse(response);
  //       inboxData = addTypeInfoToData(inboxData.objects);
  //       deferred.resolve(inboxData) 
  //     });
  //     return deferred.promise;
  }

  function addTypeInfoToData(data) {
    for(var i=0; i < data.length; i++) {
      var type = populateType(data[i].inbox_suggestion.suggestion_type);
      data[i].inbox_suggestion.suggestion_type = type; 
    }
    return data; 
  };

  function populateType(typeid) {
    return $rootScope.types[typeid]
  }

  return {
    fetch: getAllSuggestions
  };

};

SuggestionFactory.$inject = ['$http', '$q', '$cookies', '$rootScope'];
angular.module('WigeonApp').factory('SuggestionFactory', SuggestionFactory);
