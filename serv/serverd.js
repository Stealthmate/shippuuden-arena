var INDEX = "index.ejs";
const RES_ROOT = __dirname + "/";
var express = require('express');
var FS = require('fs');

var CRYPTO = require('crypto');

var SERVER;
const HOST_LOCAL = "localhost";
const HOST_PUBLIC = "192.168.0.100";
const HOST = HOST_LOCAL;

const PORT = 80;

var AUTH;

function hashPassword(salt, password, algo) {
    return CRYPTO.createHash(algo).update(salt + password).digest("hex");
}

function onLogin(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    AUTH.routeLogin(username, password, res);
}

function start() {

    var app = express();

    var bodyParser = require('body-parser');

    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));

    app.get("/", function(req, res) {
        res.sendFile("client/index.html", {
            "root": __dirname
        });
    });

    app.get("/res/*", (req, res) => {
        console.log(req.params[0]);
        res.sendFile("client/" + req.params[0], {"root": __dirname});
    });

    app.post("/login", onLogin);
    app.post("/register", require('./register.js').route);

    SERVER = app.listen(PORT, HOST, function() {
        var host = SERVER.address().address;
        var port = SERVER.address().port;
        console.log("Server initialized on " + host + ":" + port);
        DB = require('./db.js');
        DB.connect(() => {
            console.log("Connected to DB.");
            require('./register.js').init(DB);
            AUTH = require('./auth.js');
            AUTH.init(DB);
        });
    });
}

start();
