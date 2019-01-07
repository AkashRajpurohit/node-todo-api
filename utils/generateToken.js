const jwt = require("jsonwebtoken");

const keys = require("../config/keys");

module.exports = async payload => {
  const token = await jwt.sign(payload, keys.jwtSecret, {
    expiresIn: "7 days"
  });
  const bearer = "Bearer " + token;
  return bearer;
};
