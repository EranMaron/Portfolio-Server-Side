const client_id = "7759iu3fwfxudj",
  client_secret = "xNb1FQmbhVrj7HqL",
  redirect_uri = "http://localhost:3000/callback",
  scope = ["r_basicprofile"];
let state = "2407";
var authCode = "";
const https = require("https");
const axios = require("axios");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const url = require("url");

app.get("/authorize", (req, res) => {
  res.redirect(
    "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=" +
      client_id +
      "&redirect_uri=" +
      redirect_uri +
      "&state=" +
      state +
      "&scope=" +
      scope
  );
});

app.get("/callback", (req, res, next) => {
  authCode = req.query.code;
  state = req.query.state;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", authCode);
  params.append("redirect_uri", redirect_uri);
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("state", state);

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
