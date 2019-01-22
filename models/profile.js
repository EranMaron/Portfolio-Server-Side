const mongoose = require("mongoose");

let profile = new mongoose.Schema({
  headLine: String,
  summary: String,
  numOfConnections: Number,
  profilePicture: String,
  currentPosition: {
    title: String,
    company: String,
    summary: String
  }
});

module.exports = profile;