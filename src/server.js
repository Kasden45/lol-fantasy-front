const port = process.env.PORT || 8080
const team_size = 7
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
        started: true,
        pickedPlayers: {},
        draftQueue: [],
        draftParticipants: [],
        currentPick: 0
      }
      allDrafts[invitationCode] = draft
    }

    draft.started = true
    draft.draftQueue = createDraftQueue(draft.draftParticipants, team_size * draft.draftParticipants.length)
    // io.emit('draftStarted', { draftParticipants: draft.draftParticipants, currentDrafter: draft.draftQueue[draft.currentPick]?.user?.id, draftQueue: draft.draftQueue });
    io.emit('currentState', { pickedPlayers: draft.pickedPlayers, draftParticipants: draft.draftParticipants, currentDrafter: draft.draftQueue[draft.currentPick]?.user?.id, draftQueue: draft.draftQueue, draftStarted: draft.started });

  })

  socket.on('joinDraft', ({userId, login, invitationCode}) => {
    let draft = {}
    if (invitationCode in allDrafts){
      draft = allDrafts[invitationCode]
    } else {
      draft = {
        started: false,
        pickedPlayers: {},
        draftQueue: [],
        draftParticipants: [],
        currentPick: 0
      }
      allDrafts[invitationCode] = draft
    }
    if (!draft.draftParticipants.map(p => p.id).includes(userId)) {
      draft.draftParticipants.push({id: userId, username: login});
      console.log(`draft ${invitationCode}`, draft);
      console.log(`Client ${userId} joined the draft ${invitationCode}`);
      io.emit('draftOrderUpdated', { draftParticipants: draft.draftParticipants, currentDrafter: userId });
  } else {
    io.emit('draftOrderUpdated', { draftParticipants: draft.draftParticipants, currentDrafter: userId });
  }
  });

  socket.on('getCurrentState', ({message, invitationCode}) => {
    console.log(`Received message: ${message}`);
    if(invitationCode in allDrafts) {
      let draft = allDrafts[invitationCode]
      // Echo the message back to the client
      socket.emit('currentState', { pickedPlayers: draft.pickedPlayers, draftParticipants: draft.draftParticipants, currentDrafter: draft.draftQueue[draft.currentPick]?.user?.id, draftQueue: draft.draftQueue, draftStarted: draft.started });
    }
  });

  socket.on('playerSelected', ({ clientId, player, invitationCode, role }) => {
    if(!(invitationCode in allDrafts))
      return;
    
    let draft = allDrafts[invitationCode]
    console.log('playerSelected draft:', draft)
    console.log(draft.draftQueue[draft.currentPick]?.user)
    if (clientId !== draft.draftQueue[draft.currentPick]?.user?.id) {
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
      draft.draftQueue[draft.currentPick].player = player;
    }
    
    // Move to the next drafter
    draft.currentPick++;

    io.emit('playerSelected', { clientId, player });
    io.emit('currentState', { pickedPlayers: draft.pickedPlayers, draftParticipants: draft.draftParticipants, currentDrafter: draft.draftQueue[draft.currentPick]?.user?.id, draftQueue: draft.draftQueue, draftStarted: draft.started });
    io.emit('currentDrafter', draft.draftQueue[draft.currentPick]?.user?.id);
  });

  socket.on('teamSelected', ({ clientId, team, invitationCode }) => {
    if(!(invitationCode in allDrafts))
      return;
    
    let draft = allDrafts[invitationCode]
    console.log('teamSelected draft:', draft)
    console.log(draft.draftQueue[draft.currentPick]?.user)
    if (clientId !== draft.draftQueue[draft.currentPick]?.user?.id) {
        console.log(`Client ${clientId} tried to pick out of turn`);
        return;
    }

    console.log(`Client ${clientId} selected team: ${team.name}`);
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
    const roleKey = `team`;
    if (draft.pickedPlayers[clientId][roleKey]) {
      draft.pickedPlayers[clientId][roleKey].team = team;
      draft.draftQueue[draft.currentPick].player = team;
    }
    
    // Move to the next drafter
    draft.currentPick++;

    io.emit('teamSelected', { clientId, team });
    io.emit('currentState', { pickedPlayers: draft.pickedPlayers, draftParticipants: draft.draftParticipants, currentDrafter: draft.draftQueue[draft.currentPick]?.user?.id, draftQueue: draft.draftQueue, draftStarted: draft.started });
    io.emit('currentDrafter', draft.draftQueue[draft.currentPick]?.user?.id);
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
    socket.emit('finishedDraft', { pickedPlayers: draft.pickedPlayers, draftParticipants: draft.draftParticipants, currentDrafter: draft.draftQueue[draft.currentPick]?.user?.id });
  });
});
// start the server
server.listen(port, () => console.log(`Listening on port ${port} and ${path.join(__dirname, '../dist')}`))

function createDraftQueue(participants, totalPicks) {
    // create snake draft order
    const draftQueue = [];
    const rounds = Math.ceil(totalPicks / participants.length);
    const participantIds = participants.sort(() => Math.random() - 0.5);
    // const participantIds = participants.sort(() => Math.random() - 0.5);
    console.log('participantIds', participantIds)
    for (let round = 0; round < rounds; round++) {
      if (round % 2 === 0) {
        for (let i = 0; i < participantIds.length; i++) {
          draftQueue.push({user: participantIds[i], player: null});
        }
      } else {
        for (let i = participantIds.length - 1; i >= 0; i--) {
          draftQueue.push({user: participantIds[i], player: null});
        }
      }
    }
    return draftQueue;
}