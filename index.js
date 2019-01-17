const https = require("https"),
  axios = require("axios"),
  url = require("url"),
  consts = require("./consts.js"),
  express = require("express"),
  app = express();

var authCode = "";

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, STATE } = consts;

const port = process.env.PORT || 3000;

app.get("/authorize", (req, res) => {
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
});

app.get("/callback", (req, res, next) => {
  authCode = req.query.code;
  state = req.query.state;

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
        .get("/v1/people/~:(num-connections)?format=json", {
          baseURL: "https://api.linkedin.com",
          headers: {
            Host: "www.linkedin.com",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + accessToken
          }
        })
        .then(function(response) {
          res.send(JSON.stringify(response.data));
        })
        .catch(err => {
          console.log("Error 1");
        });
    })
    .catch(err => {
      console.log("Error 2");
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
