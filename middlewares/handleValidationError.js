module.exports = (error, req, res) => {
  console.error(error.stack);
  res
    .status(422)
    .send(
      `Sorry, but something broke.${
        error.errorCode
          ? `Please contact the administrator with this code : ${error.errorCode}`
          : ''
      }`
    );
};