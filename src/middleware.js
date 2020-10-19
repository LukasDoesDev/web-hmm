var middleware = []; // Array containing the functions for middleware
var staticArr = []; //  Array of objects with the following structure:
/*
{
  root: './files/static/css', // Filesystem path (can be relative)
  route: '/css', //              Web base-path   (absoulte)
}
*/

const predefined = {
  static: require('./static.js')
}

function use(func, type) {
  if (!func) {
    throw new TypeError('The func parameter is undefined/null');
  }
  middleware.push(
    {
      type: type ? type : 'NOT_SPECIFIED',
      func: func
    }
  )
}

function run(req, res) {
  // TODO: Make it dynamic 👍
  // * (x) Normal Routing
  // * (x) Static file stuffs
  // * (x) Using middleware

  // *     Router prob needs its own middleware stuff.......
  // *     The user can probably just do a check with the URL
  // * (o) Router Routing (Routing isn't even done...)

  var tmp = [...middleware];
  var count = 0;

  console.log();
  console.log(`Start of the run function. Count: ${count}`);
  console.log();

  var next = () => {
    if (count != 0) {
      tmp.shift();
    }

    if (tmp.length == 0 || count >= middleware.length) {
      // 404
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: '404 Not Found' }));
      return;
    }

    console.log();
    count++;
    console.log('Running middleware, Count: ' + count);
    tmp[0].func(req, res, next);
  };
  console.log(tmp);
  next();
  console.log();
  console.log(`End of the run function. Count: ${count}`);
  console.log();
}

module.exports = {
  use,
  run,
  staticArr,
  predefined,
  middleware
}