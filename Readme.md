# web-hmm
This is a basic HTTP "framefork" I'm making.
## Quick Start
Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):
```bash
$ npm install web-hmm
```
Add this code to a JavaScript file:
```js
var app = require('web-hmm');

app.middleware.use(function (req, res, next) {
  console.log('Request Type:', req.method);
  console.log('Request URL:', req.url);
  console.log('Date & Time:', new Date(Date.now()).toString());
  next();
}, 'LOGGING_MIDDLEWARE')

app.methods.GET(
  '/',
  (req, res) => {
    res.writeHTML(
`
<h1>Hello, World!</h1>
<p>Welcome my website!</p>
`
    );
  }
)

app.middleware.use(
  app.middleware.predefined.static(
    './static', '/public'
  ), 'STATIC_PUBLIC'
)

app.createServer();

var port = process.env.PORT || port;
app.listen(port, () => console.log('Server listening at port ' + port));
```

Happy ~~hacking~~➡**securing**!

## Features
 * Custom request handlers
 * Static file support (Security not tested yet)
 * Router (Still W.I.P.) (Disabled for now)
 * Middlewares (W.I.P.) (Doesn't work right now)

## API Tree

```js

/*
* FN  - Function
* gen - generate
*/

web-hmm
 ├─ debugMode ()
 ├─ createServer (callback)
 ├─ methods .................... // IMPORT
 │   ├─ makeRouteMiddleware () . // INTERNAL
 │   ├─ methodTypes ['GET','HEAD','POST','PUT'...]
 │   └─ Auto-gen FNs from methodTypes ()
 │      ^callback^s inputs
 │       ├─ req {}
 │       └─ res {}
 │           ├─ sendHTML ()
 │           ├─ sendJSON ()
 │           ├─ sendPlain ()
 │           ├─ send ()
 │           └─ redirect ()
 ├─ utils ...................... // IMPORT
 │   └─ joinArrNicely ()
 ├─ listen ()
 ├─ Router ()
 ├─ useRouter ()
 └─ middleware ................. // IMPORT
     ├─ use()
     ├─ run() .................. // INTERNAL
     ├─ staticArr [] ........... // INTERNAL
     ├─ predefined {}
     │  └─ static .............. // IMPORT
     │     └─ static ()
     │        └─ [Anyoumus]() .. // INTERNAL
     └─ middleware [] .......... // INTERNAL
```

## More Information
### Response methods
#### The send methods
`sendHTML`, `sendJSON`, `sendPlain` and `send`.
```js
// () - Required
// [] - Optional
res.sendHTML( // And all the other send methods
  'Hello, World!', //   (BODY)
  200, //               [STATUS CODE]
  'OK', //              [STATUS MESSAGE]
  {} //                 [HEADERS]
);
```
#### Other added methods
```js
// () - Required
// [] - Optional

res.redirect( // Redirecting... Should be pretty straight-forward
  'https://duckduckgo.com' // (URL)
)

```

#### Helper Functions/Methods

```js
// () - Required
// [] - Optional

app.middleware.use(
  (req, res, next) => { //      (Handler Function)
    console.log(
      req.method,
      req.url,
      new Date(Date.now()).toString()
    )

    next(); // Pass it to the next middleware handler.
    // If this is a custom content handler just do return or something
  },
  'LOGGER' //                   [Name to display in Console when debugging]
)

// This returns a function that should be used with the function above
app.middleware.predefined.static(
  './public/assets', //         (Root from where to get files at)
  '/assets' //                  (Base route where the files will be served)
)


/*
 * Router functions/methods would go here
 * but router is still W.I.P. and i'll
 * probably have to re-code it
*/

```