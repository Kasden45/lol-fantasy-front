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
const allDrafts = {

};

io.on('connection', (socket) => {
  console.log('New client connected');

  // socket.emit('currentState', { pickedPlayers, draftOrder, currentDrafter: draftOrder[currentDrafterIndex] });

  socket.on('message', ({clientId, message}) => {
      console.log(`Received message: ${clientId} - ${message}`);
      // Echo the message back to the client
      io.emit('message', {clientId, message});
  });

  socket.on('startDraft', (invitationCode) => {
    if (invitationCode in allDrafts){
      draft = allDrafts[invitationCode]
    } else {
      draft = {
        pickedPlayers: {},
        draftOrder: [],
        currentDrafterIndex: 0
      }
      allDrafts[invitationCode] = draft
    }
  })

  socket.on('joinDraft', ({userId, invitationCode}) => {
    let draft = {}
    if (invitationCode in allDrafts){
      draft = allDrafts[invitationCode]
    } else {
      draft = {
        pickedPlayers: {},
        draftOrder: [],
        currentDrafterIndex: 0
      }
      allDrafts[invitationCode] = draft
    }
    if (!draft.draftOrder.includes(userId)) {
      draft.draftOrder.push(userId);
      console.log(`Client ${userId} joined the draft ${invitationCode}`);
      io.emit('draftOrderUpdated', { draftOrder: draft.draftOrder, currentDrafter: draft.draftOrder[draft.currentDrafterIndex] });
  } else {
    io.emit('draftOrderUpdated', { draftOrder: draft.draftOrder, currentDrafter: draft.draftOrder[draft.currentDrafterIndex] });
  }
  });

  socket.on('getCurrentState', ({message, invitationCode}) => {
    console.log(`Received message: ${message}`);
    if(invitationCode in allDrafts) {
      let draft = allDrafts[invitationCode]
      // Echo the message back to the client
      socket.emit('currentState', { pickedPlayers: draft.pickedPlayers, draftOrder: draft.draftOrder, currentDrafter: draft.draftOrder[draft.currentDrafterIndex] });
    }
  });

  socket.on('playerSelected', ({ clientId, player, invitationCode, role }) => {
    if(!(invitationCode in allDrafts))
      return;
    
    let draft = allDrafts[invitationCode]
    
    if (clientId !== draft.draftOrder[draft.currentDrafterIndex]) {
        console.log(`Client ${clientId} tried to pick out of turn`);
        return;
    }

    console.log(`Client ${clientId} selected player: ${player.summonerName}`);
    if (!draft.pickedPlayers[clientId]) {
      draft.pickedPlayers[clientId] = {
          topPlayer: { role: "top", player: null },
          junglePlayer: { role: "jungle", player: null },
          midPlayer: { role: "mid", player: null },
          bottomPlayer: { role: "bottom", player: null },
          supportPlayer: { role: "support", player: null },
          subPlayer: { role: "sub", player: null },
          team: { role: "team", team: null }
        }
    }
    const roleKey = `${role}Player`;
    if (draft.pickedPlayers[clientId][roleKey]) {
      draft.pickedPlayers[clientId][roleKey].player = player;
    }
    
    // Move to the next drafter
    draft.currentDrafterIndex = (draft.currentDrafterIndex + 1) % draft.draftOrder.length;

    io.emit('playerSelected', { clientId, player });
    io.emit('currentDrafter', draft.draftOrder[draft.currentDrafterIndex]);
  });

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });

  socket.on('finishDraft', (invitationCode) => {
    console.log(`Finishing draft for league: ${invitationCode}`);
    if(!(invitationCode in allDrafts)) {
      console.log(`Wrong league: ${invitationCode}`);
      return;
    }
    
    let draft = allDrafts[invitationCode]
    for (const [key, value] of Object.entries(draft.pickedPlayers)) {
      for (const [key2,value2] of Object.entries(value)) {
        if (key2.endsWith('Player') && value2.player == null || key2 == 'team' && value2.team == null)
          {
            console.log(`Player ${key} have no ${key2}`)
            return
          } 
      }
    }
    console.log(`Found valid data for league: ${invitationCode}`);

    // Echo the message back to the client
    socket.emit('finishedDraft', { pickedPlayers: draft.pickedPlayers, draftOrder: draft.draftOrder, currentDrafter: draft.draftOrder[draft.currentDrafterIndex] });
  });
});
// start the server
server.listen(port, () => console.log(`Listening on port ${port} and ${path.join(__dirname, '../dist')}`))

// function helloWorld() {
//     console.log('Hello, World!');
// }