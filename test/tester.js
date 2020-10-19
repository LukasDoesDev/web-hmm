var assert = require("assert");
const app = require("../src/app.js");

describe("Run common HTTP methods", function () {
  it("Should run without errors", function () {
    // C R U D
    app.methods.POST("/", () => {});
    app.methods.GET("/", () => {});
    app.methods.PATCH("/", () => {});
    app.methods.DELETE("/", () => {});
  });
});
