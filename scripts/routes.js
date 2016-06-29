var appRoutes = function($routeProvider) {
  'use strict';
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html'
    })
    .when('/sign-in', {
      templateUrl: 'views/sign-in.html'
    })
    .when('/nest', {
      templateUrl: 'views/nest.html'
    })
    .otherwise({
      redirectTo: '/'
    });
    
    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
};
appRoutes.$inject = ['$routeProvider'];
angular.module('WigeonApp').config(appRoutes);


