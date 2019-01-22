consts = require("../consts"),
	axios = require("axios");
const User = require("../models/user"),
	Profile = require("../models/profile"),
	mongoose = require('mongoose'),
	database = require("../database");


const linkedinCtl = require("./linkedin.ctl");

const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, STATE} = consts;

var accessToken = "";
let authCode = "";



module.exports = {
	getAccessCode(req, res, next) {
		console.log("Get Auth Code");
		authCode = req.query.code;
		state = req.query.state;

		if (state !== STATE) {
			res.status(404).send("ERROR: Sombody trying to still informatin from you");
		}
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
		axios.get("/v1/people/~:(id,first-name,last-name,summary,positions,num-connections,picture-url,headline)?format=json", {
			baseURL: "https://api.linkedin.com",
			headers: {
				Host: "www.linkedin.com",
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: "Bearer " + accessToken,
			},
		}).then((response) => {
			//res.send(response.data);
			//next();
			User.findOne({id: `${response.data.id}`}, (err, result) => {
				if (err)
					throw err;
				else {
					if (!result) {
						const user = new User({
							id: `${response.data.id}`,
							firstName: `${response.data.firstName}`,
							lastName: `${response.data.lastName}`,
							profile: {
								headLine: `${response.data.headline}`,
								summary: `${response.data.summary}`,
								numOfConnections: `${response.data.numConnections}`,
								profilePicture: `${response.data.pictureUrl}`,
								currentPosition: {
									title: `${response.data.positions.values[0].title}`,
									company: `${response.data.positions.values[0].company.name}`,
									summary: `${response.data.positions.values[0].summary}`
								}
							}
						});
						user.save((err) => {
							if (err)
								console.log(`ERROR: ${err}`);
							else {
								console.log("Document Saved");
								res.redirect(`./questions/id=${response.data.id}`);
							}
						})

					} else {
						console.log("User Exist");
						res.redirect(`./questions/id=${response.data.id}`);
					}
				}
			});
		}).catch((err) => {
			res.send(`ERROR 2: ${err}`);
		});
	}

};