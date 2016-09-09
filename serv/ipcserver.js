const RawIPC = require('node-ipc').IPC;
const IPC = new RawIPC;

const SERVER_NAME = 'NADB Server';
const RETRY_TIME = 1000;
const SILENT = true;

var STOPSERVER = false;
var SERVER;

var messageHandler;
var errorHandler = () => {console.log("Error!");};

var n_connections = 0;
var connections = [];

function onClientConnect(socket) {
    connections.push(socket);
    console.log("New connection #" + connections.indexOf(socket));
}

function onClientDisconnect(socket) {
    console.log("Connection #" + connections.indexOf(socket) + " disconnected.");
    connections.pop(socket);
    if (STOPSERVER && connections.length == 0) SERVER.stop();
}

var MSGS = {};

function msgHandler(msg, socket) {
    if (STOPSERVER) return;
    console.log("Got a message from connection #" + connections.indexOf(socket) + ": " + msg.name);

    if(messageHandler) {
        messageHandler(msg.name, msg.body);
        return;
    }

    if(MSGS[msg.name]) {
        MSGS[msg.name].callback(msg.body);
    }
}

function setupServer() {
    IPC.serve(
        function() {
            SERVER.on(
                'nadb.message',
                msgHandler
            );
            SERVER.on(
                'socket.disconnected',
                onClientDisconnect);
            SERVER.on(
                'connect',
                onClientConnect);
        }
    );
    SERVER = IPC.server;
}

function startServer(errcb) {


    IPC.config.id = SERVER_NAME;
    IPC.config.retry = RETRY_TIME;
    IPC.config.silent = SILENT;
    setupServer();

    STOPSERVER = false;
    SERVER.start();

    errorHandler = errcb;
}

function stopServer() {
    console.log("Stopping server once all connections are closed (Remaining: " + connections.length + ")");
    STOPSERVER = true;
    SERVER.broadcast('kill.connection');
}

function registerMessage(name, callback) {
    MSGS[name] = {callback: callback};
    console.log("Registered for new message: " + name);
}

function registerMessageHandler(callback) {
    messageHandler = callback;
}

function sendMessage(recipient, name, body) {
    if(recipient < 0 || !connections[recipient]) errorHandler("Cannot send message to invalid recipient: " + recipient);
    SERVER.emit(connections[recipient], {name:name, body:body});
}

function broadcastMessage() {

}

module.exports.init = startServer;
module.exports.stop = stopServer;
module.exports.onMessage = registerMessage;
module.exports.onMessageReceived = registerMessageHandler;
module.exports.sendMessage = sendMessage;
