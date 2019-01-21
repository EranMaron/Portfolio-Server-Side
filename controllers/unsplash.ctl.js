const consts = require("../consts.js"),
  User = require("../models/user"),
  photo = require("../models/photo"),
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
    let answers = req.query;
    console.log(answers.param1);

    const param1 = await axiosCreat.get("/search/photos", {
      params: {
        query: `${answers.param1}`,
        orientation: "landscape",
        per_page: 3
      }
    });

    const param2 = await axiosCreat.get("/search/photos", {
      params: {
        query: `${answers.param2}`,
        orientation: "landscape",
        per_page: 3
      }
    });

    const param3 = await axiosCreat.get("/search/photos", {
      params: {
        query: `${answers.param3}`,
        orientation: "landscape",
        per_page: 3
      }
    });

    //console.log(param1.data.results[0].urls.regular);

    User.findOne({ _id: "111ab" }, (err, result) => {
      if (err) throw err;

      console.log(param1.data.results[0].urls.regular);

      result.photos.push({
        keyWord: answers.param1,
        url: param1.data.results[0].urls.regular
      });

      result.save(err => {
        if (err) throw err;
        console.log("Success!");
      });
    });

    // console.log(response.data.results);
  }
};
