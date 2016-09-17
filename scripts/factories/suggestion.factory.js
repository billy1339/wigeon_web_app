 var SuggestionFactory = function($http, $q, $cookies) {
  'use strict';
  var fetchInbox = function() {
      var deferred, posts;
      deferred = $q.defer();

    var fetchInbox = new FormData();
      fetchInbox.append("requesting_user_id", 115); // needs to be replaced with actual users id (somehow attach to )
      fetchInbox.append("page", "");
      fetchInbox.append("search_query", "");
      fetchInbox.append("suggestion_type", "");
      fetchInbox.append("starred_only", "");
      fetchInbox.append("reminders_only", "");
      fetchInbox.append("user_token", $cookies.get("wigeon_user_token"));

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
        var inboxData = JSON.parse(response);
        deferred.resolve(inboxData)
      });

      return deferred.promise;
  };


  return {
    fetch: fetchInbox
  };

};

SuggestionFactory.$inject = ['$http', '$q', '$cookies'];
angular.module('WigeonApp').factory('SuggestionFactory', SuggestionFactory);
