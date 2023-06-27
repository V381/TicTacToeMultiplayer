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

io.on('connection', socket => {
    console.log('A user connected');
    let moveData = {}; 
    let movesX = 0;
    let movesO = 0; 

    lobbyPlayers.push(socket.id);
    io.emit('playerJoined', lobbyPlayers);
  
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
      io.emit('gameEnded', symbol, moveData); 
    });
  
    socket.on('gameStarted', () => {
      console.log('Game started');
      readyPlayers++;

      if (players.length >= 4) {
        socket.emit('gameAlreadyStarted');
      } else {
        players.push(socket.id);
        io.emit('playerJoined', players);
      }
      
      // Check if all players are ready
      if (readyPlayers === lobbyPlayers.length) {
          io.emit('startGame'); // Emit event to start the game
          readyPlayers = 0; // Reset the readyPlayers counter
        }
      io.emit('gameStarted');
    });
  
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        const playerIndex = lobbyPlayers.indexOf(socket.id);
        
        if (playerIndex > -1) {
          lobbyPlayers.splice(playerIndex, 1);
          io.emit('playerLeft', socket.id, lobbyPlayers);
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