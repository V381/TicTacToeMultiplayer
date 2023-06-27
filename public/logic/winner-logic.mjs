export function checkWin(player, cells) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];    
    return winningCombinations.some(combination => {
        return combination.every(index => cells[index].classList.contains(player));
    });
}

export function checkDraw(cells) {
  const isDraw = Array.from(cells).every(cell => cell.textContent !== '');
  return isDraw;
}