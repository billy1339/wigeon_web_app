var appRoutes = function($routeProvider, $locationProvider) {
  'use strict';
  $routeProvider
    .when('/sign-in', {
      templateUrl: 'views/sign-in.html'
    })
    .when('/sign-up', {
      templateUrl: 'views/sign-up.html'
    })
    .when('/nest', {
      templateUrl: 'views/nest.html'
    })
    .when('/profile', {
      templateUrl: 'views/profile.html'
    })
    .otherwise({
      redirectTo: '/sign-in'
    });
    
    // $locationProvider.html5Mode(true);
};
appRoutes.$inject = ['$routeProvider', '$locationProvider'];
angular.module('WigeonApp').config(appRoutes);


