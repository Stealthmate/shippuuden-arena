const READLINE = require('readline');

var IPC_CLIENT;

var TERMINATE;

var EXIT = false;

function exit() {
    if (EXIT) return;
    IPC_CLIENT.disconnect();
    console.log("Terminating...");
    EXIT = true;
}

function fConnect() {
    IPC_CLIENT.connect();
}

function fDisconnect() {
    IPC_CLIENT.disconnect();
}

function printHelp(cmd) {
    var FS = require('fs');
    var stats;
    var path = "./cmd/" + cmd + ".man";
    try {
        stats = FS.statSync(path);
    } catch (err) {
        console.log("No manual found for command '" + cmd + "'");
        return;
    }
    if (!stats.isFile()) {
        console.log("No manual found for command '" + cmd + "'");
        return;
    }

    console.log(FS.readFileSync(path, {
        encoding: "utf8"
    }));
}

function fMan(args) {
    switch (args[0]) {
        case "":
            {
                console.log("Use 'man X' where X is the name of a command.");
            }
            break;
        case "connect":
            {
                console.log("Connects to the IPC server. Does not do anything if already connected.");
            }
            break;
        case "disconnect":
            {
                console.log("Disconnects from the IPC server. Does not do anything if already disconnected");
            }
            break;
        case "exit":
            {
                console.log("Disconects from the IPC server and terminates.");
            }
        case "man":
            {
                console.log("Seriously?");
            }
            break;

        default:
            {
                printHelp(args[0]);
            }
    }
}

function fExit() {
    rl.close();
}

const CMD_MAP = {
    "connect": fConnect,
    "disconnect": fDisconnect,
    "man": fMan,
    "exit": fExit
}

function executeLine(input) {
    var formattedInput = input.trim().replace(/ +/g, " ");
    var cmd = formattedInput.split(" ")[0];
    var args = formattedInput.substring(cmd.length + 1).split(" ");

    if (CMD_MAP[cmd]) CMD_MAP[cmd](args, IPC_CLIENT);
    else {
        var cmd_module;
        try {
            cmd_module = require("./cmd/" + cmd + ".js");
            cmd_module.execute(args, IPC_CLIENT);
        } catch (e) {
            console.log(e);
            console.log("Invalid command");
        }
    }

    if (!rl.closed) rl.prompt();
}


function init() {

    EXIT = false;
    IPC_CLIENT = require("./ipcclient.js");
    IPC_CLIENT.connect();

    rl = READLINE.createInterface(process.stdin, process.stdout);
    rl.on("line", executeLine);
    rl.on("close", exit);
    rl.prompt();
}

init();
