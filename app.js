/* console.log('Hello, World!');

function test (x) {
  if (x) {
    console.log(x);
  } else {
    console.log('No variable "x" defined 🙁');
  }
}
*/

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const methods = require('./methods.js');
const utils = require('./utils.js');
var server;
var staticRoot;
var staticRoute;
var routers = [];


function err404 (res) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ code: '404 Not Found' }))
}

function findRoute (arr, route) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.route === route) {
      return item;
    }
  }
  return undefined;
}

/**
 * Enables serving static files from [root] at [route]
 * @param {string} root The root used for serving static files,
 * @param {string} route The route at which the files will be served
 */
function serveStatic(root, route) {
  staticRoot = root;
  staticRoute = route;
}

/**
 * Enables the selected router
 * 
 * @param {string} route The base route the router will use
 * @param {Router} router The router to be used
 */
function useRouter(route, router) {
  routers.push({
    route: route,
    router: router
  })
}

/**
 * Creates a Router
 * 
 * @public
 */
class Router {
  constructor() {
    // Add the method types in so we can just .push() to them
    this.routes = {};
    Object.keys(methods.routes).map((x) => {
      this.routes[x] = [];
    });
  }
}

// Generate the prototype(s) for the Router type
var keys = Object.keys(methods.routes);
for (let i = 0; i < keys.length; i++) {
  const item = keys[i];

  Router.prototype[item] = function (route, callback) {
    if (this.routes.hasOwnProperty(item)) {

      this.routes[item].push({
        route: route,
        callback: callback
      });

    }
  }
}

function findRouterRoute(method, url) {
  for (let i = 0; i < routers.length; i++) {
    const item = routers[i];
    if (url.match(item.route)) {
      console.log(item.router.routes);
      console.log(url, item.route, item.router.routes[0], path.posix.join(item.route, '/'));
      for (let k = 0; k < item.router.routes.length; k++) {
        const item2 = item.router.routes[k];
        if (url === path.join(item.route, item2.route)) {
          return item2;
        }
      }
    }
  }
}

function createServer () {
  console.log(methods.routes, routers);

  server = http.createServer((req, res) => {
    if (methods.routes.hasOwnProperty(req.method)) {

      var route = (
        findRoute(methods.routes[req.method], req.url)
      //  || findRouterRoute(req.method, req.url)
      );

      if (route) {
        // Routes
        route.callback(req, res);
      } else if (staticRoot && staticRoute && req.url.match(staticRoute)) {
        // Static
        var resolvedBase = path.resolve(staticRoot);
        var safeSuffix = path.normalize(req.url.replace(staticRoute, '')).replace(/^(\.\.[\/\\])+/, '');
        var fileLoc = path.join(resolvedBase, safeSuffix);
    
        var stream = fs.createReadStream(fileLoc);

        // Handle non-existent file
        stream.on('error', function(error) {
            res.writeHead(404, 'Not Found');
            res.end(JSON.stringify({ code: '404 Not Found', info: 'File Not Found' }));
        });

        // File exists, stream it to user
        res.statusCode = 200;
        stream.pipe(res);
      } else {
        err404(res);
      }

    } else {

      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(
        {
          code: '400 Bad Request',
          info: `Other methods than ${utils.joinArrNicely(Object.keys(methods.routes))} are not currently supported.`
        }
      ));

    }
    
  });
}

function listen (port, callback) {
  if (!server) {
    console.error('Please call app.createServer() before app.listen()');
  } else {
    server.listen(port, callback);
  }
}


module.exports = {
  // test: test,
  createServer: createServer,
  methods: methods,
  utils: utils,
  listen: listen,
  serveStatic: serveStatic,
  Router: Router,
  useRouter: useRouter
};