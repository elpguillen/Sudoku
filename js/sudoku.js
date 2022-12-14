class Difficulty {
    static Easy = 0;
    static Medium = 1;
    static Hard = 2;

    constructor(difficultyMode) {
        this.difficultyMode = difficultyMode;
    }
}

const sudoku_puzzles_easy = [
    `
    6, 9, 0,   0, 0, 0,   0, 8, 7,   
    0, 0, 0,   0, 0, 4,   0, 9, 0,   
    5, 0, 3,   0, 7, 0,   0, 0, 1,   
    
    2, 8, 5,   9, 6, 0,   1, 7, 0,  
    9, 1, 0,   7, 4, 5,   3, 2, 0,   
    0, 0, 0,   0, 0, 8,   6, 5, 0,   
    
    8, 0, 9,   4, 0, 1,   0, 0, 0,   
    0, 3, 0,   0, 0, 0,   0, 0, 5,   
    0, 0, 0,   3, 9, 0,   0, 1, 0 
    `
];

const sudoku_puzzles_medium = [
    `
    0, 0, 0,   5, 0, 9,   0, 1, 0,   
    6, 1, 0,   0, 0, 0,   0, 9, 7,   
    9, 0, 2,   1, 6, 0,   0, 0, 0,   
    
    0, 0, 0,   0, 8, 0,   0, 0, 0,  
    0, 0, 0,   0, 5, 0,   3, 0, 8,   
    8, 5, 3,   7, 1, 6,   0, 0, 0,   
    
    0, 4, 8,   0, 9, 1,   0, 3, 0,   
    2, 0, 0,   0, 0, 0,   0, 8, 0,   
    1, 0, 7,   8, 0, 0,   0, 0, 5 
    `
];

const sudoku_puzzles_hard = [
    `
    5, 0, 0,   4, 0, 0,   0, 9, 0,   
    0, 4, 0,   9, 1, 0,   8, 6, 7,   
    0, 0, 0,   6, 0, 0,   0, 0, 4,   
    
    0, 1, 9,   0, 0, 0,   0, 5, 0,  
    0, 0, 0,   5, 0, 8,   6, 0, 0,   
    6, 0, 5,   0, 0, 2,   0, 0, 0,   
    
    0, 2, 0,   0, 0, 0,   4, 0, 5,   
    0, 0, 0,   0, 0, 0,   0, 7, 0,   
    0, 0, 3,   2, 5, 6,   0, 0, 0 
    `
];

const numberPuzzleRows = 9;
const numberPuzzleCols = 9;
const total_number_cells = numberPuzzleRows * numberPuzzleCols;
const sudokuContainer = document.getElementsByClassName("sudoku-table")[0];

let num_filled_cells = 0;
let numBadInputs = 0;
let cellsWithBadInput = Array(total_number_cells).fill(false);
let has_cell_value = Array(total_number_cells).fill(0);

// Start making grid for the Sudoku
makeSudokuTable(sudokuContainer);

// on refresh page, start with an 'Easy' Sudoku puzzle 
let puzzle_values = sudoku_puzzles_easy[0].split(", ");
puzzle_values = puzzle_values.map(elem => elem.trim())
addPuzzleValues(puzzle_values);

// add listeners for player input and difficulty selection
addCellInputEventListeners();
addDifficultyTabListener();

/*-------------------------------- functions --------------------------------*/

/**
 * Creates a 9x9 Sudoku grid
 * @param {element} element HTML element that will hold the Sudoku grid
 */
function makeSudokuTable(element) {
    // create table
    let tableElement = document.createElement("table");
    element.appendChild(tableElement).id = "sudoku";

    // get table element to add cells
    let sudokuTable = document.getElementById("sudoku");

    // add cells to table
    for (r = 0; r < 9; r++) {
        let cellRow = document.createElement("tr");
        sudokuTable.appendChild(cellRow).id = "row[" + r + "]";

        for (c = 0; c < 9; c++) {
            let row = document.getElementById("row[" + r + "]");

            // add cell
            let cell = document.createElement("td");
            row.appendChild(cell).id = "cell[" + ((r * 9) + c) + "]";

            // add input cells and attributes for each cell
            let cellElement = document.getElementById("cell[" + ((r * 9) + c) + "]");
            let textInput = document.createElement("input");
            textInput.className = "input"
            textInput.id = "value[" + ((r * 9) + c) + "]";
            textInput.type = "text";
            textInput.pattern = "[0-9]";
            textInput.setAttribute("maxlength", "1");
            cellElement.appendChild(textInput).maxLength = "1";
        }
    }
}

/**
 * Add the initial values for the Sudoku Grid
 * @param {*} puzzle array of values to add to puzzle         
 */
function addPuzzleValues(puzzle) {

    let number_items = puzzle.length
    // add values from puzzle
    for (col = 0; col < number_items; col++) {
        let cell = document.getElementById("cell[" + col + "]");
        let cell_input = cell.firstChild;
        let cell_input_value = puzzle[col];

        // make sure there is a cell to add the value to
        if (cell_input === null) {
            return;
        }

        if (cell_input_value != 0) {
            cell_input.value = cell_input_value;
            cell_input.setAttribute("readonly", true);
            cell_input.style.fontWeight = 'bold';
            ++num_filled_cells;
            has_cell_value[col] = 1;
        } else {
            cell_input.value = "";
        }
    }
}

/**
 * Checks that the value inserted in the row is unique.
 * @param   {Number} numberCols     Total number of columns
 * @param   {Number} currentRow     The row value was inserted
 * @param   {Number} currentCol     The column value was inserted
 * @param   {Number} numberInserted Value that was inserted
 * @returns {Boolean}               True if value unique, False otherwise
 */
function passRowConstraint(numberCols, currentRow, currentCol, numberInserted) {

    if ((typeCheck(numberCols) !== 'number') ||
        (typeCheck(currentRow) !== 'number') ||
        (typeCheck(currentCol) !== 'number') ||
        (typeCheck(numberInserted) !== 'number')) {
        return false;
    }

    if (numberCols < 1 || currentRow < 1 || currentCol < 1 ||
        numberInserted < 1 || numberInserted > 9) {
        return false;
    }

    let firstCellIndex = (currentRow - 1) * 9;
    let lastIndex = firstCellIndex + numberCols;

    for (cellIndex = firstCellIndex; cellIndex < lastIndex; cellIndex++) {
        // skip cell where player added value
        if (((cellIndex % 9) + 1) === currentCol) {
            continue;
        }
        
        let cell = document.getElementById("cell[" + cellIndex + "]").firstChild;

        // check if value added is present in current row
        if (parseInt(cell.value, 10) === numberInserted) {
            return false;
        }
    }

    return true;
}

/**
 * Checks that the value inserted in the column is unique.
 * @param   {Number} numberRows     Total number of rows
 * @param   {Number} currentRow     The row value was inserted
 * @param   {Number} currentCol     The column value was inserted
 * @param   {Number} numberInserted Value that was inserted
 * @returns {Boolean}               True if value unique, False otherwise
 */
function passColConstraint(numberRows, currentRow, currentCol, numberInserted) {

    if ((typeCheck(numberRows) !== 'number') ||
        (typeCheck(currentRow) !== 'number') ||
        (typeCheck(currentCol) !== 'number') ||
        (typeCheck(numberInserted) !== 'number')) {
        return false;
    }

    if (numberRows < 1 || currentCol < 1 || currentRow < 1 ||
        numberInserted < 1 || numberInserted > 9) {
        return false;
    }

    let firstCellIndex = (currentCol - 1);
    let lastIndex = (numberRows * 8) + firstCellIndex + 1;

    for (cellIndex = firstCellIndex; cellIndex < lastIndex;) {
        let ind = Math.floor(cellIndex / 9) + 1;

        // skip cell where player added value
        if ((Math.floor(cellIndex / 9) + 1) === currentRow) {
            // continue was causing an infinite loop, might want to take
            // a look at this
            //continue;
        } else {
            let cell = document.getElementById("cell[" + cellIndex + "]").firstChild;
            
            // check if value added is present in current column
            if (parseInt(cell.value, 10) === numberInserted) {
                return false;
            }
        }
        cellIndex = cellIndex + 9;
    }

    return true;
}

/**
 * Checks that the value inserted in Sudoku sub-grid is unique.
 * @param   {Number} numberRows     Total number of rows
 * @param   {Number} numberCols     Total number of columns
 * @param   {Number} currentRow     The row that value was inserted
 * @param   {Number} currentCol     The column that value was inserted
 * @param   {Number} numberInserted Value that was inserted
 * @returns {Boolean}               True if value unique, False otherwise
 */
function passGridConstraint(numberRows, numberCols, currentRow, currentCol, numberInserted) {
    if ((typeCheck(numberRows) !== 'number') || (typeCheck(numberCols) !== 'number') ||
        (typeCheck(currentRow) !== 'number') || (typeCheck(currentCol) !== 'number') ||
        (typeCheck(numberInserted) !== 'number')) {
        return false;
    }

    if (numberRows !== 9 || numberCols !== 9 ||
        currentRow < 1 || currentRow > 9 ||
        currentCol < 1 || currentCol > 9 ||
        numberInserted < 1 || numberInserted > 9) {
        return false;
    }

    let gridLength = Math.sqrt(numberRows);
    let rowStart = --currentRow - (currentRow % gridLength);
    let rowEnd = rowStart + gridLength;
    let colStart = --currentCol - (currentCol % gridLength);
    let colEnd = colStart + gridLength;

    for (row = rowStart; row < rowEnd; row++) {
        for (col = colStart; col < colEnd; col++) {
            // skip cell where player added value
            if ((row === currentRow) && (col === currentCol))
                continue;

            let cellIndex = (row * 9) + col;
            let cell = document.getElementById("cell[" + cellIndex + "]").firstChild;
            // check if value added is present in current grid
            if (parseInt(cell.value, 10) === numberInserted) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Checks that the value inserted follows the row, column, and sub-grid
 * constraints of a valid Sudoku puzzle
 * @param {number} numberRows  Total number of rows 
 * @param {number} numberCols  Total number of columns
 * @param {number} rowIndex    Row value was inserted
 * @param {number} colIndex    Column value was inserted
 * @param {number} cellValue   Value that was inserted
 * @returns                    True if value unique, False otherwise
 */
function passSudokuConstraints(numberRows, numberCols, rowIndex, colIndex, cellValue) {
    if ((typeCheck(numberRows) !== 'number') || (typeCheck(numberCols) !== 'number') ||
        (typeCheck(rowIndex) !== 'number') || (typeCheck(colIndex) !== 'number') ||
        (typeCheck(cellValue) !== 'number')) {
        return false;
    }

    if (numberRows !== 9 || numberCols !== 9 ||
        rowIndex < 1 || rowIndex > 9 ||
        colIndex < 1 || colIndex > 9 ||
        cellValue < 1 || cellValue > 9) {
        return false;
    }

    return passRowConstraint(numberCols, rowIndex, colIndex, cellValue) &&
        passColConstraint(numberRows, rowIndex, colIndex, cellValue) &&
        passGridConstraint(numberRows, numberCols, rowIndex, colIndex, cellValue);
}

/**
 * Add Event Listener for each Sudoku cell.
 */
function addCellInputEventListeners() {
    // get all cell input elements
    const inputTags = document.querySelectorAll('input');
    const numInputTags = inputTags.length;

    // add event listener to each cell input element
    for (let i = 0; i < numInputTags; i++) {
        inputTags[i].addEventListener('input', e => {

            let cell = document.getElementById("cell[" + i + "]").firstChild;
            let cellValue = parseInt(cell.value);
            let row = Math.floor(i / 9) + 1;
            let column = (i % 9) + 1;

            // get status text to update on input change
            let status = document.getElementsByClassName('sudoku-status')[0];

            // update array that keeps track if cell has a value
            if (has_cell_value[i] === 0) {
                has_cell_value[i] = 1;
                ++num_filled_cells;
            } else {
                has_cell_value[i] = 0;
                --num_filled_cells;
            }
            // update cell format and status text based on correct/incorrect input
            if (!passSudokuConstraints(9, 9, row, column, cellValue)) {
                updateInputCell(i, false);
                status.textContent = `Status: Error at row: ${row}, column:${column}`;
            } else {
                updateInputCell(i, true);

                if (numBadInputs === 0) {
                    status.textContent = "Status: Okay";
                }
            }

            if (num_filled_cells === 81 && numBadInputs === 0) {
                status.textContent = "Solved!";
            }
        });
    }
}

/**
 * Updates cells whenever there is a change from a bad to good state and good 
 * to bad state. Keeps track of bad inputs. Bad inputs have there background color
 * changed to red and good inputs changed to white.
 *  
 * @param {Number} cellPosition Position of cell to update
 * @param {Number} statusGood   True if valid input, otherwise False
 * @returns 
 */
function updateInputCell(cellPosition, statusGood) {
    if ((typeCheck(cellPosition) !== 'number') || (typeCheck(statusGood) !== 'boolean')) {
        return;
    }

    let cell = document.getElementById("cell[" + cellPosition + "]").firstChild;

    if (statusGood) {
        if (cellsWithBadInput[cellPosition] === true) {
            cellsWithBadInput[cellPosition] = false;
            --numBadInputs;
            cell.style.backgroundColor = 'white';
        }
    } else {
        cellsWithBadInput[cellPosition] = true;
        ++numBadInputs;
        cell.style.backgroundColor = '#ff2400';
    }
}

/**
 * Clears the grid of any values and cell formatting. Also, resets
 * anything that keeps tracks of any sort of input.
 */
function clearGrid() {
    for (let cellIndex = 0; cellIndex < total_number_cells; cellIndex++) {
        let cell_input = document.getElementById("value[" + cellIndex + "]");
        cell_input.removeAttribute("readonly");
        cell_input.value = '';
        cell_input.style.fontWeight = 'normal';
        cell_input.style.backgroundColor = 'white';

        has_cell_value[cellIndex] = 0;
        cellsWithBadInput[cellIndex] = false;
    }

    let status = document.getElementsByClassName('sudoku-status')[0];
    status.textContent = "Status: Okay";

    numBadInputs = 0;
    num_filled_cells = 0;
}

/**
 * Click Listener for the Erase button.
 */
function eraseClickListener() {
    let eraseButton = document.getElementsByClassName("erase")[0];

    eraseButton.addEventListener("click", function () {
        clearGrid();
    });
}

/**
 * Adds Click Listeners for difficulty tabs
 */
function addDifficultyTabListener() {
    const tabs = document.querySelectorAll(".difficulty-container a");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function () {
            // remove 'active' class from all tabs
            tabs.forEach((tab) => tab.classList.remove("active"));

            // add 'active' class to current tab
            tab.classList.add("active");

            // after clearing grid, select puzzle and add values
            clearGrid();
            selectPuzzle(index);
        })
    })
}

/**
 * Selects puzzle based on difficulty selected and adds the values
 * to the grid.
 * @param {Number} difficulty 
 */
function selectPuzzle(difficulty) {

    if ( (typeCheck(difficulty) !== 'number')) {
        return;
    }

    let selectedPuzzle = [];

    switch (difficulty) {
        case Difficulty.Medium:
            selectedPuzzle = sudoku_puzzles_medium[0].split(", ")
            break;
        case Difficulty.Hard:
            selectedPuzzle = sudoku_puzzles_hard[0].split(", ")
            break;
        default:
            selectedPuzzle = sudoku_puzzles_easy[0].split(", ")
            break;
    }

    selectedPuzzle = selectedPuzzle.map(elem => elem.trim());
    addPuzzleValues(selectedPuzzle);
}

/*function rowColToIndex(rowIndex, colIndex) {

    if ( (typeCheck(rowIndex) !== 'number') || (typeCheck(colIndex) !== 'number') ||
            rowIndex < 1 || colIndex < 1 || rowIndex > 9 || colIndex > 9) {
        return -1;
    }

    return ((rowIndex - 1) * 9) + (colIndex - 1);
}*/

// https://www.freecodecamp.org/news/javascript-typeof-how-to-check-the-type-of-a-variable-or-object-in-js/
function typeCheck(value) {
    const return_value = Object.prototype.toString.call(value);
    const type = return_value.substring(
        return_value.indexOf(" ") + 1,
        return_value.indexOf("]"));

    return type.toLowerCase();
}