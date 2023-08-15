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
let name; // Declare the name variable here

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
        const systemMessage = {
            user: 'ZARVIS',
            message: `On this chat ${name} has joined.`
        };

        io.emit('message', systemMessage);
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount);

        const systemMessage = {
            user: 'ZARVIS',
            message: `${name} has left the chat.`
        };

        io.emit('message', systemMessage);
    });
});

server.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
