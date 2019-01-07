const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Load models
const User = require("../../models/User");

// Error response
const errorResponse = require("../../utils/errorResponse");
// Success response
const successResponse = require("../../utils/successResponse");

// Constants
const constants = require("../../utils/constants");

// Generate token
const generateToken = require("../../utils/generateToken");

// Validators
const registerValidator = require("../../utils/validations/registerValidator");
const loginValidator = require("../../utils/validations/loginValidator");

// @route POST /api/users/register
// @desc register users
// @access Public
router.post("/register", async (req, res) => {
  // Validate all input fields
  const { errors, isValid } = registerValidator(req.body);
  if (!isValid) {
    return res.json(errorResponse(constants.VALIDATION_ERROR, errors));
  }
  let { username, email, password } = req.body;
  // lowercase email
  email = email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (user) {
      // email already exist
      errors.email = "Email Id already exists";
      return res.json(errorResponse(constants.EMAIL_ERROR, errors));
    }

    // all ok
    const newUser = new User({
      username,
      email,
      password
    });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    // change password to hashed password
    newUser.password = hashedPassword;

    // save user
    const saved = newUser.save();

    if (saved) {
      res.json(successResponse("Registration successful"));
    } else {
      res.json(errorResponse(constants.UNKNOWN_ERROR));
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(errorResponse(constants.UNKNOWN_ERROR));
  }
});

// @route POST /api/users/login
// @desc login users
// @access Public
router.post("/login", async (req, res) => {
  // Validate all input fields
  const { errors, isValid } = loginValidator(req.body);
  if (!isValid) {
    return res.json(errorResponse(constants.VALIDATION_ERROR, errors));
  }
  const { email, password } = req.body;
  try {
    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // no user
      return res.json(errorResponse(constants.AUTHENTICATION_ERROR));
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Wrong password
      return res.json(errorResponse(constants.AUTHENTICATION_ERROR));
    }

    // all ok
    // Generate jwt bearer token
    const token = await generateToken({ userId: user.id });
    const _data = {
      token,
      username: user.username
    };

    res.json(successResponse("Login successful", _data));
  } catch (e) {
    console.log(e);
    res.status(500).json(errorResponse(constants.UNKNOWN_ERROR));
  }
});

module.exports = router;
