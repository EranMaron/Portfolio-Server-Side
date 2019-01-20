const mongoose = require("mongoose"),
  photo = new mongoose.Schema({
    id: String,
    photos: [
      {
        keyWord: String,
        url: String
      }
    ]
  });

const Photo = mongoose.model("Photo", photo);

module.exports = Photo;
