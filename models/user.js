const mongoose = require("mongoose");
const profile = require("./profile"),
  photo = require("./photo");

const user = new mongoose.Schema(
  {
    id: {
      type: String,
      index: 1
    },
    firstName: String,
    lastName: String,
    profile: profile,
    photos: [String]
  },
  { collection: "users" }
);

const User = mongoose.model("User", user);

module.exports = User;
