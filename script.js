/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */

const GameBoard = (() => {
  let grid = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const winRowCondition = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  const winColCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const winDiagCondition = [
    [0, 4, 8],
    [2, 4, 6],
  ];

  let freeSpaces = 9;
  const gameBoard = document.querySelector("#board");
  const getGrid = () => grid;
  const getBoard = () => gameBoard;

  const isEmpty = () => {
    if (freeSpaces === 0) {
      nullifySquares();
      return true;
    }
    return false;
  };

  const reset = () => {
    grid = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    freeSpaces = 9;
  };

  const nullifySquares = () => {
    const boardGrid = document.querySelectorAll(".row-cell");
    boardGrid.forEach((cell) => {
      cell.classList.add("cell-dull");
    });
  };

  const highlight = (pos) => {
    const boardGrid = document.querySelectorAll(".row-cell");
    for (let i = 0; i < pos.length; i++) {
      boardGrid[pos[i]].classList.remove("cell-dull");
      boardGrid[pos[i]].classList.add("cell-win");
    }
  };

  const highlightWinRow = (mark) => {
    const boardGrid = document.querySelectorAll(".row-cell");
    winRowCondition.forEach((row) => {
      const gridRow = [
        boardGrid[row[0]].textContent,
        boardGrid[row[1]].textContent,
        boardGrid[row[2]].textContent,
      ];
      if (checkRow(gridRow, mark)) {
        highlight(row);
      }
    });

    winColCondition.forEach((col) => {
      const gridCol = [
        boardGrid[col[0]].textContent,
        boardGrid[col[1]].textContent,
        boardGrid[col[2]].textContent,
      ];
      if (checkRow(gridCol, mark)) {
        highlight(col);
      }
    });

    winDiagCondition.forEach((diag) => {
      const gridDiag = [
        boardGrid[diag[0]].textContent,
        boardGrid[diag[1]].textContent,
        boardGrid[diag[2]].textContent,
      ];
      if (checkRow(gridDiag, mark)) {
        highlight(diag);
      }
    });
  };

  const checkRow = (row, mark) =>
    row[0] === mark && row[1] === mark && row[2] === mark;

  const checkCol = (col, mark) =>
    col[0] === mark && col[1] === mark && col[2] === mark;

  const checkDiag = (diag, mark) =>
    diag[0] === mark && diag[1] === mark && diag[2] === mark;

  const checkWin = (mark) => {
    for (let col = 0, row = 0; row < grid.length; row++) {
      const currRow = [grid[col][row], grid[col + 1][row], grid[col + 2][row]];
      const currCol = [grid[row][col], grid[row][col + 1], grid[row][col + 2]];
      const currLeftDiag = [grid[0][0], grid[1][1], grid[2][2]];
      const currRightDiag = [grid[0][2], grid[1][1], grid[2][0]];

      if (
        checkRow(currRow, mark) ||
        checkCol(currCol, mark) ||
        checkDiag(currLeftDiag, mark) ||
        checkDiag(currRightDiag, mark)
      ) {
        nullifySquares();
        highlightWinRow(mark);
        return true;
      }
    }

    return false;
  };

  const update = (mark, x, y) => {
    if (grid[x][y] === "") grid[x][y] = mark;

    freeSpaces -= 1;
    checkWin(mark);
  };

  return {
    update,
    reset,
    getGrid,
    getBoard,
    isEmpty,
    checkWin,
    nullifySquares,
    highlightWinRow,
  };
})();

const Player = (m) => {
  const mark = m;

  const placeMarker = (posX, posY) => {
    GameBoard.update(mark, posX, posY);
    GameController.update();
  };

  const move = () => {
    const genRandNum = () => Math.floor(Math.random() * 3);

    let x = genRandNum();
    let y = genRandNum();
    while (GameBoard.getGrid()[x][y] !== "") {
      x = genRandNum();
      y = genRandNum();
    }

    setTimeout(() => {
      placeMarker(x, y);
    }, 200);
  };

  const hasWon = () => GameBoard.checkWin(mark);

  return { placeMarker, move, hasWon };
};

const GameController = (() => {
  const player = Player("X");
  const cpu = Player("O");
  const board = GameBoard.getBoard();
  const gameText = document.querySelector("h2");
  let isGameOver = false;
  const resetBtn = document.querySelector("button");

  resetBtn.addEventListener("click", () => {
    isGameOver = false;
    gameText.style.visibility = "hidden";
    clear();
    GameBoard.reset();
    update();
  });

  const gameOver = () => {
    const rowCells = document.querySelectorAll(".row-cell");
    rowCells.forEach((cell) => {
      cell.classList.remove("hover");
    });
    isGameOver = !isGameOver;
  };

  const clickSquare = (i, j) => {
    if (isGameOver) return;

    if (GameBoard.getGrid()[i][j] === "") {
      player.placeMarker(i, j);
      if (!GameBoard.isEmpty() && !player.hasWon()) cpu.move();

      setTimeout(() => {
        if (GameBoard.isEmpty()) {
          gameText.style.visibility = "visible";
          gameText.textContent = "Too bad, it's a tie!";
          gameOver();
        }
        if (player.hasWon()) {
          gameText.style.visibility = "visible";
          gameText.textContent = "Congrats, you won!";
          gameOver();
        }
        if (cpu.hasWon()) {
          gameText.style.visibility = "visible";
          gameText.textContent = "Boohoo, you lost!";
          gameOver();
        }
      }, 300);
    }
  };

  const clear = () => {
    const rows = board.querySelectorAll(".row");
    rows.forEach((row) => board.removeChild(row));
  };

  const update = () => {
    clear();

    for (let i = 0; i < 3; i++) {
      const row = document.createElement("div");
      row.classList = "row";
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.classList.add("row-cell");
        cell.classList.add("hover");
        cell.addEventListener("click", clickSquare.bind(cell, i, j));

        cell.textContent = GameBoard.getGrid()[i][j];
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  };

  update();

  return {
    update,
  };
})();
