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

const sudokuContainer = document.getElementsByClassName("sudoku-table")[0];

// Start making grid for the Sudoku
makeSudokuTable(sudokuContainer);