import { addXandO } from "./game.mjs";
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
    if (playersJoined >= 2 && !gameStarted) {
      pageContent.classList.remove('blur-effect');
      gameStarted = true; // Set gameStarted flag to true
    }
  });

  socket.on('startGame', () => {
    console.log('Starting the game...');
    addXandO();
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
    // Handle disconnection logic here
  });

  socket.on('playersReset', () => {
    playersJoined = 0;
    gameStarted = false;
    pageContent.classList.add('blur-effect');
  });

  socket.on('playerLeft', (playerId, players) => {
    console.log(`Player ${playerId} left the game`);
    playersJoined = players.length;

    // Handle player leaving during game setup
    if (playersJoined < 3 && !gameStarted) {
      pageContent.innerHTML = 'Waiting for more players to start the game...';
      pageContent.classList.add('blur-effect');
      gameStarted = false; // Reset gameStarted flag
    }
  });

  

  // Listen for gameAlreadyStarted event
  socket.on('gameAlreadyStarted', () => {
    pageContent.innerHTML = 'Game is already being played. Please come back later.';
  });
}