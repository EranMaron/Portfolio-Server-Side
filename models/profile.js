const mongoose = require("mongoose"),
  profile = new mongoose.Schema({});

const Profile = mongoose.model("Profile", profile);

module.exports = Profile;
