const mongoose = require("mongoose"),
  user = new mongoose.Schema({});

const User = mongoose.model("User", user);

module.exports = User;
