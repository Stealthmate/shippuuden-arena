const CLIENT_MSGS = {
    stopsev: {
        name: "stopserv"
    },
    reload: {
        name: "reload"
    },
    terminate: {
        name:"terminate"
    }

};


const SERVER_MSGS = {

};

module.exports.fromClient = CLIENT_MSGS;
module.exports.fromServer = SERVER_MSGS;
