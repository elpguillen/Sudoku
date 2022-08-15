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

let has_cell_value = [
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0
];

let num_filled_cells = 0;
const sudokuContainer = document.getElementsByClassName("sudoku-table")[0];
// Start making grid for the Sudoku
makeSudokuTable(sudokuContainer);

addPuzzleValues();

/*
 *  Creates a 9x9 Sudoku grid
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

        for (c=0; c < 9; c++) {
            let row = document.getElementById("row[" + r + "]");

            // add cell
            let cell = document.createElement("td");
            row.appendChild(cell).id = "cell[" + ( (r*9) + c) + "]";

            // add input cells and attributes for each cell
            let cellElement = document.getElementById("cell[" + ( (r*9) + c) + "]");
            let textInput = document.createElement("input");
            textInput.className="input"
            textInput.id = "value[" + ( (r*9) + c) + "]";
            textInput.type = "text";
            textInput.pattern = "[0-9]";
            textInput.setAttribute("maxlength", "1");
            cellElement.appendChild(textInput).maxLength = "1";
        }
    }
}

function addPuzzleValues() {
    let puzzle_values = sudoku_puzzles_easy[0].split(", ");
    puzzle_values = puzzle_values.map(elem => elem.trim());

    let number_items = puzzle_values.length
    // add values from puzzle
    for (col = 0; col < number_items; col++) {
        let cell = document.getElementById("cell[" + col + "]");
        let cell_input = cell.firstChild;
        let cell_input_value = puzzle_values[col];

        // make sure there is a cell to add the value to
        if (cell_input == null) {
            return;
        }

        if (cell_input_value != 0) {
            cell_input.value = cell_input_value;
            cell_input.setAttribute("readonly", true);
            ++num_filled_cells;
            has_cell_value[col] = 1;
        } else {
            cell_input.value = "";
        }
    }
}