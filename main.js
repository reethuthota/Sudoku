class Sudoku {
    constructor() {
        this.grid = Array.from({ length: 9 }, () => Array(9).fill(' '));
        this.solution = Array.from({ length: 9 }, () => Array(9).fill(' '));
        this.mistakes = 0;
        this.difficulty = 0;
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
                input.addEventListener('keypress', (e) => this.validateInput(e));
                input.addEventListener('input', (e) => this.updateCell(i, j, e.target.value, input));
                cell.appendChild(input);
                container.appendChild(cell);
            }
        }

        // Make the mistake count element visible
        document.getElementById('mistake-count').style.display = 'block';
        this.updateMistakeCount();
    }

    validateInput(event) {
        const key = event.key;
        if (!/^[1-9]$/.test(key)) {
            event.preventDefault();
        }
    }

    updateCell(row, col, value, inputElement) {
        const currentValue = this.grid[row][col];
        if (/^[1-9]$/.test(value) || value === '') {
            this.grid[row][col] = value === '' ? ' ' : parseInt(value);

            // Check against the solution
            if (this.grid[row][col] !== ' ' && this.grid[row][col] !== this.solution[row][col]) {
                inputElement.style.color = 'red'; // Highlight incorrect entries in red
                this.mistakes++;
                this.updateMistakeCount();
                // Check if game over
                if (this.mistakes >= 3) {
                    this.showGameOver();
                }
            } else {
                inputElement.style.color = 'black'; // Reset color if correct
                this.checkIfSolved(); // Check if the puzzle is solved correctly
            }

            // Reset text color to black when user removes number from a blank cell
            if (currentValue !== ' ' && this.grid[row][col] === ' ') {
                inputElement.style.color = 'black';
            }
        } else {
            inputElement.value = currentValue === ' ' ? '' : currentValue;
        }
    }

    updateMistakeCount() {
        const mistakeCountElement = document.getElementById('mistake-count');
        mistakeCountElement.textContent = `Mistakes: ${this.mistakes}`;
    }

    showGameOver() {
        const modal = document.getElementById('game-over-modal');
        modal.style.display = 'flex';
        this.calculateScore(false);
    }

    showCongrats() {
        const modal = document.getElementById('congrats-modal');
        modal.style.display = 'flex';
        this.calculateScore(true);
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
        this.difficulty = dif;
        let num = "123456789";
        for (let i = 0; num.length > 0 && i < 9; i++) {
            let index = Math.floor(Math.random() * num.length);
            let val = num.substring(index, index + 1);
            this.grid[0][i] = parseInt(val);
            num = num.replace(val, '');
        }

        this.solver();
        this.solution = this.grid.map(row => row.slice()); // Store the solved grid
        console.log("SOLUTION");
        console.log(this.solution);
        this.removeValues(dif);
        console.log("GRID");
        console.log(this.grid);
    }

    removeValues(dif) {
        let counter = 0;
        while (counter < dif) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            
            // Check if the cell is not blank before setting it to blank
            if (this.grid[row][col] !== ' ') {
                this.grid[row][col] = ' ';
                counter += 1;
            }
            console.log(counter);
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

    checkIfSolved() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j] === ' ' || this.grid[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        this.showCongrats();
        return true;
    }

    calculateScore(isSolved) {
        let score = 0;
        if (isSolved) {
            score = 100;
            console.log("Congratulations! You've completed the puzzle. Score: " + score);
        } else {
            const totalBlanks = this.difficulty;
            console.log("Total blanks: " + totalBlanks)
            const filledCorrectly = ((this.grid.flat().filter((cell, index) => cell !== ' ' && cell === this.solution[Math.floor(index / 9)][index % 9]).length) - (81 - totalBlanks));
            console.log("filledCorrectly: " + filledCorrectly)
            score = (100 / totalBlanks) * filledCorrectly;
            console.log("Game interrupted. Score: " + score);
        }
    }
}

let sudoku;

function startGame() {
    document.getElementById('title-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'block';
    generateAndDisplaySudoku(40);
}

function generateAndDisplaySudoku(difficulty) {
    sudoku = new Sudoku();
    sudoku.generateSudoku(difficulty);
    sudoku.printSudoku();
}

function quitGame() {
    if (sudoku) {
        sudoku.calculateScore(false);
        sudoku.printSudoku();
    } else {
        console.log("No Sudoku puzzle to solve.");
    }
}

function restartGame() {
    const modal = document.getElementById('game-over-modal');
    modal.style.display = 'none';
    generateAndDisplaySudoku(40);
}

function nextLevel() {
    const modal = document.getElementById('congrats-modal');
    modal.style.display = 'none';
    generateAndDisplaySudoku(30); // Increase the difficulty by reducing the number of clues
}
