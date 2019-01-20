const consts = require("../consts.js"),
  axios = require("axios");

const { UNSPLASH_KEY, UNSPLASH_SECRET } = consts;

const term = "car";

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

    // const response = await axiosCreat.get("/search/photos", {
    //   params: { query: term, orientation: "squarish", per_page: 3 }
    // });

    // console.log(response.data.results);
  }
};
