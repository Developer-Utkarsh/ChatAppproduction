const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules/socket.io/client-dist/socket.io.js'));
});

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const systemGreeting = {
  user: 'ZARVIS',
  message: 'Welcome to Utkarsh Chat APP'
};

let userCount = 0;
let activeUsers = {};

function generateBotResponse(userMessage) {
  try {
    // Implement your bot response generation logic here
    // You've left this part empty, so I can't correct it
  } catch (error) {
    console.error("Error generating bot response:", error);
    return "An error occurred while generating a response.";
  }
}

io.on('connection', (socket) => {
  socket.emit('message', systemGreeting);
  userCount++;
  io.emit('userCount', userCount);

  console.log('Connected...');

  socket.on('message', (msg, targetUser) => {
    const userSocket = activeUsers[targetUser];
    if (userSocket) {
      io.to(userSocket).emit('message', msg);
    }
    if (msg.user === 'ZARVIS' && msg.message.includes('ZARVIS')) {
      const botResponse = generateBotResponse(msg.message);
      const botMessage = {
        user: 'ZARVIS',
        message: botResponse
      };
      io.emit('message', botMessage);
    } else {
      socket.broadcast.emit('message', msg);
    }
  });

  socket.on('image', (msg) => {
    io.emit('image', msg);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('joined', (username) => {
    activeUsers[username] = socket.id;
    const systemMessage = {
      user: 'ZARVIS',
      message: `On this chat, ${username} has joined.`
    };
    io.emit('message', systemMessage);
    io.emit("userListUpdate", Object.keys(activeUsers));
  });

  socket.on('dmMessage', (msg, receiver) => {
    const sender = msg.user;
    const receiverSocketId = activeUsers[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('dmMessage', msg, sender);
    }
  });

  socket.on('disconnect', () => {
    userCount--;
    const userToRemove = Object.keys(activeUsers).find(user => activeUsers[user] === socket.id);
    if (userToRemove) {
      delete activeUsers[userToRemove];
      io.emit('userListUpdate', Object.keys(activeUsers));
      console.log(`${userToRemove} disconnected`);
    }
    io.emit('userCount', userCount);
  });
});

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
