var staticArr = [];
var middleware = [];

const predefined = {
  static(root, route) {
    const i = staticArr.push(
      {
        root: root,
        route: route
      }
    ) - 1
    console.log('Index1', i);
    return function (req, res, next) {
      // staticy stuffs
      var item = staticArr[i];
      console.log('Index2', i);

      console.log('*handle file here*');
      
    }
  }
}

function use(func) {
  middleware.push(func);
}

use(predefined.static('abc', '123'));
use(predefined.static('123', 'abc'));


server = require('http').createServer((req, res) => {
  s = req.url;
  while(s.charAt(0) === '/')
  {
    s = s.substr(1);
  }
  i = Number(s);
  middleware[i]();
})

server.listen(4000, () => {});