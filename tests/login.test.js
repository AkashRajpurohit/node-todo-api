const TestClient = require("../utils/testClient");

// Constants
const validationConstants = require("../utils/validations/validationConstants");
const constants = require("../utils/constants");

// Responses
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

// Generate token
const generateToken = require("../utils/generateToken");

//Load Models
const User = require("../models/User");

const BASE_URL = "http://localhost:4000";
describe("Login Functionality", () => {
  // URL client for login
  const client = new TestClient(`${BASE_URL}/api/users/login`);

  it("should validate credentials", async () => {
    // prepare payload with empty data
    const payload = {};

    const response = await client.register(payload);

    expect(response).toEqual(
      errorResponse(constants.VALIDATION_ERROR, response.errors)
    );
  });

  it("should validate for proper email", async () => {
    // prepare payload with empty data
    const payload = {
      email: "akash#gmail.com",
      password: "dsfsdfdsf"
    };

    const response = await client.register(payload);

    expect(response).toEqual(
      errorResponse(constants.VALIDATION_ERROR, response.errors)
    );
  });

  it("should not allow login for invalid credentails", async () => {
    // prepare payload with empty data
    const payload = {
      email: "akash@gmail.com",
      password: "dsfsdfdsf"
    };

    const response = await client.register(payload);

    expect(response).toEqual(errorResponse(constants.AUTHENTICATION_ERROR));
  });

  it("should not allow login for invalid credentails", async () => {
    // prepare payload with empty data
    const payload = {
      email: "akash@gmail.com",
      password: "akash123"
    };

    const response = await client.register(payload);

    expect(response.success).toBeTruthy();
  });
});
