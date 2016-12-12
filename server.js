// server.js
	var express  = require('express');
	var app      = express();
	var morgan = require('morgan');
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override'); 
	var CryptoJS = require("crypto-js");
	var request = require("request");
	var async = require("async");


  	app.use(express.static(__dirname + '/dist'));     // set the static files location /public/img will be /img for users


    // app.use(morgan('dev'));                                      // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());


	// api calls ===================================================================

	app.post('/api/nest', function(req,res) {
	    var cookie = req.body.userCookie;
	    cookie = CryptoJS.AES.decrypt(cookie, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
	    var sugs = [];
	    var response = collectAllSuggestionData(sugs, req.body.start, req.body.calls, cookie, function(data) {
	    	console.log('finished')
	    	data = data.sort(function(a,b) {
	    		return b.inbox_suggestion.suggestion_creation_epoch - a.inbox_suggestion.suggestion_creation_epoch;
	    	});
	    	res.json(data);
	    })
	 
	    // console.log(sugs)
	    // res.json(function(sugs) {

	    // });
	    // // var response = ; 
	    // var response = inboxRequest(cookie, "0", function(data) {
	    // 	res.json(data);
	    // });
	    // res.json(JSON.parse(inboxRequest(cookie, "0"))); 
	});


    // listen (start app with node server.js) ======================================
    
	app.get('*', function(req, res) {
        res.sendFile('dist/index.html', {root: __dirname}); // load the single view file (angular will handle the page changes on the front-end)
	});

    app.listen(4000);
    console.log("App listening on port 4000");


  function collectAllSuggestionData(sugs, start, calls, cookie, callback) {
  		async.times(calls, function(n, next) {
  			inboxRequest(cookie, start.toString(), function(err, data) {
  				var items = JSON.parse(data);
  				sugs = sugs.concat(items.objects);
  				next(err, data);
  			});
  			start++; 
  		}, function(err, data){
  			callback(sugs);
  		});
  }

  function inboxRequest(cookie, page, callback) {
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
	   	{ 	 'cache-control': 'no-cache',
	    	 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
	  	formData: data
	};

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);
	  callback(error, body); 
	});
  }



 	