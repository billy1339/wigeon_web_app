// methods used for signing user in
var request = require("request");
var config = require('./config.json');



var SignIn = function() {
	var self = this; 

	self.facebookSignInRequest = function(data, hashedInfo, callback){
	    var data = {
	    	user_email : "",
	    	user_fb_id : data.id, 
	    	user_full_name : data.name,
	    	user_security_check : hashedInfo
	    }
		var options = { 
			method: 'POST',
		  	url: 'http://52.201.120.48/Wigeon/scripts/facebook-login.php',
		  	headers: 
		   	{ 	 'cache-control': 'no-cache',
		    	 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
		  	formData: data	  		
		};

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);
		  callback(error, body); 
		});
  	};

	self.forgotPassword = function(email, callback){
	    var data = {
	    	email : email
	    }
		var options = { 
			method: 'POST',
		  	url: 'http://52.201.120.48/Wigeon/scripts/send-forgot-password-email.php',
		  	headers: 
		   	{ 	 'cache-control': 'no-cache',
		    	 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
		  	formData: data	  		
		};

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);
		  callback(error, body); 
		});
  	};
}

module.exports.SignIn = SignIn; 



