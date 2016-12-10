var ProfileCtrl = function($scope, $http, $cookies, $window, ProfileFactory, $rootScope, $sce, YelpFactory) {
  'use strict'

  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();
  initListeners(); 
  $scope.view = "GRID";
  $scope.quantity = 20; 
  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	getUser();
    PopulateSuggestions();
  }


function getUser() {
  var promise = ProfileFactory.fetch();
  promise.then(function(response) {
    console.log(response)
    $scope.profile = response;
  });
}

// function getFeed() {
//   var promise = ProfileFactory.get();
//   promise.then(function(response) {
//     console.log(response)
//     $scope.userFeed = response;
//   });
// }

  
function PopulateSuggestions() {
    var promise = ProfileFactory.get(1, 0);
    promise.then(function(response) {
      console.log(response);
      $scope.suggestions = response; 
      var secondPromise = ProfileFactory.get(10, 1);
      secondPromise.then(function(response) {
        $scope.suggestions = $scope.suggestions.concat(response);
      });
    });
  }

 $scope.populateModal = function(id) {
    var sug = findSuggestion(id);
    $scope.suggestionModelInfo = sug;
    if (sug.suggestion_type.title === "GO") {
      var promise = YelpFactory.fetch(sug.suggestion_source_item_id); 
      promise.then(function(response) {
        console.log(response); 
        $scope.yelp = response; 
        $("#SuggestionDetailModal").modal();
      });
    } else {
      $("#SuggestionDetailModal").modal();
    };
  }

  function findSuggestion(id) {
    var sugs, item;
    sugs = $scope.suggestions;
    for(var i=0; i < sugs.length; i++) {
      if (id == sugs[i].feed_suggestion.suggestion_id) {
        item = sugs[i].feed_suggestion;
        break;
      }
    }
    return item;
  }

  $scope.getIframeSrc = function(src) {
    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + src);
  };

  $scope.returnTrustedSrc = function(src) {
    src = src + "?cb=" + new Date().getTime();
    return $sce.trustAsResourceUrl(src);
  };

  $scope.changeLayout = function(layout) {
    $(".layout-buttons a").each(function() {
      $(this).removeClass("active");
    });
    $("#"+layout+"-LAYOUT").addClass("active");
    $scope.view = layout;
  };


  function initListeners() {
    $(document).ready(function() {

      $("#ProfileCtrl").on('hidden.bs.modal', '#SuggestionDetailModal', function () {
        var audio = $("#MusicPreview")[0];
        if (audio !== undefined) {
          audio.pause(); 
        } 
      });

      $(".search-icon .icon").on("click", function() {
        console.log('hiIIII ');
        $(".search-icon").hide();
        $(".search-suggestions").show("slow");
      });

    });
  }

  $scope.seeMore = function() {
    $scope.quantity += 20; 
  }

  $scope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $window.location.href = '/#/';
  }

 }

ProfileCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'ProfileFactory', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('ProfileCtrl', ProfileCtrl);

