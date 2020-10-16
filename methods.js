var routes = {
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
}

exports = {
  routes: routes,
  method: method
};

var keys = Object.keys(routes);
for (let i = 0; i < keys.length; i++) {
  const item = keys[i];
  exports[item] = (route, callback) => method(item, route, callback);
}


module.exports = exports;