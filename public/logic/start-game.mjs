import { addXandO } from "./add-x-o-.mjs";
const socket = io();

export function startGame() {
  const startGameButton = document.querySelector('.start-game');
  const board = document.querySelector('.board');
  const pageContent = document.querySelector('.page-content');
  let playersJoined = 0;
  let gameStarted = false;

  pageContent.classList.add('blur-effect');

  startGameButton.addEventListener('click', () => {
    startGameButton.style.display = 'none';
    board.style.filter = 'none';
    board.style.pointerEvents = 'auto';
    socket.emit('gameStarted'); // Emit gameStarted event
  });

  // Listen for playerJoined event
  socket.on('playerJoined', (players) => {
    console.log('Players:', players);
    playersJoined = players.length;

    if (playersJoined > 4) {
      // Display the message only to third or more users
      if (!gameStarted) {
        pageContent.innerHTML = 'Game is already being played. Please come back later.';
        pageContent.classList.remove('blur-effect');
      }
      return;
    }
    if (playersJoined === 3 && !gameStarted) {
      pageContent.classList.remove('blur-effect');
      gameStarted = true; // Set gameStarted flag to true
    }

  });

  socket.on('startGame', () => {
    console.log('Starting the game...');
    addXandO();
  });

  // Listen for gameAlreadyStarted event
  socket.on('gameAlreadyStarted', () => {
    pageContent.innerHTML = 'Game is already being played. Please come back later.';
    pageContent.classList.add('blur-effect');
  });
}