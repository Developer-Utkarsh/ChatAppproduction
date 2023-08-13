const express = require('express');
const app = express();
const serverless = require('serverless-http')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path');  // Add path module
const router = express.Router()
// const server = http.createServer(app);  // Create server using http module
// const io = socketIO(server);

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Use path.join for correct file path
});



const systemGreeting = {
    user: 'Jarvis',
    message: 'Welcome to Utkarsh Chat APP'
};

io.on('connection', (socket) => {
    socket.emit('message', systemGreeting);  // Send a welcome message to the connecting client
    console.log('Connected...');

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);  // Broadcast the received message to all clients
    });

    socket.on('joined', (name) => {
        const systemMessage = {
            user: 'Jarvis',
            message: `${name} has joined the chat.`
        };
        
        io.emit('message', systemMessage);  // Broadcast the join message to all clients
    });
})

module.exports.handler = serverless(app);
http.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
