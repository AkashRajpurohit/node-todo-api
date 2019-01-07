const mongoose = require("mongoose");

const TestClient = require("../utils/testClient");

//Load Models
const User = require("../models/User");

// Constants
const validationConstants = require("../utils/validations/validationConstants");
const constants = require("../utils/constants");

// Responses
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

const BASE_URL = "http://localhost:4000";

describe("Register functionality", () => {
  // URL client for register
  const client = new TestClient(`${BASE_URL}/api/users/register`);

  it("should validate all fields", async () => {
    // prepare payload with empty data
    const payload = {};

    const response = await client.register(payload);

    expect(response).toEqual(
      errorResponse(constants.VALIDATION_ERROR, response.errors)
    );
  });

  it("should validate email address", async () => {
    // prepare payload
    const payload = {
      email: "akash#gmail.com",
      username: "akash",
      password: "akash123",
      password2: "akash123"
    };

    const response = await client.register(payload);

    expect(response).toEqual(
      errorResponse(constants.VALIDATION_ERROR, response.errors)
    );
  });

  it("should check for password and confirm password match", async () => {
    // prepare payload
    const payload = {
      email: "akash@gmail.com",
      username: "akash",
      password: "akash12",
      password2: "akash1234"
    };

    const response = await client.register(payload);

    expect(response).toEqual(
      errorResponse(constants.VALIDATION_ERROR, response.errors)
    );
  });

  // it("should register a user", async () => {
  //   // prepare payload
  //   const payload = {
  //     email: "akash1234@gmail.com",
  //     username: "akash",
  //     password: "akash1234",
  //     password2: "akash1234"
  //   };

  //   const response = await client.register(payload);

  //   expect(response).toEqual(successResponse("Registration successful"));
  // });
});
