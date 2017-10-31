 var ProfileService = function($http, $q, $cookies, $rootScope) {
  'use strict';

  function getProfile() {
    var config = {}; 
    return $http.get("/api/profile", config)
        .then(
        // success
        function (response) {
            return response.data;
        },
        // error
        function (response) {
            console.error("error: ");
            console.error(response);
        });
    }

    function getUserFeed(calls, start) {
      var config = {
        params : {
            calls : calls,
            start : start
          }
      }
      return $http.get('/api/profile/suggestions', config).success(function(response) {
        return addTypeInfoToData(response);
      });
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


  const profileService = {
    getProfile: getProfile,
    getUserFeed: getUserFeed
  };
  return profileService; 

};

ProfileService.$inject = ['$http', '$q', '$cookies', '$rootScope'];
angular.module('WigeonApp').service('ProfileService', ProfileService);
