const mongoose = require("mongoose"),
  profile = new mongoose.Schema({
    id: String,
    headLine: String,
    summary: String,
    numOfConnections: Number,
    ProfilePicture: String,
    currentPosition: {
      title: String,
      company: String,
      summary: String
    }
  });

const Profile = mongoose.model("Profile", profile);

module.exports = Profile;
