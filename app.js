



const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/views/index.html');
});

let lobbyPlayers = [];
let readyPlayers = 0;

function resetPlayers() {
  lobbyPlayers = [];
  readyPlayers = 0;
}

io.on('connection', socket => {
    console.log('A user connected');
    let moveData = {};
    let movesX = 0;
    let movesO = 0;
  
    io.emit('playerJoined', lobbyPlayers);
    lobbyPlayers.push(socket.id);
  
    socket.on('move', move => {
      console.log('Received move:', move);
      moveData = move;
  
      if (move.player === 'X') {
        movesX = move.moves;
      } else if (move.player === 'O') {
        movesO = move.moves;
      }
  
      socket.broadcast.emit('move', { ...move, movesX, movesO });
    });
  
    socket.on('gameEnded', (winner, moveData) => {
      let symbol = winner === 'X' ? 'X' : 'O';
      if (winner === null) {
        symbol = null;
      }
      io.emit('gameEnded', symbol, moveData);
    });
  
    socket.on('gameStarted', () => {
      console.log('Game started');
      readyPlayers++;
  
      if (lobbyPlayers.length >= 6) {
        socket.emit('gameAlreadyStarted');
      } else {
        lobbyPlayers.push(socket.id); // Change "players" to "lobbyPlayers"
        io.emit('playerJoined', lobbyPlayers);
      }
  
      // Check if all players are ready
      if (readyPlayers === lobbyPlayers.length) {
        io.emit('startGame'); // Emit event to start the game
        resetPlayers()
      }
      io.emit('gameStarted');
    });
  
    socket.on('resetPlayers', () => {
      resetPlayers();
      io.emit('playersReset');
    });
  
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        const playerIndex = lobbyPlayers.findIndex(id => id === socket.id);
      
        if (playerIndex > -1) {
          lobbyPlayers.splice(playerIndex, 1);
          io.emit('playerLeft', socket.id, lobbyPlayers);
        }

        resetPlayers();
      
        // Reset readyPlayers count if all players have disconnected
        if (lobbyPlayers.length === 0) {
          readyPlayers = 0;
        }
      });
  });
  
  

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/views/css'))
app.use(express.static(__dirname + '/public/logic'))

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});