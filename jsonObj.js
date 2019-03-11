jsonObject = {
  id: null,
  signedIn: null
};

module.exports = (_id, _signedIn) => {
  jsonObject.id = _id;
  jsonObject.signedIn = _signedIn;

  return jsonObject;
};
