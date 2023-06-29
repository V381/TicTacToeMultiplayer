export function updateScore(scoreX, scoreO) {
  const scoreElement = document.querySelector('.score');
  scoreElement.textContent = `Score: X - ${scoreX} | O - ${scoreO}`;
}