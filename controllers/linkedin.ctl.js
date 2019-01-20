const axios = require("axios"),
  consts = require("../consts");

let authCode = "";
let result = "";

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, STATE } = consts;

module.exports = {
  linkedinConnect(req, res) {
    res.redirect(
      "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=" +
        CLIENT_ID +
        "&redirect_uri=" +
        REDIRECT_URI +
        "&state=" +
        STATE +
        "&scope=" +
        SCOPE
    );
  },

  callback(req, res) {
    authCode = req.query.code;
    state = req.query.state;

    console.log("in callback");

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", authCode);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("state", STATE);

    axios
      .post("/oauth/v2/accessToken", params, {
        baseURL: "https://www.linkedin.com",
        headers: {
          Host: "www.linkedin.com",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(function(response) {
        var accessToken = response.data.access_token;
        axios
          .get(
            "/v1/people/~:(id,first-name,last-name,summary,positions~,num-connections,picture-url)?format=json",
            {
              baseURL: "https://api.linkedin.com",
              headers: {
                Host: "www.linkedin.com",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + accessToken
              }
            }
          )
          .then(function(response) {
            saveTodb(response.data);
          })
          .catch(err => {
            console.log(`ERROR 1: ${err}`);
          });
      })
      .catch(err => {
        console.log(`ERROR 2: ${err}`);
      });

    saveTodb = result => {
      //saving to db logic including checking id...
      console.log(result);
      // res.send(result);
      res.redirect("/check");
    };
  }
};
