const axios = require("axios");

module.exports = class TestClient {
  constructor(url) {
    this.url = url;
  }

  register(payload) {
    return axios.post(this.url, payload).then(res => res.data);
  }

  login(payload) {
    return axios.post(this.url, payload).then(res => res.data);
  }
};
