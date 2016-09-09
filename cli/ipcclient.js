const RL = require('readline');
const SERVER_NAME = 'NADB Server';

const CLIENT_ID = "NADB client"
const SILENT = true;

var IPC;
var SOCKET;

var MSGS = {};

function onKillRequest() {
    console.log("Server " + SERVER_NAME + " requested to kill connection. Disconnecting...");
    IPC.disconnect(SERVER_NAME);
}

function onMessage(msg) {
    if(MSGS[msg.name]) MSGS[msg.name].callback(msg.body);
}

function onDisconnect() {
}

function onConnect() {
}

function connect(id) {

    var ipc = new require('node-ipc');
    IPC = ipc;
    ipc.config.id = id || CLIENT_ID;
    ipc.config.silent = SILENT;
    ipc.connectTo(
        SERVER_NAME,
        function() {
            ipc.of[SERVER_NAME].on('connect', onConnect);
            ipc.of[SERVER_NAME].on('disconnect', onDisconnect);
            ipc.of[SERVER_NAME].on('nadb.message', onMessage);
            ipc.of[SERVER_NAME].on('kill.connection', onKillRequest);
        }
    );

    SOCKET = ipc.of[SERVER_NAME];
}

function disconnect() {
    if(!SOCKET || SOCKET.socket.destroyed) return;
    IPC.disconnect(SERVER_NAME);
}

function registerForMessage(name, callback) {
    MSGS[name] = {};
    MSGS[name].callback = callback;
}

function sendMessage(name, body) {
    SOCKET.emit("nadb.message", {name:name, body:body});
}

module.exports.connect = connect;
module.exports.disconnect = disconnect;
module.exports.sendMessage = sendMessage;
module.exports.onMessage = registerForMessage;
