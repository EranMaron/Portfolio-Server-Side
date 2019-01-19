const consts = require("../consts.js"),
  unsplash = require("unsplash-api");

const { UNSPLASH_KEY, UNSPLASH_SECRET } = consts;

const term = "car";

let clientId = UNSPLASH_KEY;
unsplash.init(clientId);

unsplash.searchPhotos(term, 1, 1, null, (error, photos, link) => {
  // console.log(photos[0]);
});
