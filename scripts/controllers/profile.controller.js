var ProfileCtrl = function($scope, $http, $cookies, $window, ProfileService, $rootScope, $sce, YelpFactory) {
  'use strict'
  const vm = this; 

  getUserInfo();
  initListeners();

  $scope.view = "GRID";
  $scope.quantity = 20; 
  vm.filterViewName = "All Suggestions";
  vm.seeMore = seeMore;
  vm.isVideo = false; 
  vm.player; 
  vm.getProfileImg = getProfileImg;

  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/sign-in';
  	}
  	getUserProfile();
    PopulateSuggestions();
  }


function getUserProfile() {
  ProfileService.getProfile().then(
    function(response) {
      var parced = JSON.parse(response);
      if($rootScope.userImg == undefined) {
        $rootScope.userImg = vm.getProfileImg(parced.user_profile_image); 
      }
      $scope.profile = parced;
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
      vm.isVideo = (sug.suggestion_type.title === "WATCH");
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
    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + src + "?enablejsapi=1");
  };

  $scope.returnTrustedSrc = function(src) {
    src = src + "?cb=" + new Date().getTime();
    return $sce.trustAsResourceUrl(src);
  };

  $scope.changeLayout = function(layout) {
    $(".layout-buttons a").each(function() {
      $(this).removeClass("active");
      var img = $(this).children('img');
      getFilterImgSrc(img);
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
        } else if(vm.isVideo) {
          vm.player.destroy(); 
        }
      });

      $("#ProfileCtrl").on('shown.bs.modal', '#SuggestionDetailModal', function () {
        if(vm.isVideo) {
            vm.player = new YT.Player('ytplayer', {
              height: '390',
              width: '100%',
              videoId: $scope.suggestionModelInfo.suggestion_source_item_id,
              events: {}
            });
        }
      });

      $(".search-icon").on("click", function() {
        $(".search-suggestions").show("slow");
      });
      $(".close-search").on("click", function() {
        $(".search-suggestions").hide("slow");
      });

      $('.sort-buttons li').on('click', function() {
        var old = $('.sort-buttons span.active');
        var oldId = '#' + $('.sort-buttons span.active').siblings('a').children('img').prop('id');
        getFilterImgSrc(oldId);
        old.removeClass('active');
        $(this).children('.filter-bullet').addClass('active');
        var newId = '#' + $('.sort-buttons span.active').siblings('a').children('img').prop('id');
        getFilterImgSrc(newId);
      });

      $('.nest-header-item').removeClass('active');
      $('.profile-link').addClass('active');


    });
  }
  function swapFilterViewName(text, id) {
    vm.filterViewName = text; 
    // var newActive = '#'+id;
    // var oldActive = $('.filter-bullet.active').siblings('a').children('img').prop('id');
    // debugger;
    // getFilterImgSrc(newActive);
    // getFilterImgSrc(oldActive);
  }
  function getProfileImg(img) {
  if (img !== undefined) {
      if (img.indexOf('http') === -1){
        return $rootScope.baseApiUrl + img;
       }
      return img;
    }
  return;   
}
  function seeMore() {
    $scope.quantity += 20; 
  }

  $scope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $window.location.href = '/sign-in';
  }

    function getFilterImgSrc(id) {
    var src = $(id).prop('src');
    var newSrc = swapActiveImages(src);
    $(id).prop('src', newSrc);
  }

  function swapActiveImages(src) {
    if(src.indexOf('green') > 0) {
      src = src.replace('green', 'black');
    } else if (src.indexOf('black') > 0) {
      src = src.replace('black', 'green');
    }
    return src; 
  }

 }

ProfileCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'ProfileService', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('ProfileCtrl', ProfileCtrl);

