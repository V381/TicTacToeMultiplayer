import { checkWin, checkDraw } from "./winner-logic.mjs";

export function handleCellClick(cell, index, game, cells, socket, handleGameEnd) {
  if (!cell.textContent && !game.gameEnded) {
    cell.textContent = game.currentPlayer;
    cell.classList.add(game.currentPlayer);
    game.moves++;

    socket.emit('move', { index, player: game.currentPlayer, moves: game.moves });
    console.log(cell);

    if (checkWin(game.currentPlayer, cells)) {
      handleGameEnd(game.currentPlayer, { index });
    } else if (checkDraw(cells)) {
      handleGameEnd(null, { index });
    } else {
      game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
      // Broadcast the move with the updated currentPlayer symbol
      socket.emit('move', { index, player: game.currentPlayer, moves: game.moves });
    }
  }
}