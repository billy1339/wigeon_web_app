 var SuggestionFactory = function($http, $q, $cookies, $rootScope) {
  'use strict';
  var fetchInbox = function() {
      var deferred, posts;
      deferred = $q.defer();

    var cookie = $cookies.get("wigeon_user_token").split("~");

    var fetchInbox = new FormData();
      fetchInbox.append("requesting_user_id", cookie[1]); // needs to be replaced with actual users id (somehow attach to )
      fetchInbox.append("page", "");
      fetchInbox.append("search_query", "");
      fetchInbox.append("suggestion_type", "");
      fetchInbox.append("starred_only", "");
      fetchInbox.append("reminders_only", "");
      fetchInbox.append("user_token", cookie[0]);

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
        var inboxData = JSON.parse(response);
        inboxData = addTypeInfoToData(inboxData);
        deferred.resolve(inboxData)
      });

      return deferred.promise;
  };

  function addTypeInfoToData(data) {
    for(var i=0; i < data.objects.length; i++) {
      var type = populateType(data.objects[i].inbox_suggestion.suggestion_type);
      data.objects[i].inbox_suggestion.suggestion_type = type; 
    }
    return data; 
  };

  function populateType(typeid) {
    return $rootScope.types[typeid]
  }

  return {
    fetch: fetchInbox
  };

};

SuggestionFactory.$inject = ['$http', '$q', '$cookies', '$rootScope'];
angular.module('WigeonApp').factory('SuggestionFactory', SuggestionFactory);
