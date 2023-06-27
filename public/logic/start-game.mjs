import { addXandO } from "./add-x-o-.mjs";
import { clearCells } from "./clear-cells.mjs";
const socket = io();
export function startGame() {
    const startGameButton = document.querySelector('.start-game');
    startGameButton.addEventListener('click', () => {
        startGameButton.style.display = 'none';
        document.querySelector('.board').style.filter = 'none';
        document.querySelector('.board').style.pointerEvents = 'auto';
      });
      socket.emit('gameStarted');
}

export function restartGame() {
    const startGameButton = document.querySelector('.start-game');
    startGameButton.textContent = "Restart game?";
    startGameButton.style.display = "block";
    startGameButton.addEventListener("click", () => {
        clearCells();
        addXandO();
        startGame();
    });    
}