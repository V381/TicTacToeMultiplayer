// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const GameService = require('./gameService');

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server);
    this.gameService = new GameService(this.io);
    this.lobbyPlayers = [];
    this.readyPlayers = 0;

    this.configureApp();
    this.handleSocketConnections();
  }

  configureApp() {
    this.app.use(express.static(__dirname + '/public'));
    this.app.use(express.static(__dirname + '/public/views/css'));
    this.app.use(express.static(__dirname + '/public/logic'));

    this.app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/views/index.html');
    });
  }

  handleSocketConnections() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      this.io.emit('playerJoined', this.lobbyPlayers);
      this.lobbyPlayers.push(socket.id);

      socket.on('move', (move) => {
        console.log('Received move:', move);
        this.gameService.handleMove(socket, move);
      });

      socket.on('gameEnded', (winner, moveData) => {
        this.gameService.handleGameEnd(socket, winner, moveData);
      });

      socket.on('gameStarted', () => {
        console.log('Game started');
        this.readyPlayers++;

        if (this.lobbyPlayers.length >= 6) {
          socket.emit('gameAlreadyStarted');
        } else {
          this.lobbyPlayers.push(socket.id);
          this.io.emit('playerJoined', this.lobbyPlayers);
        }

        if (this.readyPlayers === this.lobbyPlayers.length) {
          this.io.emit('startGame');
          this.resetPlayers();
        }

        this.io.emit('gameStarted');
      });

      socket.on('resetPlayers', () => {
        this.resetPlayers();
        this.io.emit('playersReset');
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
        const playerIndex = this.lobbyPlayers.findIndex((id) => id === socket.id);

        if (playerIndex > -1) {
          this.lobbyPlayers.splice(playerIndex, 1);
          this.io.emit('playerLeft', socket.id, this.lobbyPlayers);
        }

        this.resetPlayers();

        if (this.lobbyPlayers.length === 0) {
          this.readyPlayers = 0;
        }
      });
    });
  }

  resetPlayers() {
    this.lobbyPlayers = [];
    this.readyPlayers = 0;
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

module.exports = Server;
