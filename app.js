var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var session = require("express-session");
var router = require("./routes/routes");
var router_app = require("./routes/app_routes");
var session_middleware = require("./middleware/session");
var RedisStore = require("connect-redis")(session);
var http = require("http");
var realtime = require("./realtime");

/*REST*/
var methodOverride = require("method-override");

var app = express();
var server = http.Server(app);

var sessionMiddleware = session({
    store: new RedisStore({}),//aqui irian las variables de configuracion documentacion en github de connect redis
    secret: "super ultra secret word",
    resave: false,
    saveUninitialized: false
});

var io = realtime(server,sessionMiddleware);

app.use(sessionMiddleware);

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "jade");

app.use("/public",express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); //para peticiones application/json
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(function(req, res, next){
    res.io = io;
    next();
});

app.use("/",router);
app.use("/app",session_middleware);
app.use("/app",router_app);

server.listen(8080);