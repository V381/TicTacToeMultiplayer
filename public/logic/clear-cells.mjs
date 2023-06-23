export function clearCells() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(val => {
        val.classList.remove("X");
        val.classList.remove("O");
        val.textContent = "";
    });
}