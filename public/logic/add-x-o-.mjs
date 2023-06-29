import { checkWin, checkDraw } from "./winner-logic.mjs";
import { updateScore } from "./score.mjs";

export function addXandO() {
  const cells = document.querySelectorAll('.cell');
  const socket = io();
  let gameEnded = false;
  let currentPlayer = 'X';
  let moves = 0;
  let gameStarted = false;
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
    if (winner) {
      cells[moveData.index].textContent = currentPlayer;
      if (currentPlayer === 'X') {
        scoreX++;
        showNotification('Winner', 'Congratulations! You won the game!');
      } else {
        scoreO++;
        showNotification('Winner', 'Better luck next time! You lost the game.');
      }
    } else {
      alert("It's a draw!");
      showNotification('Draw', "It's a draw! The game ended in a tie.");
    }
    showResetButton();
    socket.emit('scoreUpdated', scoreX, scoreO);
    updateScore(scoreX, scoreO);
  });

  function updateScore(scoreX, scoreO) {
    const scoreElement = document.querySelector('.score');
    scoreElement.textContent = `Score: X - ${scoreX} | O - ${scoreO}`;
  }

  function showNotification(title, message) {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body: message });
        }
      });
    }
  }
}
