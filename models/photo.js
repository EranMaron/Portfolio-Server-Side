const mongoose = require("mongoose"),
  photo = new mongoose.Schema({});

const Photo = mongoose.model("Photo", photo);

module.exports = Photo;
