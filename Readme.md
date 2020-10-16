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

app.serveStatic('./static', 'static');

app.methods.GET(
  '/',
  (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
`
<h1>Hello, World!</h1>
<p>Welcome my website!</p>
`
    );
  }
)

app.createServer();

var port = process.env.PORT || port;
app.listen(port, () => console.log('Server listening at port ' + port));
```

## Features
 * Custom request handlers
 * Static file support (Security not tested yet)
 * Router (Still W.I.P.) (Disabled atm)