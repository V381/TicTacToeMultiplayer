export function addXandO() {
    const cells = document.querySelectorAll('.cell');
    let currentPlayer = 'X';
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
        if (!cell.textContent) {
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
        });
    });
}