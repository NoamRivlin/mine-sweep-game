'use strict'

const HP = '💙'
const FLAG = '🚩'
const MINE = '💣'
const START_FACE = '🧐'
const LOSE_FACE = '🤯'
const WIN_FACE = '🐱‍🏍'

var gBoard
var gStartTime
var gIntervalId
var isTimer = false
var winSound = new Audio("sound/winSound.wav")
var lives = [HP, HP, HP]


var gGame = {
    isOn: false,
    shownCount: 0, //how many cells are shown
    markedCount: 0,
    secsPassed: 0 //not using this key
}


//todo: modifying by a button of difficulty
var gLevels = {
    size: 4,
    mines: 2
}

function init() {
    lives = [HP, HP, HP]
    gBoard = buildBoard(gLevels.size)
    placeMines(gLevels);
    setMinesNegsCount(gBoard)
    // console.table(gBoard)
    console.log(gBoard)
    clearInterval(gIntervalId)
    //downard section takes care of reseting the game right
    var elTimerSpan = document.querySelector('.timer span')
    elTimerSpan.innerText = ''
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    isTimer = false
    renderBoard(gBoard, '.board-container')
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
        var randJ = getRandomInt(0, gLevels.size)
        if (gBoard[randI][randJ].isMine) i--;
        gBoard[randI][randJ].isMine = true;
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
    var strHTML = `<table border="solid"><tbody>`;

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            // var className = 'cell' class="${className}" will i need to css all td/cells?

            var strClass = '';
            //creating the display of the cells on DOM
            var cellChar = '';
            if (board[i][j].isShown) {
                strClass += 'shown';
                if (board[i][j].isMine) {
                    cellChar = MINE;
                } else {
                    cellChar = board[i][j].minesAroundCount;

                }
            }
            else if (board[i][j].isMarked) {
                cellChar = FLAG;
            }

            // build class string

            strHTML += `<td class="${strClass}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"  >${cellChar}</td>`
        }

        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    var elBoard = document.querySelector(selector);
    elBoard.innerHTML = strHTML;
    var elTries = document.querySelector('.tries')
    elTries.innerText = lives


    var elSmiley = document.querySelector('.smiley')
    // if (gGame.shownCount === ((gLevels.size ** 2) - gLevels.mines) && gGame.markedCount === gLevels.mines) {
    //     elSmiley.innerText = WIN_FACE
    // }
    if (lives.length >= 1) {
        elSmiley.innerText = START_FACE
    } else if (lives.length === 0) {
        elSmiley.innerText = LOSE_FACE
    }
    //  else if (condition) {

    // }

}



// Called when a cell (td) is clicked 
function cellClicked(elcell, i, j) {
    //if the cell is shown or is marked do nothin
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return
    openCell(i, j)

    if (gGame.shownCount === 1 && !isTimer) {
        startTimer()
        isTimer = true
    }
    //opening negs cells if only it isnt a mine cell
    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
        openNegsCell(i, j)
    }
    renderBoard(gBoard, '.board-container')

}

function openNegsCell(i, j) {
    for (var ii = i - 1; ii <= i + 1; ii++) {
        for (var jj = j - 1; jj <= j + 1; jj++) {
            if (ii < 0 ||
                ii >= gBoard.length ||
                jj < 0 ||
                jj >= gBoard.length) continue
            openCell(ii, jj)
        }
    }
}

function openCell(i, j) {
    // console.log(i, j);
    if (!gGame.isOn) return
    if (!gBoard[i][j].isMine) {
        if (!gBoard[i][j].isShown) {
            gBoard[i][j].isShown = true
            gGame.shownCount++
            checkGameOver()
        }
    } else {
        lives.pop()
        checkGameOver()
        renderBoard(gBoard, '.board-container')
        // GameOver()
    }
}


function cellMarked(elcell, i, j) {
    if (gBoard[i][j].isShown || !gGame.isOn) return
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
        winSound.play();
        // var elSmiley = document.querySelector('.smiley')
        // elSmiley.innerText = WIN_FACE
        GameOver()
    } else if (lives.length === 0) {
        GameOver()
    }
}

// && lives.length === 0
function GameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                gGame.isOn = false
                clearInterval(gIntervalId)
                renderBoard(gBoard, '.board-container')
            }

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