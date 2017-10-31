 var YelpFactory = function($http, $q, $rootScope, $sce) {
  'use strict';

  function fetch(yelp_app_id) {
    var config = {
      params : {
        yelpId : yelp_app_id
      }
    };
    
    var deferred = $q.defer();
    $http.get('/api/yelp', config).then(function(response) {
      var parsed = JSON.parse(response.data)
      deferred.resolve(parsed);
    });
    return deferred.promise;
  }

  return {
    fetch: fetch
  };



};

YelpFactory.$inject = ['$http', '$q', '$rootScope', '$sce'];
angular.module('WigeonApp').factory('YelpFactory', YelpFactory);
