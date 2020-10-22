var assert = require("assert");
const app = require("../src/app.js");
const axios = require("axios").default;


describe("Test server", function () {
  var currentApp;
  before(function (done) {
    currentApp = app.createApp();
    currentApp.methods.GET("/", (req, res, next) => {
      res.sendPlain("Hello from GET");
    });
    currentApp.methods.POST("/", (req, res, next) => {
      res.sendPlain("Hello from POST");
    });
    currentApp.methods.DELETE("/", (req, res, next) => {
      res.sendPlain("Hello from DELETE");
    });
    currentApp.methods.PATCH("/", (req, res, next) => {
      res.sendPlain("Hello from PATCH");
    });

    currentApp.createServer();
    currentApp.listen(3000, done);
  });
  
  after(done => currentApp.shutdown(done));

  it(`Test GET method with axios`, async function () {
    var response = await axios({
      method: 'GET',
      url: "http://localhost:3000/",
      timeout: 2000,
    });
    assert.strictEqual(response.data, `Hello from GET`);
    assert.strictEqual(response.status, 200);
  });
  it(`Test POST method with axios`, async function () {
    var response = await axios({
      method: 'POST',
      url: "http://localhost:3000/",
      timeout: 2000,
    });
    assert.strictEqual(response.data, `Hello from POST`);
    assert.strictEqual(response.status, 200);
  });
  
});
