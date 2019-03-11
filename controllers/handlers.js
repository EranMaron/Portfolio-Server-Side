const axios = require("axios"),
  errorObj = require("../errorObj"),
  User = require("../models/user");

module.exports = {
  //This function will fetch Linkedin User information
  getLinkdinInfo(accessToken) {
    console.log(`getting Linkedin information`);
    return axios.get(
      "/v1/people/~:(id,first-name,last-name,summary,positions,num-connections,picture-url,headline)?format=json",
      {
        baseURL: "https://api.linkedin.com",
        headers: {
          Host: "www.linkedin.com",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + accessToken
        }
      }
    );
  },

  //This function will save the information fetched from Linkedin to the DataBase
  async saveUserToDb(response) {
    console.log(response.data.id);
    const id = response.data.id; // id will be returned and save as env var
    const position = {
      //assuming user has no current position in their Linkedin profile, to prevent accsses to undefiend field
      title: undefined,
      company: undefined,
      summary: undefined
    };

    //if User has a current position in their Linkedin profile, assign the relevant fields
    if (response.data.positions._total == 1) {
      position.title = response.data.positions.values[0].title;
      position.company = response.data.positions.values[0].company.name;
      position.summary = response.data.positions.values[0].summary;
    }

    //Checking if User exists in DataBase
    await User.findOne({ id: id }, (err, result) => {
      if (err) {
        console.log(`error occurred- ${err}`);
        res.json(errorObj(404, err));
      } else {
        //Checking if the user already exist
        if (!result) {
          // if User does not exist, create new user document
          console.log(`Creating new User document for User id ${id}`);
          console.log(response.data.pictureUrl);
          const user = new User({
            id: `${id}`,
            firstName: `${response.data.firstName}`,
            lastName: `${response.data.lastName}`,
            profile: {
              headLine: `${response.data.headline}`,
              summary: `${response.data.summary}`,
              numOfConnections: `${response.data.numConnections}`,
              profilePicture: `${response.data.pictureUrl}`,
              currentPosition: {
                title: `${position.title}`,
                company: `${position.company}`,
                summary: `${position.company}`
              }
            }
          });

          user.save(err => {
            if (err) {
              console.log(`error occurred- ${err}`);
              return res.json(errorObj(404, err));
            } else console.log(`Document Saved successfully`);
          });
        }
      }
    });
    return id;
  }
};
