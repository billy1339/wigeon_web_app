// special thanks to angulike... this could be cut down more. 
var fbButton = function ($window, $rootScope) {
              return {
                  link: function (scope, element, attrs) {
                      if (!$window.FB) {
                          // Load Facebook SDK if not already loaded
                          $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
                              $window.FB.init({
                                  appId: $rootScope.facebookAppId,
                                  xfbml: true,
                                  version: 'v2.0'
                              });
                              renderFBButton();
                          });
                      } else {
                          renderFBButton();
                      }

					  var watchAdded = false;
                      function renderFBButton() {
                          if (!!attrs.fbButton && !scope.fbButton && !watchAdded) {
                          	  console.log('debug this senerio..... fb directive')
                              // wait for data if it hasn't loaded yet
							  var watchAdded = true;
                              var unbindWatch = scope.$watch('fbButton', function (newValue, oldValue) {
							      if (newValue) {
								      renderFBButton();

									  // only need to run once
									  unbindWatch();
								  }

                              });
                              return;
                          } else {
                              $window.FB.XFBML.parse(element.parent()[0]);
                          }
                      }
                  }
              };
          }

fbButton.$inject = ['$window', '$rootScope'];
angular.module('WigeonApp').directive('fbButton', fbButton);




