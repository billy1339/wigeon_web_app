var appRoutes = function($routeProvider) {
  'use strict';
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });

};
appRoutes.$inject = ['$routeProvider'];
angular.module('WigeonApp').config(appRoutes);


