"use strict";

const http = require("http");

/**
 * Create new instance of the app
 */
function createApp() {
  // todo

  const methods = require("./methods.js");
  const utils = require("./utils.js");
  const router = require("./router.js");
  const middleware = require("./middleware.js");
  const enums = require("./enums.js");
  var mode = enums.Modes.PRODUCTION;

  var server;

  function createServer(config) {
    console.log(mode, enums.Modes);
    if (!(mode == enums.Modes.PRODUCTION || mode == enums.Modes.DEBUG)) {
      throw new Error("mode isn't enums.Modes.PRODUCTION or enums.Modes.DEBUG");
    }
    console.log(
      `${mode == enums.Modes.PRODUCTION ? "PRODUCTION" : "DEBUG"} Mode`
    );
    console.log("Routers:", router.routers);

    server = http.createServer((req, res) => {
      console.log("Got connection");
      middleware.run(req, res);
    }, config);
  }

  /**
   * Listen on the port and call the callback when it's listening
   * @param {Number} port The port where the server would listen on
   * @param {function} callback The callback the server will call when it's listening
   */
  function listen(port, callback, config) {
    server.listen(port, callback);
  }

  /**
   * Shuts down the server with a nice message 👍
   * @param {function} callback
   */
  function shutdown(callback) {
    console.log("Shutting Server Down ⏹");
    server.close(callback);
    console.log(`Shutted Server Down,
should automatically exit 😀`);
  }

  return {
    createServer,
    methods,
    utils,
    listen,
    Router: router.Router,
    useRouter: router.useRouter,
    middleware,
    debugMode() {
      mode = enums.Modes.DEBUG;
    },
    shutdown,
  };
}

module.exports = {
  createApp,
};
