var SERVERPROC;

var RESTART_ON_EXIT = false;

function onServerExit(code, signal) {

    if(RESTART_ON_EXIT) {
        RESTART_ON_EXIT = false;
        console.log("Restarting server...");
        startServer();
    }
}

function stopServer() {
    if(SERVERPROC.kill) {
        console.log("Stopping server...");
        SERVERPROC.kill("SIGTERM");
    }
}

function startServer() {
    SERVERPROC = require('child_process').fork("./serverd.js", {stdio: 'inherit'});
    SERVERPROC.on("exit", onServerExit);
}

function restartServer() {
    RESTART_ON_EXIT = true;
    stopServer();
}

function dispatchMessage(name, body) {
    switch(name) {
        case "startserv": startServer(); break;
        case "stopserv" : stopServer(); break;
        case "restartserv": restartServer(); break;

        default: {
            if(SERVERPROC)  SERVERPROC.send({name, body});
        }
    }
}

function init(ipc) {
    ipc.onMessageReceived(dispatchMessage);
}

module.exports.init = init;
module.exports.startServer = startServer;
module.exports.stopServer = stopServer;
