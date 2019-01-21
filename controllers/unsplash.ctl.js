const consts = require("../consts.js"),
  User = require("../models/user"),
  Photo = require("../models/photo"),
  axios = require("axios");

const { UNSPLASH_KEY, UNSPLASH_SECRET } = consts;

const axiosCreat = axios.create({
  baseURL: `https://api.unsplash.com`,
  headers: {
    Authorization: `Client-ID ${UNSPLASH_KEY}`
  }
});

module.exports = {
  async getphotos(req, res) {
    let answers = req.query,
      numOfParams = Object.keys(answers).length,
      numOfphotos = 4,
      indexOfPhoto = 0;

    let results = new Array();

    for (let i = 0; i < numOfParams; i++) {
      let result = await axiosCreat
        .get("/search/photos", {
          params: {
            query: `${answers[Object.keys(answers)[i]]}`,
            orientation: "landscape",
            per_page: numOfphotos
          }
        })
        .catch(err => console.log(err));

      results.push(result.data.results);
    }

    for (let i = 0; i < numOfParams; i++) {
      let photoId = results[i][indexOfPhoto].id,
        photoUrl = results[i][indexOfPhoto].urls.regular;

      Photo.findOne({ id: photoId }, (err, result) => {
        if (err) throw err;
        if (!result) {
          const photo = new Photo({
            id: photoId,
            url: photoUrl
          });

          photo.save(err => {
            if (err) console.log(err);
            else {
              console.log(`Saved photo ${JSON.stringify(photo)}`);
            }
          });
        }

        User.findOne({ id: "jFkde_Tvab" }, (err, result) => {
          if (err) throw err;
          else if (result) {
            result.photos.push(`${photoId}`);
            result.save(err => {
              if (err) throw err;
            });
          }
        });
      });
    }
  }
};
