var DB_NAME = "SHIPPUUDEN_ARENA"

var DB = null;

var AUTH = null;

var callback = null;

function onConnectSuccess(err, db) {
    console.log(err);
    DB = db;
    AUTH = DB.collection("authdata");
    callback();
}

function connect(cb) {
    var MongoClient = require('mongodb').MongoClient;
    callback = cb;
    MongoClient.connect("mongodb://localhost:27017/" + DB_NAME, onConnectSuccess);

}

function insert(uname, salt, algorithm, pwhash) {
    AUTH.insert({name: uname, salt: salt, algorithm: algorithm, pw: pwhash});
}

function queryUser(name, callback) {
    AUTH.findOne({name: name}, (err, doc) => {
        if(!doc)  {
            callback(null);
            return;
        }
        callback({name: doc.name, salt: doc.salt, pwhash: doc.pwhash, algorithm: doc.algorithm});
    });
}

module.exports.connect = connect;
module.exports.createUser = insert;
module.exports.queryUser = queryUser;
