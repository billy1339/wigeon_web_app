// server.js
	require('newrelic');
	var express  = require('express');
	var app      = express();
	var morgan = require('morgan');
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override'); 
	var CryptoJS = require("crypto-js");
	var request = require("request");
	var cookieParser = require('cookie-parser');
	var Nest = require('./Server/nest.js').Nest;
	var SignIn = require('./Server/sign-in.js').SignIn;
	var WigeonConsts = require('./Server/wigeon-consts.js').WigeonConsts;
	var Yelp = require('./Server/yelp.js').Yelp;
	var ProfileService = require('./Server/profile.js').ProfileService;
	var config = require('./Server/config.json');
	var EmailService = require('./Server/EmailService.js').EmailService;
	var Helpers = require('./Server/Helpers/Helpers.js').Helpers; 
	var querystring = require('querystring');
  	app.use(express.static(__dirname + '/dist'));     // set the static files location /public/img will be /img for users
	app.use(cookieParser());

    // app.use(morgan('dev'));                                      // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());


	// api calls ===================================================================

	app.post('/api/nest', function(req,res) {
	    var cookie = CryptoJS.AES.decrypt(req.cookies.wigeon_user_token, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
	    var sugs = [];
	    var nest = new Nest();  
	    var response = nest.collectAllSuggestionData(sugs, req.body.start, req.body.calls, cookie, function(data) {
	    	data = data.sort(function(a,b) {
	    		return b.inbox_suggestion.suggestion_creation_epoch - a.inbox_suggestion.suggestion_creation_epoch;
	    	});
	    	res.json(data);
	    })
	});

	app.post('/api/email-sign-in', function(req, res) {
		var signInService = new SignIn();
		signInService.emailSignIn(req.body, function(error, response, body) {
			var result = JSON.parse(response);
			
			if(result.error_name !== undefined) {
				res.json({
					success: false,
					error_message: result.error_message
				});
			} else {
				var userImg = result.user_profile_image != undefined ? config.requestUrl + result.user_profile_image : undefined;
				var cookieValue = signInService.encryptUserCookie(result.user_token, result.user_id)
    			res.cookie('wigeon_user_token', cookieValue.toString(), { maxAge: 7776000000});
				res.json({
					success: true,
					user_img: userImg
				});
			} 
		});
	});

	app.post('/api/facebook-sign-in', function(req, res) {
		var data = req.body;
		var jsonResponse; 
		var consts = new WigeonConsts(); 
		var signIn = new SignIn(); 
		var hashedInfo = CryptoJS.SHA256(consts.SALTA+data.id+consts.SALTB).toString();
	    signIn.facebookSignInRequest(data, hashedInfo, function(error, body) {
	    	if(body.error_name !== undefined) {
	    		res.json({
	    			success: false,
	    			error_message : body.error_message
	    		});
	    	} else {
	    		var deserialized = JSON.parse(body);
				var cookieValue = signIn.encryptUserCookie(deserialized.user_token, deserialized.user_id);
    			res.cookie('wigeon_user_token', cookieValue.toString(), { maxAge: 7776000000});
    			res.json({
    				success : true,
    				user_img : deserialized.user_profile_image
    			});
	    	}
	    });

	});

	app.get('/api/yelp', function(req, res) {
		var yelp = new Yelp();
		yelp.GetPlace(req.query.yelpId, function(error, response, body) {
			res.json(body);
		});
	});


    app.get('/api/profile', function(req, res) {
        var cookie = req.cookies.wigeon_user_token;
        var profile = new ProfileService();
        profile.getProfile(cookie, function(error, response) {
        	var error = JSON.parse(response)
        	if(error.error_name != undefined) {
        		res.json(error.error_name + ": " + error.error_message);
        	}
        	res.json(response);
        });
    });

	app.get('/api/profile/suggestions', function(req,res) {
	    var cookie = CryptoJS.AES.decrypt(req.cookies.wigeon_user_token, "Wigeon").toString(CryptoJS.enc.Utf8).split("~");
	    var sugs = [];
	    var profile = new ProfileService();  
	    var response = profile.collectAllSuggestionData(sugs, req.query.start, req.query.calls, cookie, function(data) {
	    	data = data.sort(function(a,b) {
	    		return b.suggestion_creation_epoch - a.suggestion_creation_epoch;
	    	});
	    	res.json(data);
	    })
	});

	app.post('/api/forgot-password', function(req, res) {
		var passwordSend = new SignIn();
		passwordSend.forgotPassword(req.body.email, function(error, response, body) {
			res.json(response);
		});
	});

	app.post('/api/contact-us-email', function(req, res) {
		var cookie = res.cookie('wigeon_user_token');
		var userId; 
		if (cookie != undefined) {
			var helpers = new Helpers();
			var userId = helpers.GetIdFromUserCookie(cookie); 
		} else {
			userId = 0; 
		}
		
		var emailService = new EmailService();
		emailService.sendContactUsEmail(req.body.Email, req.body.Note, userId);
	});

    // listen (start app with node server.js) ======================================
    
	app.get('*', function(req, res) {
        res.sendFile('dist/index.html', {root: __dirname}); // load the single view file (angular will handle the page changes on the front-end)
	});

    app.listen(8081);
    console.log("App listening on port 8081");






 	