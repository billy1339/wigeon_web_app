 var YelpFactory = function($http, $q, $rootScope, $sce) {
  'use strict';

  function fetch(yelp_app_id) {
    var deferred = $q.defer();
    var method = 'GET';
    var url = 'https://api.yelp.com/v2/business/' + yelp_app_id;
    var params = {
            callback: 'angular.callbacks._0',
            oauth_consumer_key: 'lKkcg8K312U3GcPuF8d_Eg', //Consumer Key
            oauth_token: 'gHBzFC4tETChx6cIN8Te4-Spchzlhcpn', //Token
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: new Date().getTime(),
            oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
        };
    var consumerSecret = 'aAYgRl9NlmCZeVAhMMzNaHR380U'; //Consumer Secret
    var tokenSecret = 'CwneNMN8-3SfuVhsqv6wU48THfI'; //Token Secret
    var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
    params['oauth_signature'] = signature;
    url += "?callback=JSON_CALLBACK";
    $http.jsonp(url, {params: params}).success(function(response) {
      deferred.resolve(response);
    });
    return deferred.promise; 
  }

   function randomString(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
    }

  return {
    fetch: fetch
  };



};

YelpFactory.$inject = ['$http', '$q', '$rootScope', '$sce'];
angular.module('WigeonApp').factory('YelpFactory', YelpFactory);
