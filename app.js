'use strict';

const http = require('http');

const methods = require('./methods.js');
const utils = require('./utils.js');
const router = require('./router.js');
const middleware = require('./middleware.js');
const enums = require('./enums.js');
var mode = enums.Modes.PRODUCTION;

var server;



function createServer () {

  console.log(mode, enums.Modes);
  if (
    !(mode == enums.Modes.PRODUCTION
    || mode == enums.Modes.DEBUG)
  ) {
    throw new Error('mode isn\'t enums.Modes.PRODUCTION or enums.Modes.DEBUG');
  }
  console.log(
    `${mode == enums.Modes.PRODUCTION
      ? 'PRODUCTION'
      : 'DEBUG'} Mode`
  );
  console.log('Routers:', router.routers);

  server = http.createServer((req, res) => {
    console.log('Got connection');
    // TODO: Rework Middleware... (Make it dynamic!)
    middleware.run(req, res);

    // ! that was actually wrong 👇👇👇
    /*if (methods.routes.hasOwnProperty(req.method)) {
      var route = findRoute(methods.routes[req.method], req.url);
      var routerRoute = router.findRouterRoute(req.method, req.url);

      if (route) {

        // Run the callback
        route.callback(req, res);

      } else if (routerRoute) {

        // Run the callback
        routerRoute.callback(req, res);

      } else if (
        staticServe.staticRoot
        && staticServe.staticRoute
        && req.url.match(staticServe.staticRoute)) {

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

    }*/
    
  })
}

function listen (port, callback) {
  if (
    typeof port != 'number'
    || typeof callback != 'function'
  ) {
    throw new TypeError('port isn\'t a number and/or callback isn\'t a function');
  }

  if (!server) {
    console.error('Please call app.createServer() before app.listen()');
  } else {
    server.listen(port, callback);
  }
}


module.exports = {
  createServer,
  methods,
  utils,
  listen,
  Router: router.Router,
  useRouter: router.useRouter,
  middleware,
  debugMode() { mode = enums.Modes.DEBUG; }
};