const mongoose = require("mongoose");

let video = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  thumbnail: String
});

const Video = mongoose.model("Video", video);
module.exports = Video;
