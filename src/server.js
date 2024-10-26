const port = process.env.PORT || 8080

// wire up the module
const express = require('express')
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
// create server instance
const app = express()
const server = http.createServer(app);
const io = new Server(server);
// bind the request to an absolute path or relative to the CWD
app.use(express.static(path.join(__dirname, '../dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });

const pickedPlayers = {};
const draftOrder = [];
let currentDrafterIndex = 0;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.emit('currentState', { pickedPlayers, draftOrder, currentDrafter: draftOrder[currentDrafterIndex] });

  socket.on('message', ({clientId, message}) => {
      console.log(`Received message: ${clientId} - ${message}`);
      // Echo the message back to the client
      io.emit('message', {clientId, message});
  });

  socket.on('joinDraft', (userId) => {
    if (!draftOrder.includes(userId)) {
      draftOrder.push(userId);
      console.log(`Client ${userId} joined the draft`);
      io.emit('draftOrderUpdated', { draftOrder, currentDrafter: draftOrder[currentDrafterIndex] });
  }
  });

  socket.on('getCurrentState', (message) => {
    console.log(`Received message: ${message}`);
    // Echo the message back to the client
    socket.emit('currentState', { pickedPlayers, draftOrder, currentDrafter: draftOrder[currentDrafterIndex] });
});

  socket.on('playerSelected', ({ clientId, player }) => {
    if (clientId !== draftOrder[currentDrafterIndex]) {
        console.log(`Client ${clientId} tried to pick out of turn`);
        return;
    }

    console.log(`Client ${clientId} selected player: ${player.summonerName}`);
    if (!pickedPlayers[clientId]) {
        pickedPlayers[clientId] = {
          topPlayer: { role: "top", player: null },
          junglePlayer: { role: "jungle", player: null },
          midPlayer: { role: "mid", player: null },
          bottomPlayer: { role: "bottom", player: null },
          supportPlayer: { role: "support", player: null },
          subPlayer: { role: "sub", player: null },
          team: { role: "team", team: null }
        }
    }
    const roleKey = `${player.role}Player`;
    if (pickedPlayers[clientId][roleKey]) {
        pickedPlayers[clientId][roleKey].player = player;
    }
    
    // Move to the next drafter
    currentDrafterIndex = (currentDrafterIndex + 1) % draftOrder.length;

    io.emit('playerSelected', { clientId, player });
    io.emit('currentDrafter', draftOrder[currentDrafterIndex]);
  });

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });
});
// start the server
server.listen(port, () => console.log(`Listening on port ${port} and ${path.join(__dirname, '../dist')}`))

// function helloWorld() {
//     console.log('Hello, World!');
// }