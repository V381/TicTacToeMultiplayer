import { checkWin, checkDraw } from "./winner-logic.mjs";
import { restartGame } from "./start-game.mjs";

export function addXandO() {
  const socket = io();
  const cells = document.querySelectorAll('.cell');
  let gameEnded = false;
  let currentPlayer = 'X';

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      if (!cell.textContent && currentPlayer === 'X') {
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);

        if (checkWin(currentPlayer, cells)) {
          gameEnded = true;
          restartGame();
          socket.emit('gameEnded', currentPlayer);
        } else if (checkDraw(cells)) {
          gameEnded = true;
          alert("It's a draw!");
          restartGame();
          socket.emit('gameEnded', null);
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

  socket.on('gameEnded', winner => {
    gameEnded = true;
    if (winner) {
      alert(`Player ${winner} wins!`);
    } else {
      alert("It's a draw!");
    }
    restartGame();
  });
}