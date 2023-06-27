const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

io.on('connection', socket => {
    console.log('A user connected');
    let moveData = {}; // Variable to store the move data
    let movesX = 0; // Moves count for Player X
    let movesO = 0; // Moves count for Player O
  
    socket.on('move', move => {
      console.log('Received move:', move);
      moveData = move; // Update the move data
  
      // Update the moves count for the respective player
      if (move.player === 'X') {
        movesX = move.moves;
      } else if (move.player === 'O') {
        movesO = move.moves;
      }
  
      // Send the move data and moves count to all connected clients except the sender
      socket.broadcast.emit('move', { ...move, movesX, movesO });
    });
  
    socket.on('gameEnded', (winner, moveData) => {
      let symbol = winner === 'X' ? 'X' : 'O';
      io.emit('gameEnded', symbol, moveData); // Pass the winner and move data to all connected clients
    });
  
    socket.on('gameStarted', () => {
      console.log('Game started');
      io.emit('gameStarted');
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/views/css'))
app.use(express.static(__dirname + '/public/logic'))

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});