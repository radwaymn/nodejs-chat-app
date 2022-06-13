const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const PORT = process.env.PORT || 7005;

let users = {};
let onlineUsers = 0;

app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "../client-side/html/index.html"));
});

app.get(["/style.css", "/css/style.css"], (req, res) => {
    res.sendFile(path.join(__dirname, "../client-side/css/style.css"));
});

app.get(["/script.js", "/js/script.js"], (req, res) => {
    res.sendFile(path.join(__dirname, "../client-side/js/script.js"));
});

app.get(["/node_modules/socket.io/client-dist/socket.io.js"], (req, res) => {
    res.sendFile(path.join(__dirname, "../node_modules/socket.io/client-dist/socket.io.js"));
});

io.on("connection", (socket) => {
    ++onlineUsers;
    socket.on('new-connection', (data) => {
        users[socket.id] = data.username;
        socket.emit('welcome-message', {
            user: 'server',
            message: `Group Chat App
                    online: ${onlineUsers}`
        });
        broadcastWelcomeMsg(socket, onlineUsers);
    });
    socket.on('new-message', (data) => {
        socket.broadcast.emit('broadcast-message', {
            user: users[data.user],
            message: data.message,
        });
    });
    socket.on('disconnect', () => {
        --onlineUsers;
        broadcastWelcomeMsg(socket, onlineUsers);
    });
})

function broadcastWelcomeMsg(socket, onlineUsers) {
    socket.broadcast.emit('welcome-message', {
        user: 'server',
        message: `Group Chat App
                online: ${onlineUsers}`
    });
}

server.listen(PORT, () => {
    console.log(`Server started, watching files at [http://localhost:${PORT}/]`);
});