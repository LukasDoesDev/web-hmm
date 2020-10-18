var app = require("../app.js");
// production mode defaults
//app.debugMode();

app.methods.POST("/abc", (req, res) => {});

app.methods.GET("/", (req, res) => {});

app.methods.PATCH("/abc", (req, res) => {});

app.methods.DELETE("/abc", (req, res) => {});


app.middleware.use(
  app.middleware.predefined.static("./", "/public"),
  "STATIC_PUBLIC"
);

//app.useRouter('/api', require('./api.js'));

app.createServer();

app.listen(3000, () => console.log("Server listening at port 3000"));
