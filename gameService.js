// gameService.js
class GameService {
    constructor(io) {
      this.io = io;
      this.moveData = {};
      this.movesX = 0;
      this.movesO = 0;
    }
  
    handleMove(socket, move) {
      this.moveData = move;
  
      if (move.player === 'X') {
        this.movesX = move.moves;
      } else if (move.player === 'O') {
        this.movesO = move.moves;
      }
  
      socket.broadcast.emit('move', { ...move, movesX: this.movesX, movesO: this.movesO });
    }
  
    handleGameEnd(socket, winner, moveData) {
      let symbol = winner === 'X' ? 'X' : 'O';
      if (winner === null) {
        symbol = null;
      }
      this.io.emit('gameEnded', symbol, moveData);
    }
  }
  
  module.exports = GameService;
  