const jwt = require("jsonwebtoken");

// Load keys
const keys = require("../config/keys");
// Error response
const errorResponse = require("./errorResponse");
// Constants
const constants = require("./constants");

module.exports = async (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  if (bearerToken) {
    // get jwt token from bearer token
    const token = bearerToken.split(" ")[1];
    try {
      // verify the token
      const { userId } = await jwt.verify(token, keys.jwtSecret);

      // store userid in req object
      req.userId = userId;

      // if everything works fine, go to next middleware
      next();
    } catch (err) {
      return res.status(400).json(errorResponse(constants.INVALID_TOKEN));
    }
  } else {
    res.status(400).json(errorResponse(constants.NO_TOKEN));
  }
};
