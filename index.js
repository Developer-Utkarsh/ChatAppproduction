const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const router = express.Router();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const systemGreeting = {
    user: 'ZARVIS',
    message: 'Welcome to Utkarsh Chat APP'
};

let userCount = 0;

io.on('connection', (socket) => {
    socket.emit('message', systemGreeting);
    userCount++;
    io.emit('userCount', userCount);

    console.log('Connected...');

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('joined', (name) => {
        const systemMessage = {
            user: 'ZARVIS',
            message: `${name} has joined the chat.`
        };
        
        io.emit('message', systemMessage);
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount);
    });
});

http.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
