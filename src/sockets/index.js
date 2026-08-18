const registerClashSocket = require('./clashSocket');

function registerSockets(io) {

    io.on("connection", (socket) => {

        registerClashSocket(io, socket);


    });

}

module.exports = registerSockets;