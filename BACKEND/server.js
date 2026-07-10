require('dotenv').config();

const http = require("http");
const { Server } = require("socket.io");
const {init} = require("./src/socket/socket.js");
    

const app = require('./src/app');
const connectDB = require('./src/db/db.js');

connectDB();

const server = http.createServer(app);

const io = init(server);


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinShow", (showId) => {
        socket.join(showId);

        console.log(
            `Socket ${socket.id} joined room ${showId}`
        );
    });


    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports.io = io;