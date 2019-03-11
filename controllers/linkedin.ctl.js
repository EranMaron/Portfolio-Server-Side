const axios = require("axios"),
  consts = require("../consts"),
  errorObj = require("../errorObj"),
  User = require("../models/user"),
  handlers = require("./handlers");

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, STATE } = consts;

module.exports = {
  //This function will redirect the url to Linkedin, in order to get Access code
  linkedinConnect(req, res) {
    console.log(`getting Access code`);
    res.redirect(
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}`
    );
  },
  //This function will get the Access code and use it to post request to linkedin in order to get AccessToken
  getAccessToken(req, res, next) {
    //Checking if the user refused to login into LinkedIn account
    //or refused to authorize permissions request from the service
    if (
      req.query.error === "user_cancelled_login" ||
      req.query.error === "user_cancelled_authorize"
    ) {
      let errDesc = req.query.error_description;
      res.redirect(
        `http://shenkar.html5-book.co.il/2018-2019/dcs/dev_276?id=error&singedIn=error`
      );
    } else {
      const authCode = req.query.code;
      const state = req.query.state;

      if (state !== STATE) {
        //checking for possible CSRF attack
        res.json(errorObj(404, `CSRF attack suspection`));
      }

      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("code", authCode);
      params.append("redirect_uri", REDIRECT_URI);
      params.append("client_id", CLIENT_ID);
      params.append("client_secret", CLIENT_SECRET);
      params.append("state", STATE);

      axios //request for Access Token
        .post("/oauth/v2/accessToken", params, {
          baseURL: "https://www.linkedin.com",
          headers: {
            Host: "www.linkedin.com",
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
        .then(response => {
          res.locals.accessToken = response.data.access_token; //passing accessToken as local var in order to use it in the next middlewear
          next();
        })
        .catch(err => {
          console.log(`error occurred- ${err}`);
          res.json(errorObj(401, err));
        });
    }
  },
  //This function will get the Access Token and use it to fetch information from Linkedin
  async setAccessToken(req, res, next) {
    const { accessToken } = req.res.locals; //get accessToken as local var in order to use it to fetch information from Linkedin
    console.log(`Fetching Users Linkedin information`);
    handlers
      .getLinkdinInfo(accessToken) //get User Linkedin information
      .then(result => {
        userId = result.data.id;
        //Check if the user allready exist
        User.findOne({ id: userId }, (err, _result) => {
          console.log(userId);
          if (err) {
            console.log(`error occurred- ${err}`);
            res.json(errorObj(404, err));
          }
          //if user not exist, create new User document and save to db
          else if (!_result) {
            handlers
              .saveUserToDb(result) //save information to DB
              .then(id => {
                console.log("resirecting to react");
                res.redirect(
                  `http://shenkar.html5-book.co.il/2018-2019/dcs/dev_276?id=${userId}&singedIn=false`
                  //http://shenkar.html5-book.co.il/2018-2019/dcs/dev_276?id=${userId}&singedIn=false
                );
              });
          } else {
            //res.redirect(`http://localhost:3001?id=${userId}`);
            console.log("resirecting to react");
            res.redirect(
              `http://shenkar.html5-book.co.il/2018-2019/dcs/dev_276?id=${userId}&singedIn=true`
              //http://shenkar.html5-book.co.il/2018-2019/dcs/dev_276?id=${userId}&singedIn=true
            );
          }
        });
      })
      .catch(err => {
        console.log(`error occurred- ${err}`);
        res.json(errorObj(404, err));
      });
  },
  // This function will return a json with error message
  cancellErr(req, res) {
    let cancellErr = req.query.error_description;
    console.log(`error occurred- ${cancellErr}`);
    res.json(errorObj(303, cancellErr));
  }
};
