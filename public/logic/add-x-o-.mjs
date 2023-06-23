import { checkWin, checkDraw } from "./winner-logic.mjs";
import { restartGame } from "./start-game.mjs";

export function addXandO() {
    const cells = document.querySelectorAll('.cell');
    let gameEnded = false;
    let currentPlayer = 'X';
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (!cell.textContent && !gameEnded) {
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);
            if (checkWin(currentPlayer, cells)) {
                gameEnded = true;
                alert(`Player ${currentPlayer} wins!`);
                restartGame();
            } else if (checkDraw(cells)) {
                gameEnded = true;
                alert("It's a draw!");
                restartGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
            }
        });
    });
}