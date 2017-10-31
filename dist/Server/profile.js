var async = require("async");
var request = require("request");
var CryptoJS = require("crypto-js");
var config = require('./config.json');

function ProfileService() {
  const self = this;

  self.getProfile = function(cookie, callback) {
      var userData = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
      var data = {
        user_id: userData[1],
        requesting_user_id: userData[1], // needs to be replaced with actual users id (somehow attach to )
        user_token: userData[0],
      }
      var options = { 
        method: 'POST',
        url: config.requestUrl + 'scripts/fetch-user.php',
        headers: 
        {  'cache-control': 'no-cache',
           'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' 
         },
        formData: data        
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(error, body); 
      });
  }

  self.collectAllSuggestionData = function(sugs, start, calls, cookie, callback) {
      async.times(parseInt(calls), function(n, next) {
        self.inboxRequest(cookie, start, function(err, data) {
          var items = JSON.parse(data);
          sugs = sugs.concat(items.objects);
          next(err, data);
        });
        start++; 
      }, function(err, data){
        if(err) throw new Error(error);
        callback(sugs);
      });
  };

  self.inboxRequest = function(cookie, page, callback) {
    debugger; 
    var data = {
      user_id : cookie[1],
      requesting_user_id : cookie[1],
      user_token : cookie[0],
      page : page, 
      search_query : "",
    }
    var options = { 
      method: 'POST',
        url: config.requestUrl + 'scripts/fetch-user-feed.php',
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

// TODO. 
function defaultCallback(response, callback) {
	callback(response);
}

module.exports.ProfileService = ProfileService;