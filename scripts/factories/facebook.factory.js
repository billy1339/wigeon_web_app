var FacebookFactory = function($q) {
        return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'name, email',
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
}

FacebookFactory.$inject = ["$q"];
angular.module('WigeonApp').factory('FacebookFactory', FacebookFactory);

