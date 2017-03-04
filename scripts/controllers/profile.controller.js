var ProfileCtrl = function($scope, $http, $cookies, $window, ProfileService, $rootScope, $sce, YelpFactory) {
  'use strict'

  getUserInfo();
  initListeners();

  $scope.view = "GRID";
  $scope.quantity = 20; 
  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	getUserProfile();
    PopulateSuggestions();
  }


function getUserProfile() {
  ProfileService.getProfile().then(
    function(response) {
      $scope.profile = JSON.parse(response);
    });
}

  
function PopulateSuggestions() {
  ProfileService.getUserFeed(1,0).then(function(response) {
    $scope.suggestions = response.data;
    ProfileService.getUserFeed(10, 1).then(function(response) {
      $scope.suggestions = $scope.suggestions.concat(response.data);
    })
  })
}

 $scope.populateModal = function(id) {
    var sug = findSuggestion(id);
    $scope.suggestionModelInfo = sug;
    if (sug.suggestion_type.title === "GO") {
      var promise = YelpFactory.fetch(sug.suggestion_source_item_id); 
      promise.then(function(response) {
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
        $(".search-icon").hide();
        $(".search-suggestions").show("slow");
      });

    });
  }
$scope.getProfileImg = function(img) {
  if (img !== undefined) {
      if (img.indexOf('http') === -1){
        return "http://52.201.120.48/Wigeon/" + img;
       }
      return img;
    }
  return;   
}
  $scope.seeMore = function() {
    $scope.quantity += 20; 
  }

  $scope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $window.location.href = '/#/';
  }

 }

ProfileCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'ProfileService', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('ProfileCtrl', ProfileCtrl);

