const { Server } = require("socket.io");
let io;

function init(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });

    return io;
}

function getIO() {
    return io;
}

module.exports = { init, getIO };