var assert = require("assert");
const app = require("../src/app.js");
const axios = require("axios").default;

const methods = ['GET'];
// const methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'PATCH'];

describe("Test server", function () {
  before(function (done) {
    app.methods.GET("/", (req, res, next) => {
      res.sendPlain("Hello from GET");
    });
    app.methods.POST("/", (req, res, next) => {
      res.sendPlain("Hello from POST");
    });
    app.methods.DELETE("/", (req, res, next) => {
      res.sendPlain("Hello from DELETE");
    });
    app.methods.PATCH("/", (req, res, next) => {
      res.sendPlain("Hello from PATCH");
    });

    app.createServer();
    app.listen(3000, done);
  });
  
  after(app.shutdown);

  for (let i = 0; i < methods.length; i++) {
    const method = methods[i]; // Current method
    it(`Test ${method} method with axios`, async function () {
      var response = await axios({
        method: method,
        url: "http://localhost:3000/",
        timeout: 1000,
      });
      assert.strictEqual(response.data, `Hello from ${method}`);
      assert.strictEqual(response.status, 200);
    });
  }
});
