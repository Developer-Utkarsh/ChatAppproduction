const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
let name;
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
// const openai = require("openai");

// const apiKey = "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";
// const configuration = new Configuration({
//   apiKey: apiKey,
// });


async function generateBotResponse(userMessage) {
  try {
    // const openai = new OpenAIApi(configuration);
    const prompt = `User: ${userMessage}\nBot:`;
    
    
  } catch (error) {
    // console.error("Error generating bot response:", error);
    // return "An error occurred while generating a response.";
  }
}

// console.log(OpenAIApi);


const testMessage = "ZARVIS, tell me about yourself.";
const botResponse = generateBotResponse(testMessage);
// console.log("Bot Response:", botResponse);

io.on('connection', (socket) => {
    socket.emit('message', systemGreeting);
    userCount++;
    io.emit('userCount', userCount);

    console.log('Connected...');

    socket.on('message', (msg) => {
        if (msg.user === 'ZARVIS') {
            // Handle bot activation
            console.log("arrived to api")

            if (msg.message.includes('ZARVIS')) {
                const botResponse = generateBotResponse(msg.message);
                const botMessage = {
                    user: 'ZARVIS',
                    message: botResponse

                };
                console.log("arrived to ai")
                io.emit('message', botMessage);
            }else{

            }
            
        } else {
            socket.broadcast.emit('message', msg);
        }
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