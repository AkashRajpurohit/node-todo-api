const Validator = require("validator");
const isEmpty = require("./isEmpty");

const constants = require("./validationConstants");

module.exports = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = constants.EMAIL_INVALID_ERROR;
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = constants.EMAIL_REQUIRED;
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = constants.PASSWORD_REQUIRED;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
