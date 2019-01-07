const isEmpty = require("./isEmpty");

const constants = require("./validationConstants");

module.exports = data => {
  let errors = {};

  if (isEmpty(data.task_name)) {
    errors.task_name = constants.TASK_REQUIRED;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
