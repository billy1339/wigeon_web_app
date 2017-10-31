var config = require('../config.json');
var CryptoJS = require("crypto-js");


var Helpers = function() {
	var self = this; 

	self.GetIdFromUserCookie = function(cookie) {
		var decrypted = DecryptString(cookie);
		return decrypted.split("~")[1]; //take the second part of the cookie, the id; 
	}

	function DecryptString(string) {
		return CryptoJS.AES.decrypt(string, config.EncryptionKey).toString(CryptoJS.enc.Utf8).split("~");
	};

}

module.exports.Helpers = Helpers; 
