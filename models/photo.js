const mongoose = require("mongoose");

let photo = new mongoose.Schema({
  keyWord: String,
  url: String
});

module.exports = photo;
