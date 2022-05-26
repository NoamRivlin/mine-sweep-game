'use strict'


const FLAG = '🚩'
const MINE = '💣'
var gBoard
var gStartTime
var gIntervalId
var isTimer = false

var gGame = {
    isOn: false,
    shownCount: 0, //how many cells are shown
    markedCount: 0,
    secsPassed: 0
}


//todo: modifying by a button of difficulty
var gLevels = {
    size: 4,
    mines: 2
}

function init() {
    gGame.isOn = true
    gBoard = buildBoard(gLevels.size)
    placeMines(gLevels);
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container')
    // console.table(gBoard)
    console.log(gBoard)
}


// Builds the board. sets the cell's keys and values

function buildBoard(SIZE) {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    return board;
}

//placing mines in random places on the board is determined by gLevels.size and how many is determined by the gLevels.mines value 
function placeMines(gLevels) {
    for (var i = 0; i < gLevels.mines; i++) {
        var randI = getRandomInt(0, gLevels.size)
        var randj = getRandomInt(0, gLevels.size)
        gBoard[randI][randj].isMine = true;
    }
}


// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    // console.log(board);
    // going over the board
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            // skipping mines
            if (board[i][j].isMine === true) continue
            // going over neighbors
            for (var ii = i - 1; ii <= i + 1; ii++) {
                for (var jj = j - 1; jj <= j + 1; jj++) {
                    // making sure it's not outside the border
                    if (ii < 0 ||
                        ii >= board.length ||
                        jj < 0 ||
                        jj >= board.length) continue;
                    // counting mines of neighbors
                    if (board[ii][jj].isMine) board[i][j].minesAroundCount++;
                }
            }
        }
    }
}


// Render the board as a <table> to the page
// renderBoard(board)
//data-i="${i}" data-j="${j}"  // not nessecary but maybe...
function renderBoard(board, selector) {
    var strHTML = '<table border="solid"><tbody>';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            // var className = 'cell' class="${className}" will i need to css all td/cells?

            //creating the display of the cells on DOM
            var cellChar = '';
            if (board[i][j].isShown)
                if (board[i][j].isMine) {
                    cellChar = MINE
                } else {
                    cellChar = board[i][j].minesAroundCount;

                }
            else if (board[i][j].isMarked) {
                cellChar = FLAG
            }
            strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"  >${cellChar}</td>`
        }

        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    let elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHTML;

}



// Called when a cell (td) is clicked 
function cellClicked(elcell, i, j) {
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return
    gBoard[i][j].isShown = true
    if (!gBoard[i][j].isMine) {
        gGame.shownCount++
    } else {
        GameOver()
    }
    if (gGame.shownCount === 1 && !isTimer) {
        startTimer()
        isTimer = true
    }
    elcell.style.backgroundColor = 'green' //why isnt working
    renderBoard(gBoard, '.board-container')
    checkGameOver()
}


// Called on right click to mark a cell (suspected to be a mine) Search the web (and implement) how to hide the context menu on right click. menu is diable👌
function cellMarked(elcell, i, j) {
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if (gBoard[i][j].isMarked) {
        gGame.markedCount++
        if (gGame.markedCount === 1 & !isTimer) {
            isTimer = true
            startTimer()
        }
    } if (!gBoard[i][j].isMarked) {
        //when removing a mark reduce the mark count
        gGame.markedCount--
    }
    renderBoard(gBoard, '.board-container')
    checkGameOver()
    console.log(gGame.markedCount);
}



// Game ends when all mines are marked, and all the other cells are shown
//works
function checkGameOver() {
    // console.log((gLevels.size ** 2) - gLevels.mines);
    // console.log(gGame.shownCount);
    // console.log(gLevels.mines);
    if (gGame.shownCount === ((gLevels.size ** 2) - gLevels.mines) && gGame.markedCount === gLevels.mines) {
        console.log('over');
        alert('👑')
    }
}

function GameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            gBoard[i][j].isShown = true
            clearInterval(gIntervalId)

        }
    }
}
// When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors. NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors
// function expandShown(board, elCell, i, j) {

// }

//not always outputing the right mines num
function chooseDifficulty(level) {
    gLevels.size = level
    if (level === 4) {
        gLevels.mines = 2
    } else if (level === 8) {
        gLevels.mines = 12

    } else if (level === 12) {
        gLevels.mines = 30
    }

    init()
    console.log(gLevels.mines);
    // buildBoard(gLevels.size)
    // renderBoard(gBoard, '.board-container')

    // renderBoard(gBoard, '.board-container')
    // console.log(gBoard);
    // startGame()
}

function startTimer() {
    gStartTime = Date.now()
    gIntervalId = setInterval(updateTime, 80)
}


function updateTime() {
    var now = Date.now()
    var diff = now - gStartTime
    var secondsPast = diff / 1000
    var elTimerSpan = document.querySelector('.timer span')
    elTimerSpan.innerText = secondsPast.toFixed(3)

}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}