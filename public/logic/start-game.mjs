export function startGame() {
    const startGameButton = document.querySelector('.start-game');
    startGameButton.addEventListener('click', () => {
        startGameButton.style.display = 'none';
        document.querySelector('.board').style.filter = 'none';
        document.querySelector('.board').style.pointerEvents = 'auto';
      });
}