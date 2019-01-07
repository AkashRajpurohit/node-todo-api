const Validator = require("validator");
const isEmpty = require("./isEmpty");

const constants = require("./validationConstants");

module.exports = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = constants.USERNAME_LENGTH_ERROR;
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = constants.USERNAME_REQUIRED;
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = constants.EMAIL_INVALID_ERROR;
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = constants.EMAIL_REQUIRED;
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = constants.PASSWORD_LENGTH_ERROR;
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = constants.PASSWORD_REQUIRED;
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = constants.CONFIRM_PASSWORD_REQUIRED;
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = constants.PASSWORD_MISMATCH_ERROR;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
