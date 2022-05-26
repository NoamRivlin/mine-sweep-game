'use strict'


//this includes a function dont use as is
function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            // var className = 'cell' class="${className}"
            strHTML += `<td data-i="${i}" data-j="${j}" onclick="cellClicked(this,${i} ,${j})" oncontextmenu="cellMarked(this) >${i} ,${j}</td>`
        }

        strHTML += '</tr>'
    }


    var elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML
    console.log(elBoard);

    console.log(board.length);
}




// function buildBoard(SIZE, variable) {
//     var board = [];
//     for (var i = 0; i < SIZE; i++) {
//         board.push([]);
//         for (var j = 0; j < SIZE; j++) {
//             var cell = variable
//             cell.location.i = i
//             cell.location.j = j
//             board[i][j] = cell;
//         }
//     }
//     return board;
// }

function buildBoard(SIZE) {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
        }
    }
    return board;
}

function getMoveDiff() {
    var randNum = getRandomInt(1, 5);
    if (randNum < 2) {
        return { i: 0, j: 1 }
    } else if (randNum < 3) {
        return { i: -1, j: 0 }
    } else if (randNum < 4) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function printMat(mat, selector) {
    // var strHTML = '<table border="0"><tbody>';
    var strHTML = ''
    strHTML += '<tr>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}
// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


function restart() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    initGame()
}

function getEmptyCell() {
    var emptyCells = []
    for (var i = 1; i < gBoard.length - 1; i++) {
        for (var j = 1; j < gBoard[0].length - 1; j++) {
            if (!gBoard[i][j].gameElement) emptyCells.push({ i, j })
        }

    }
    if (!emptyCells.length) displayModal(false)
    return emptyCells.splice(getRandomInt(0, emptyCells.length), 1)[0]
}

//use for counting bombs around clicked cell revise this
function countNeighbors(mat, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j]) {
                count++
            }
        }
    }
    return count
}



// left cliked reveal\right click mark-flag - needs revise
// function handleKey(event) {
//     var i = gGamerPos.i;   // needs to change into cellClickedPos
//     var j = gGamerPos.j; // needs to change into cellClickedPos
//     switch (event.key) {
//         case 'left':
//             moveTo(i, j - 1);
//             break;
//         case 'ArrowRight':
//             moveTo(i, j + 1);
//             break;
//         case 'ArrowUp':
//             moveTo(i - 1, j);
//             break;
//         case 'ArrowDown':
//             moveTo(i + 1, j);
//             break;
//     }
// }

//min- in, max-in
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min + 1
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function cellClicked(e, i, j) {

}

//right click listner
// element.addEventListener("contextmenu", function()

//left click listner
// element.addEventListener("click",
//     function (evt) )
