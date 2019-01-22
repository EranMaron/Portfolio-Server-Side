const mongoose = require("mongoose");
const profile = require("./profile"),
  photo = require("./photo");


let user = new mongoose.Schema(
  {
    /* _id: {
      type: String,
      index: 1
    }, */
    id: String,
    firstName: String,
    lastName: String,
    profile: profile,
    photos: [photo]
  },
  {collection: "users"}
);

const User = mongoose.model("User", user);

module.exports = User;