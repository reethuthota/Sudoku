class Sudoku {
    constructor() {
        this.grid = Array.from({ length: 9 }, () => Array(9).fill(' '));
        this.solution = Array.from({ length: 9 }, () => Array(9).fill(' ')); // Add a property to store the solution
    }

    printSudoku() {
        const container = document.getElementById('sudoku-grid');
        container.innerHTML = ''; // Clear the grid

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('sudoku-cell');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.value = this.grid[i][j] === ' ' ? '' : this.grid[i][j];
                if (this.grid[i][j] !== ' ') {
                    input.disabled = true; // Disable the input if it's part of the initial puzzle
                }
                input.addEventListener('input', (e) => this.updateCell(i, j, e.target.value, input));
                cell.appendChild(input);
                container.appendChild(cell);
            }
        }
    }

    updateCell(row, col, value, inputElement) {
        if (/^[1-9]$/.test(value) || value === '') {
            this.grid[row][col] = value === '' ? ' ' : parseInt(value);

            // Check against the solution
            if (this.grid[row][col] !== ' ' && this.grid[row][col] !== this.solution[row][col]) {
                inputElement.style.color = 'red'; // Highlight incorrect entries in red
            } else {
                inputElement.style.color = 'black'; // Reset color if correct
            }
        }
    }

    rowCheck(val, index) {
        return this.grid[index].includes(val);
    }

    colCheck(val, index) {
        for (let i = 0; i < 9; i++) {
            if (this.grid[i][index] == val) {
                return true;
            }
        }
        return false;
    }

    subgrid(val, row, col) {
        for (let i = Math.floor(row / 3) * 3; i < (Math.floor(row / 3) * 3) + 3; i++) {
            for (let j = Math.floor(col / 3) * 3; j < (Math.floor(col / 3) * 3) + 3; j++) {
                if (this.grid[i][j] == val) {
                    return true;
                }
            }
        }
        return false;
    }

    generateSudoku(dif) {
        let num = "123456789";
        for (let i = 0; num.length > 0 && i < 9; i++) {
            let index = Math.floor(Math.random() * num.length);
            let val = num.substring(index, index + 1);
            this.grid[0][i] = val;
            num = num.replace(val, '');
        }

        this.solver();
        this.solution = this.grid.map(row => row.slice()); // Store the solved grid
        console.log("SOLUTION");
        console.log(this.solution);
        this.removeValues(dif);
    }

    removeValues(dif) {
        for (let i = 0; i < dif; i++) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            this.grid[row][col] = ' ';
        }
    }

    solver() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] == ' ') {
                    for (let val = 1; val < 10; val++) {
                        if (!(this.rowCheck(val, i) || this.colCheck(val, j) || this.subgrid(val, i, j))) {
                            this.grid[i][j] = val;
                            if (this.solver()) {
                                return true;
                            }
                            this.grid[i][j] = ' ';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
}

let sudoku; // Global variable to hold the Sudoku instance

function generateAndDisplaySudoku(difficulty) {
    sudoku = new Sudoku();
    sudoku.generateSudoku(difficulty);
    sudoku.printSudoku();
}

function solveAndDisplaySudoku() {
    if (sudoku) {
        sudoku.solver();
        sudoku.printSudoku();
    } else {
        console.log("No Sudoku puzzle to solve.");
    }
}
