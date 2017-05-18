var config = require('./config.json');
var nodemailer = require('nodemailer');

var EmailService = function() {
	var self = this; 

	self.transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'info@wigeon.co',
			pass: config.info_email_pw
		}
	});

	self.sendContactUsEmail = function(user_email, user_message, user_id) {
		
		var html = CreateContactUsEmail(user_message);

		var emailOptions = {
			from: '"Wigeon Info" <info@wigeon.co>',
			to: config.ContactEmailDistoList,
			subject: 'User Contact From Web App',
			text: html 
		};

		self.transporter.sendMail(emailOptions, function(error, info) {
			if(error) {
				console.log("sendContactUsEmail Error:");
				console.log(error);
			}
			console.log(info.messageId, info.response)
			debugger; 
		});
	};


	function CreateContactUsEmail(email, text, userId) {
		var string; 
		string += "<h2>Web App Contact Us</h2></br><p>User Id: ";
		string += userId;
		string += "</p></br><p>User Email: ";
		string += email;
		string += "</p></br><p> User Message: ";
		string += test;
		string += "</p>";
		return string; 
	};

}

module.exports.EmailService = EmailService; 
