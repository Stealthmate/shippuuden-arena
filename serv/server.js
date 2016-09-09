const IPCSERVER = require('./ipcserver.js');
const SHELL = require('./shell.js');


function init() {
    IPCSERVER.init();
    SHELL.init(IPCSERVER);
    SHELL.startServer();
}

init();
