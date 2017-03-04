var NestCtrl = function($scope, $http, $cookies, $window, SuggestionFactory, $rootScope, $sce, YelpFactory) {
  'use strict'

  const vm = this; 
  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();
  initListeners();
  getUserImgUrl();

  $scope.view = "GRID";//"LIST";
  $scope.quantity = 20; 
  vm.filterViewName = "All Suggestions";
  vm.swapFilterViewName = swapFilterViewName;
  vm.seeMore = seeMore;  

  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	PopulateSuggestions();
  }

  function PopulateSuggestions() {
    var promise = SuggestionFactory.fetch(1, 0); 
    promise.then(function(response) {
      $scope.suggestions = response; 
      var secondPromise = SuggestionFactory.fetch(10, 1);
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
      if (id == sugs[i].inbox_suggestion.suggestion_id) {
        item = sugs[i].inbox_suggestion;
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

      $("#NestCtrl").on('hidden.bs.modal', '#SuggestionDetailModal', function () {
        var audio = $("#MusicPreview")[0];
        if (audio !== undefined) {
          audio.pause(); 
        } 
      });

      $(".search-icon").on("click", function() {
        $(".search-suggestions").show("slow");
      });

      $('.sort-buttons li').on('click', function() {
        $('.sort-buttons span.active').removeClass('active');
        $(this).children('.filter-bullet').addClass('active');
      });

    });
  }

  function seeMore() {
    $scope.quantity += 20; 
  }

  function getUserImgUrl() {
    $rootScope.userImg = $cookies.get("wigeon_user_img");
  }

  function swapFilterViewName(text) {
    vm.filterViewName = text; 
  }

};

NestCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'SuggestionFactory', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('NestCtrl', NestCtrl);

