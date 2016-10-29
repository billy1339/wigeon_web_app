var NestCtrl = function($scope, $http, $cookies, $window, SuggestionFactory) {
  'use strict'

  // we want to get all the user info right off the back and probably have deferred promise
  getUserInfo();

  function getUserInfo() {
  	var user_token = $cookies.get("wigeon_user_token");
  	if (!user_token) {
  		$window.location.href = '/#/';
  	}
  	PopulateSuggestions();
  }

  function PopulateSuggestions() {
    var promise = SuggestionFactory.fetch();
    promise.then(function(response) {
      $scope.suggestions = response.objects; 
    });
  }

  $scope.populateModal = function(id) {
    $scope.suggestionModelInfo = findSuggestion(id);
    $("#SuggestionModal").modal({
      keyboard: true
    });
    // what to do if it cannot find one....???
  }

  function findSuggestion(id) {
    var sugs, items;
    sugs = $scope.suggestions;
    for(var i=0; i < sugs.length; i++) {
      if (id == sugs[i].inbox_suggestion.suggestion_id) {
        items = sugs[i].inbox_suggestion;
        break;
      }
    }
    return items;
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
};

NestCtrl.$inject = ['$scope', '$http', '$cookies', '$window', 'SuggestionFactory'];
angular.module('WigeonApp').controller('NestCtrl', NestCtrl);

