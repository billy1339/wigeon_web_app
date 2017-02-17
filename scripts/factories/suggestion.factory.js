 var SuggestionFactory = function($http, $q, $cookies, $rootScope) {
  'use strict';

  function getAllSuggestions(calls, start) {
    var deferred = $q.defer(); 
    var data = {
      calls : calls,
      start : start 
    }
    $http.post('/api/nest', data).success(function(response) {
      var inboxData = addTypeInfoToData(response);
      deferred.resolve(inboxData); 
    });
    return deferred.promise; 
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
