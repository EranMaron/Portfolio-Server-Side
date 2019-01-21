const axios = require("axios"),
	consts = require("../consts");



const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, STATE} = consts;

module.exports = {
	linkedinConnect(req, res) {
		res.redirect(
			`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}`,
		);
	},

	//saving to db logic including checking id...
	callback(req, res) {
		// console.log(req);
		// console.log(res);
		console.log("In Callback");
		res.redirect("./check");
	},
};
