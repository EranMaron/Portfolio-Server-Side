const mongoose = require("mongoose");

let photo = new mongoose.Schema({
  id: String,
  url: String
});

const Photo = mongoose.model("Photo", photo);
module.exports = Photo;
