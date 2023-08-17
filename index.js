const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const systemGreeting = {
    user: 'ZARVIS',
    message: 'Welcome to Utkarsh Chat APP'
};

let userCount = 0;
let activeUsers = []; // Declare the activeUsers array here

io.on('connection', (socket) => {
    socket.emit('message', systemGreeting);
    userCount++;
    io.emit('userCount', userCount);

    console.log('Connected...');

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('joined', (userName) => {
        name = userName;
        activeUsers.push(name); // Add the user to activeUsers array
        const systemMessage = {
            user: 'ZARVIS',
            message: `On this chat ${name} has joined.`
        };

        io.emit('message', systemMessage);
        io.emit("userListUpdate", activeUsers); // Update active user list
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount);

        if (name) {
            activeUsers = activeUsers.filter((user) => user !== name); // Remove user from activeUsers
            const systemMessage = {
                user: 'ZARVIS',
                message: `${name} has left the chat.`
            };
            io.emit('message', systemMessage);
            io.emit("userListUpdate", activeUsers); // Update active user list
        }
    });
});

server.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
