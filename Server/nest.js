// functions for the nest 
var async = require("async");
var request = require("request");



var Nest = function() {
  var self = this;

  self.collectAllSuggestionData = function(sugs, start, calls, cookie, callback) {
      async.times(calls, function(n, next) {
        self.inboxRequest(cookie, start.toString(), function(err, data) {
          var items = JSON.parse(data);
          sugs = sugs.concat(items.objects);
          next(err, data);
        });
        start++; 
      }, function(err, data){
        callback(sugs);
      });
  };

  self.inboxRequest = function(cookie, page, callback) {
    var data = {
      requesting_user_id : cookie[1],
      page : page, 
      search_query : "",
      suggestion_type : "",
      starred_only : "",
      reminders_only : "",
      user_token : cookie[0]
    }
    var options = { 
      method: 'POST',
        url: 'http://52.201.120.48/Wigeon/scripts/fetch-inbox.php',
        headers: 
        {    'cache-control': 'no-cache',
           'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
        formData: data
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      callback(error, body); 
    });

  };
}

module.exports.Nest = Nest;