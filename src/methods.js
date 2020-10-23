"use strict";
const methodTypes = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  // 'CONNECT',
  // 'OPTIONS',
  // 'TRACE',
  "PATCH",
];

const path = require("path");
const http = require("http");

function createMethods(middleware) {
  function makeRouteMiddleware(type, route, cb) {
    middleware.use(function (req, res, next) {
      var url = path.posix.normalize(req.url);
      var normRoute = path.posix.normalize(route);

      var indexes = [];
      var names = [];
      var parameters = {};

      // * Get all parameters and push them to the names and indexes arrays
      for (let i = 0; i < normRoute.split("/").length; i++) {
        const el = normRoute.split("/")[i];
        if (el.match(":")) {
          indexes.push(i);
          names.push(el.replace(":", ""));
        }
      }

      /*
       * Get parameter values from URL and put all the
       * information (Name, Index, Value) together to
       * make this:
       * key: Name (String)
       * {
       *   index: Index (Number)
       *   value: Value (String)
       * }
       */
      for (let i = 0; i < url.split("/").length; i++) {
        const el = url.split("/")[i];
        if (indexes.includes(i)) {
          /*parameters.push({
          index: i,
          value: el,
          name: names[parameters.length],
        });*/

          parameters[names[Object.keys(parameters).length]] = {
            index: i,
            value: el,
          };
        }
      }

      var urls = url.split("/");

      function match(item, index) {
        if (indexes.includes(index)) return true;
        return item == urls[index];
      }

      function checkURL() {
        if (Object.keys(parameters).length == 0) return normRoute == url;
        return normRoute.split("/").every(match);
      }

      if (checkURL() && req.method === type) {
        req.params = parameters || {};
        console.log(parameters);

        // Make new methods
        res.send = (body, code, headers) => {
          var headersFixed = Object.entries(Object.assign(
            {
              "Content-Length": Buffer.byteLength(body),
            },
            headers
          ));
          for (let i = 0; i < headersFixed.length; i++) {
            const [headerName, headerValue] = headersFixed[i];
            console.log(headerName, headerValue, headersFixed[i]);
            res.setHeader(headerName, headerValue);
          }
          res.writeHead(
            code ? code : 200,
            http.STATUS_CODES[code ? code : 200]
          );
          res.end(body);
        };
        res.sendHTML = (body, code, headers) =>
          res.send(body, code, Object.assign({ "Content-Type": "text/html" }, headers));
        res.sendJSON = (body, code, headers) =>
          res.send(body, code, Object.assign({ "Content-Type": "application/json" }, headers));
        res.sendPlain = (body, code, headers) =>
          res.send(body, code, Object.assign({ "Content-Type": "text/plain" }, headers));

        res.redirect = (url) => {
          res.writeHead(200, {
            Location: url,
          });
          res.end();
        };

        cb(req, res);
      } else {
        next();
      }
    }, "ROOT_ROUTE");
  }

  var methods = {};

  for (let i = 0; i < methodTypes.length; i++) {
    const item = methodTypes[i];
    methods[item] = (route, callback) =>
      makeRouteMiddleware(item, route, callback);
  }
  return methods;
}

module.exports = {
  createMethods
};
