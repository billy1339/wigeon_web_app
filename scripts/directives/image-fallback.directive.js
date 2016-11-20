var imageFallback = function() {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
      	var newSrc = "http://52.201.120.48/Wigeon/" + iAttrs.fallbackSrc;
        angular.element(this).attr("src", newSrc);
      });
    }
   }
   return fallbackSrc;
};

angular.module('WigeonApp').directive('fallbackSrc', imageFallback);
