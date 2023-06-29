import { handleCellClick } from "./cell-handler.mjs";
import { showNotification } from "./notifications.mjs";
import { updateScore } from "./score.mjs";

export function addXandO() {
  const cells = document.querySelectorAll('.cell');
  const socket = io();
  const game = {
    gameEnded: false,
    currentPlayer: 'X',
    moves: 0,
    scoreX: 0,
    scoreO: 0
  };

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      handleCellClick(cell, index, game, cells, socket, handleGameEnd);
    });
  });

  function handleGameEnd(winner, moveData) {
    game.gameEnded = true;
    if (winner) {
      cells[moveData.index].textContent = game.currentPlayer;
      if (game.currentPlayer === 'X') {
        game.scoreX++;
        showNotification('Winner', 'Congratulations! You won the game!');
      } else {
        game.scoreO++;
        console.log(game.currentPlayer);
        showNotification('Winner', 'Better luck next time! You lost the game.');
      }
    } else {
      alert("It's a draw!");
      showNotification('Draw', "It's a draw! The game ended in a tie.");
    }
    showResetButton();
    socket.emit('scoreUpdated', game.scoreX, game.scoreO);
    updateScore(game.scoreX, game.scoreO);
  }

  function showResetButton() {
    const resetButton = document.querySelector('.reset-game');
    resetButton.style.display = 'block';
    resetButton.addEventListener('click', () => {
      resetGame();
      resetButton.style.display = 'none';
    });
  }

  function resetGame() {
    // Clear the board
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('X', 'O', 'other-player');
    });

    // Reset game variables
    game.gameEnded = false;
    game.currentPlayer = 'X';
    game.moves = 0;
  }

  socket.on('move', moveData => {
    const { index, player } = moveData;
    cells[index].textContent = player;
    cells[index].classList.add('other-player');
    game.currentPlayer = player === 'X' ? 'O' : 'X';
  });
}
