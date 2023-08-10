const express = require('express');
const static = require('static')
const app = express();
const http = require('http').createServer(app)
const PORT = process.env.PORT || 8000
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.use(express.static(__dirname + '/public'))






const io = require('socket.io')(http);

const systemGreeting = {
    user: 'Jarvis',
    message: `Welcome to Utkarsh Chat APP `
};

io.on('connection', (socket) => {
    socket.broadcast.emit('message', systemGreeting);
    console.log("connected..");

    socket.on("message", (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('joined', (name) => {
        const systemMessage = {
            user: 'Jarvis',
            message: `${name} has joined the chat.`
        };
        
        socket.broadcast.emit('message', systemMessage);
    });
});

http.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`)
})