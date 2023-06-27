import { checkWin, checkDraw } from "./winner-logic.mjs";
import { restartGame } from "./start-game.mjs";

export function addXandO() {
  const cells = document.querySelectorAll('.cell');
  const socket = io();
  let gameEnded = false;
  let currentPlayer = 'X';
  let moves = 0;

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
        } else if (moves === cells.length) {
          gameEnded = true;
          socket.emit('gameEnded', null, { index }); // Emit the move data
        } else {
          currentPlayer = 'O';
          socket.emit('move', { index, player: currentPlayer });
        }
      }
    });
  });

  socket.on('move', moveData => {
    const { index, player } = moveData;
    cells[index].textContent = player;
    cells[index].classList.add('other-player');
    currentPlayer = player === 'X' ? 'O' : 'X';
  });

  socket.on('gameEnded', (winner, moveData) => {
    gameEnded = true;
    console.log(winner, "<<<<<<<<<<<<");
    if (winner) {
      cells[moveData.index].textContent = currentPlayer;
      if (currentPlayer === 'X') {
        alert(`Player X wins! You are the winner!`);
        showNotification('Winner', 'Congratulations! You won the game!');
      } else {
        alert(`Player O wins! You are the loser!`);
        showNotification('Winner', 'Better luck next time! You lost the game.');
      }
    } else {
      alert("It's a draw!");
      showNotification('Draw', "It's a draw! The game ended in a tie.");
    }
    restartGame();
  });

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