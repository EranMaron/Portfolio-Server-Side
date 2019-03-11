errorObject = {
  statusCode: null,
  errorMessage: ""
};

module.exports = (statusCode, errorMessage) => {
  errorObject.statusCode = statusCode;
  errorObject.errorMessage = errorMessage;
  console.log(
    `returned error with status code ${statusCode} - ${errorMessage}`
  );
  return errorObject;
};
