var middleware = require('./middleware.js');
var methodTypes = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
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
    if (
      path.posix.normalize(req.url) === route
      && req.method === type
    ) {
      
      // Make new methods
      res.sendHTML = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200, statusMsg,
          {
            'Content-Type': 'text/html',
            'Content-Length': Buffer.byteLength(body)
          } + headers
        );
        res.end(body);
      }
      res.sendJSON = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200, statusMsg,
          {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          } + headers
        );
        res.end(body);
      }
      res.sendPlain = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200, statusMsg,
          {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(body)
          } + headers
        );
        res.end(body);
      }
      res.send = (body, code, headers, statusMsg) => {
        res.writeHead(
          code ? code : 200, statusMsg,
          {
            'Content-Length': Buffer.byteLength(body)
          } + headers
        );
        res.end(body);
      }
      res.redirect = (url) => {
        res.writeHead(200, {
          'Location': url
        })
        res.end();
      }

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