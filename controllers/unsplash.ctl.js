const axios = require("axios"),
  consts = require("../consts.js"),
  errorObj = require("../errorObj"),
  User = require("../models/user"),
  Photo = require("../models/photo");

const { UNSPLASH_KEY } = consts;

//Creating a new instance of axios
const axiosCreate = axios.create({
  baseURL: `https://api.unsplash.com`,
  headers: {
    Authorization: `Client-ID ${UNSPLASH_KEY}`
  }
});

module.exports = {
  async getphotos(req, res) {
    //checking if no parameters were sent as answers to the questions
    if (Object.entries(req.body).length === 0) {
      console.log(`Please send Answers as parameters in post request`);
      return res.json(
        errorObj(404, "Please send Answers as parameters in post request")
      );
    } else {
      let answers = req.body,
        id = req.query.id;

      if (id === undefined) {
        return res.json(errorObj(404, `Send id as parameter`));
      }
      let numOfParams = Object.keys(answers).length,
        numOfphotos = 4, //specifing num of photos to fetch for each answer. specified as 4 in order to allow the User choose the photo saved to DataBase in the future
        indexOfPhoto = 0; //specifing the chosen photo from all fetched photos

      let results = new Array(); //creare array to hold array of photos for each answer

      //fetch photos from Unsplash
      for (let i = 0; i < numOfParams; i++) {
        console.log(`fetching ${numOfParams} Photos from Unsplash`);
        let result = await axiosCreate
          .get("/search/photos", {
            params: {
              query: `${answers[Object.keys(answers)[i]]}`,
              orientation: "landscape",
              per_page: numOfphotos
            }
          })
          .catch(err => {
            console.log(`error occurred- ${err}`);
            res.json(errorObj(404, err));
          });

        results.push(result.data.results);
      }

      for (let i = 0; i < numOfParams; i++) {
        //in case a photo can't be fetched from Unsplash due to the specific answer given by the user, nothing will be saved to the DataBase in the specific Iteration
        if (results[i].length == 0) {
          console.log(`Photo for specific answer not found`);
          continue;
        }

        let photoId = results[i][indexOfPhoto].id,
          photoUrl = results[i][indexOfPhoto].urls.regular;

        //checking if the photo exists in Database
        await Photo.findOne({ id: photoId }, (err, result) => {
          if (err) {
            console.log(`error occurred- ${err}`);
            res.json(errorObj(404, err));
          }
          //if photo not exist, create new photo document and save to db
          if (!result) {
            const photo = new Photo({
              id: photoId,
              url: photoUrl
            });

            photo.save(err => {
              if (err) {
                console.log(`error occurred- ${err}`);
                res.json(errorObj(404, err));
              } else {
                console.log(
                  `Saved photo with photo id ${photoId} to Data Base`
                );
              }
            });
          }

          //save photo id to User's photos array
          User.findOne({ id: id }, (err, result) => {
            if (err) {
              console.log(`error occurred- ${err}`);
              res.json(errorObj(404, err));
            } else if (result) {
              result.photos.push(`${photoId}`);
              result.save(err => {
                if (err) {
                  console.log(`error occurred- ${err}`);
                  res.json(errorObj(404, err));
                }
              });
            } else {
              console.log(`User document not found`);
              res.json(errorObj(404, `User document not found`));
            }
          });
        });
      }
      res.redirect(
        `./videos?term=${
          answers[Object.keys(answers)[Object.keys(answers).length - 1]]
        }&id=${id}`
      );
    }
  }
};
