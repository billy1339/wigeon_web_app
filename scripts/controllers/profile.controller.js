var ProfileCtrl = function($scope, $http, $cookies, $window, ProfileFactory, $rootScope, $sce, YelpFactory) {
  'use strict'

  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();

  $scope.view = "LIST";
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
      if (id == sugs[i].inbox_suggestion.suggestion_id) {
        item = sugs[i].inbox_suggestion;
        break;
      }
    }
    return item;
  }

// inbox_suggestion
// suggestion_address
// suggestion_background_image
// suggestion_content_author
// suggestion_creation_epoch
// suggestion_creator_user_id
// suggestion_description
// suggestion_general_link
// suggestion_icon_image
// suggestion_id
// suggestion_in_inbox
// suggestion_is_deleted
// suggestion_is_private
// suggestion_is_self_suggestion
// suggestion_is_starred
// suggestion_last_comment
// suggestion_media_string
// suggestion_num_comments
// suggestion_num_stars
// suggestion_parent_suggestion_id
// suggestion_secondary_source_link
// suggestion_source
// suggestion_source_item_id
// suggestion_source_media_link
// suggestion_source_preview_link
// suggestion_subtype_string
// suggestion_tags
// suggestion_title
// suggestion_type
// suggestion_url

  $scope.SignOut = function() {
    $cookies.remove("wigeon_user_token");
    $window.location.href = '/#/';
  }

 }

ProfileCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'ProfileFactory', '$rootScope', '$sce', 'YelpFactory'];
angular.module('WigeonApp').controller('ProfileCtrl', ProfileCtrl);

