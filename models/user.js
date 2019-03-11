const mongoose = require("mongoose"),
  profile = require("./profile");

const user = new mongoose.Schema(
  {
    id: {
      type: String,
      index: 1
    },
    firstName: String,
    lastName: String,
    profile: profile,
    photos: [String],
    videos: [String]
  },
  { collection: "users" }
);

const User = mongoose.model("User", user);

module.exports = User;
