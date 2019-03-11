const mongoose = require("mongoose");

let profile = new mongoose.Schema({
  id: String,
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
