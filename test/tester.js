var assert = require("assert");
const app = require("../src/app.js");
const axios = require("axios").default;

describe("Test server", function () {
  before(function (done) {
    app.methods.POST("/", (req, res, next) => {
      res.sendPlain("Hello from POST");
    });
    app.methods.GET("/", (req, res, next) => {
      res.sendPlain("Hello from GET");
    });
    app.methods.PATCH("/", (req, res, next) => {
      res.sendPlain("Hello from PATCH");
    });
    app.methods.DELETE("/", (req, res, next) => {
      res.sendPlain("Hello from DELETE");
    });

    app.createServer();
    app.listen(3000, done);
  });
  
  after(app.shutdown);

  it("Test GET method with axios", async function () {
    var response = await axios({
      method: "get",
      url: "http://localhost:3000/",
      timeout: 1000
    });
    assert.equal(response.data, `Hello from GET`);
    assert.equal(response.status, 200);
  });
});
