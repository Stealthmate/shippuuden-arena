const ACTION_START = 0;
const ACTION_STOP = 1;
const ACTION_RESTART = 2;
const ACTION_RELOAD = 3;

function execute(args, ipc) {

    var action = -1;
    if (!args) args = [];

    for (var i = 0; i <= args.length - 1; i++) {
        switch (args[i]) {
            case "-start": action = ACTION_START; break;
            case "-stop": action = ACTION_STOP; break;
            case "-restart": action = ACTION_RESTART; break;
            case "-reload": action = ACTION_RELOAD; break;

            default: {
                console.log("Invalid syntax. Type 'man sv' for help.");
                return;
            }
        }
    }

    switch(action) {
        case ACTION_START: {
            ipc.sendMessage("startserv");
        } break;
        case ACTION_STOP: {
            ipc.sendMessage("stopserv");
        } break;
        case ACTION_RESTART: {
            ipc.sendMessage("restartserv");
        } break;
        case ACTION_RELOAD: {
            ipc.sendMessage("reloadserv");
        }
    }

}

module.exports.execute = execute;
