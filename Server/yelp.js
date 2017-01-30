// yelp requests
var request = require("request");
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var qs = require('querystring');  
var _ = require('lodash');
var WigeonConsts = require('./wigeon-consts.js').WigeonConsts;

//https://arian.io/how-to-use-yelps-api-with-node/
var Yelp = function() {
	var self = this;

	self.GetPlace = function(placeId, callback) {
		var consts = new WigeonConsts();

		var httpMethod = 'GET';
		var url = 'https://api.yelp.com/v2/business/' + placeId;
		
	  /* We set the require parameters here */
	  var parameters = {
	    oauth_consumer_key : consts.YelpConsumerKey,
	    oauth_token : consts.YelpToken,
	    oauth_nonce : n(),
	    oauth_timestamp : n().toString().substr(0,10),
	    oauth_signature_method : 'HMAC-SHA1',
	    oauth_version : '1.0'
	  };

	  /* We combine all the parameters in order of importance */ 
	  //var parameters = _.assign(required_parameters);

	  /* We set our secrets here */
	  var consumerSecret = consts.YelpConsumerSecret;
	  var tokenSecret = consts.YelpTokenSecret;
	  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
	  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
	  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

	  /* We add the signature to the list of paramters */
	  parameters.oauth_signature = signature;

	  /* Then we turn the paramters object, to a query string */
	  var paramURL = qs.stringify(parameters);

	  /* Add the query string to the url */
	  var apiURL = url+'?'+paramURL;
	  /* Then we use request to send make the API Request */
	  request(apiURL, function(error, response, body){
	    return callback(error, response, body);
	  });

	}
};

module.exports.Yelp = Yelp; 
