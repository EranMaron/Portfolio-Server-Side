const Profile = require("./profile"),
  Photo = require("./profile");

const mongoose = require("mongoose"),
  user = new mongoose.Schema({
    id: {
      type: String,
      index: 1
    },
    firstName: String,
    lastName: String,
    profile: Profile,
    photo: Photo
  });

const User = mongoose.model("User", user);

module.exports = User;
