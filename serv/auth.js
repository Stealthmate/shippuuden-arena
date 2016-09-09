const CRYPTO = require("crypto");

var DB;

var AUTH_SUCCESS = 0;
var AUTH_PASSWORD_INCORRECT = 1;
var AUTH_USER_DOES_NOT_EXIST = 3;

function loginFailed() {
    return "Error!";
}

function loginSuccess(username) {
    return "Welcome back, " + username;
}

function getUserAuthInfo(username, callback) {
    DB.queryUser(username, (queryResult) => {
        if (!queryResult) {
            callback(null);
            return;
        }
        callback(queryResult);
    });
}

function authUser(username, password, response) {
    getUserAuthInfo(username, (info) => {
        if(!info) {
            response.send(loginFailed());
            return;
        }
        var pwhash = CRYPTO.createHash(info.algorithm).update(info.salt + password).digest("hex");
        response.contentType("text/plain");
        if (pwhash == info.pwhash)
            response.send(loginSuccess());
        else
            response.send(loginFailed());
        return;
    });
}

function init(db) {
    DB = db;
}

module.exports.routeLogin = authUser;
module.exports.init = init;
