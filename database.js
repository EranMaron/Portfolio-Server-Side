const mongoose = require("mongoose");
const consts = require("./consts");


const {MLAB_URL, DB_USER, DB_PASS} = consts;
const url = MLAB_URL;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  user: DB_USER,
  pass: DB_PASS,
  autoReconnect: true
};

mongoose.connect(url, options)
  .then(() => console.log("Connected To DB"))
  .catch(err => console.log(`connection error: ${err}`));
