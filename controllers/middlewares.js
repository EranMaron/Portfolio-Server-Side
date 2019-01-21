consts = require("../consts"),
	axios = require("axios");

const linkedinCtl = require("./linkedin.ctl");

const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, STATE} = consts;
var accessToken = "";
let authCode = "";



module.exports = {
	getAccessCode(req, res, next) {
		console.log("Get Auth Code");
		authCode = req.query.code;
		state = req.query.state;

		const params = new URLSearchParams();
		params.append("grant_type", "authorization_code");
		params.append("code", authCode);
		params.append("redirect_uri", REDIRECT_URI);
		params.append("client_id", CLIENT_ID);
		params.append("client_secret", CLIENT_SECRET);
		params.append("state", STATE);

		axios.post("/oauth/v2/accessToken", params, {
			baseURL: "https://www.linkedin.com",
			headers: {
				Host: "www.linkedin.com",
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}).then((response) => {
			accessToken = response.data.access_token;
			console.log("Get Access Token");
			next();

		}).catch((err) => {
			res.send(`${err}`);
			console.log(`ERROR 1: ${err}`);
		});
	},

	/*Set Header and Send Access Token*/
	setAccessToken(req, res, next) {
		console.log("In Set");
		axios.get("/v1/people/~:(positions)?format=json", {
			baseURL: "https://api.linkedin.com",
			headers: {
				Host: "www.linkedin.com",
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: "Bearer " + accessToken,
			},
		}).then((response) => {
			//res.send(response.data);
			next();

		}).catch((err) => {
			res.send(`ERROR 2: ${err}`);
		});

	}

};