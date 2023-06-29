import { checkWin, checkDraw } from "./winner-logic.mjs";
import { updateScore } from "./score.mjs";
import { showNotification } from "./notifications.mjs";

export function addXandO() {
  const cells = document.querySelectorAll('.cell');
  const socket = io();
  let gameEnded = false;
  let currentPlayer = 'X';
  let moves = 0;
  let scoreX = 0;
  let scoreO = 0;

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      if (!cell.textContent && currentPlayer === 'X' && !gameEnded) {
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);
        moves++;

        socket.emit('move', { index, player: currentPlayer, moves }); 
        if (checkWin(currentPlayer, cells)) {
          gameEnded = true;
          socket.emit('gameEnded', currentPlayer, { index }); // Emit the move data
        } else if (checkDraw(cells)) {
          gameEnded = true;
          socket.emit('gameEnded', null, { index }); // Emit the move data
        } else {
          currentPlayer = 'O';
          socket.emit('move', { index, player: currentPlayer });
        }
      }
    });
  });

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
        gameEnded = false;
        currentPlayer = 'X';
        moves = 0;
    }

  socket.on('move', moveData => {
    const { index, player } = moveData;
    cells[index].textContent = player;
    cells[index].classList.add('other-player');
    currentPlayer = player === 'X' ? 'O' : 'X';
  });

  socket.on('gameEnded', (winner, moveData) => {
    gameEnded = true;
    if (winner === null) {
      alert("It's a draw!");
      showNotification('Draw', "It's a draw! The game ended in a tie.");
    }
    if (winner) {
      cells[moveData.index].textContent = currentPlayer;
      if (currentPlayer === 'X') {
        scoreX++;
        showNotification('Winner', 'Congratulations! You won the game!');
      } else {
        scoreO++;
        showNotification('Winner', 'Better luck next time! You lost the game.');
      }
    }
    showResetButton();
    socket.emit('scoreUpdated', scoreX, scoreO);
    updateScore(scoreX, scoreO);
  });
}