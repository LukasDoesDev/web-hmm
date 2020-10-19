const path = require("path");
const fs = require("fs");

module.exports = function static(root, route) {
    
  if (
    !root
    || !route
    || root == ''
    || route == ''
    || typeof root != 'string'
    || typeof route != 'string'
  ) {
    throw new TypeError(
      'root and/or route are/is undefined, null, empty or not (a) string(s)'
    );
  }

  if (require('./app.js').mode == require('./enums.js').Modes.DEBUG)
  {
    staticArr.push(
      {
        root: root,
        route: route
      }
    )
  }


  return function (req, res, next) {
    var item = {
      root,
      route
    }

    if (req.url.match(item.route)) {
      var resolvedBase = path.resolve(root);
      var safeSuffix = path.normalize(req.url.replace(item.route, '')).replace(/^(\.\.[\/\\])+/, '');
      var fileLoc = path.join(resolvedBase, safeSuffix);
  
      var stream = fs.createReadStream(fileLoc);

      // Handle non-existent file
      stream.on('error', function(error) {
          console.error('\n\n\nError while reading file\n\n', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify({ code: '500 Internal Server Error' }));
          res.end();
          next();
          return;
      });

      // File exists, stream it to user
      res.statusCode = 200;
      stream.pipe(res);
      return;
    } else {
      next();
    }
  }
}