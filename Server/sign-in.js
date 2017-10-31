// methods used for signing user in
var request = require("request");
var config = require('./config.json');
var CryptoJS = require("crypto-js");



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
		  	url: config.requestUrl + 'scripts/facebook-login.php',
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
		  	url: config.requestUrl + 'scripts/send-forgot-password-email.php',
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

  	self.emailSignIn = function(data, callback) {
		var data = {
	    	user_email : data.email,
	    	user_password : data.password
	    }
		var options = { 
			method: 'POST',
		  	url: config.requestUrl + 'scripts/email-login.php',
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

  	self.encryptUserCookie = function(token, id) {
		var cookie = token + "~" + id;
		var encrypted = CryptoJS.AES.encrypt(cookie, "Wigeon");
		return encrypted;
  	}
}

module.exports.SignIn = SignIn; 



