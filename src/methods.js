'use strict';
var middleware = require('./middleware.js');
var methodTypes = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  // 'CONNECT',
  // 'OPTIONS',
  // 'TRACE',
  'PATCH'
]

/*var routes = {
  GET: [],
  POST: []
}

function method (type, route, callback) {
  if (routes.hasOwnProperty(type)) {
    routes[type].push({
      route: route,
      callback: callback
    });
  }
}*/

const path = require('path');

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
      res.sendHTML = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200,
          statusMsg,
          {
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(body),
          } + headers
        );
        res.end(body);
      };
      res.sendJSON = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200,
          statusMsg,
          {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          } + headers
        );
        res.end(body);
      };
      res.sendPlain = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200,
          statusMsg,
          {
            "Content-Type": "text/plain",
            "Content-Length": Buffer.byteLength(body),
          } + headers
        );
        res.end(body);
      };
      res.send = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200,
          statusMsg,
          {
            "Content-Length": Buffer.byteLength(body),
          } + headers
        );
        res.end(body);
      };
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
  }, 'ROOT_ROUTE');
}

exports = {
  // routes: routes,
  makeRouteMiddleware,
  methodTypes
};

for (let i = 0; i < methodTypes.length; i++) {
  const item = methodTypes[i];
  exports[item] = (route, callback) => makeRouteMiddleware(item, route, callback);
}


module.exports = exports;