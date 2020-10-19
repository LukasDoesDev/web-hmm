const methods = require('./methods.js');

var routers = [];

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
for (let i = 0; i < methods.methodTypes.length; i++) {
  const item = methods.methodTypes[i];

  Router.prototype[item] = function (route, callback) {
    if (this.routes.hasOwnProperty(item)) {

      this.routes[item].push({
        route: route,
        callback: callback
      });

    }
    method.makeRouteMiddleware();
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


module.exports = {
  useRouter,
  Router,
  findRouterRoute,
  routers
}