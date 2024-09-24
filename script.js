// ------------create board items------------------------
const playerStep = document.querySelector("#player");
const gameBoard = document.querySelector(".board-container");
let count = 0;
let size = 3;
let matrix = Array(size);
let step = 1;

const createBoardItems = (size) => {
  playerStep.textContent = "Player X";
  count = 0;
  step = 1;
  matrix = Array(size);
  gameBoard.innerHTML = "";
  gameBoard.classList.remove("frozen");
  document.querySelector(".board-size").textContent = `${size}x${size}`;

  for (let i = 0; i < matrix.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      matrix[i].push("");
      let elem = document.createElement("div");
      elem.classList.add("board-item");
      elem.dataset.item = `${i},${j}`;
      gameBoard.append(elem);
    }
  }

  gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr`;
  gameBoard.style.gridTemplateRows = `repeat(${size},  1fr`;
};

createBoardItems(size);

// ---------- get and set  new size--------------
const changeSizeBtn = document.querySelector("#change-size");
const playBtn = document.querySelector("#size-form");
const modal = document.querySelector(".modal_container");
const modalWinner = document.querySelector(".modal-winner");

changeSizeBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

playBtn.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputSize = document.querySelector("#input-size").value || size;
  size = inputSize;

  const output = document.querySelector("#validation-output");
  output.textContent = `Selected size: ${inputSize} x ${inputSize}`;
  createBoardItems(+inputSize);
  setTimeout(() => modal.classList.remove("show"), 1000);
  modalWinner.classList.remove("show");
  winSound.load();
});

// ------------ check game ------------------

const highlightWinningLine = (winningCells) => {
  winningCells.forEach(([i, j]) => {
    const winningElement = document.querySelector(
      `.board-item[data-item='${i},${j}']`
    );
    if (winningElement) {
      winningElement.classList.add("winning-line");
    }
  });
};

const showWinner = (player) => {
  modalWinner.classList.add("show");
  gameBoard.classList.add("frozen");
  winSound.play();
  modal.classList.add("show");
  if (player) {
    modalWinner.textContent = `Player ${player === 1 ? "X" : "O"} wins!`;
  } else {
    modalWinner.textContent = "Draw score, both won!";
  }
};

const checkWinner = (player) => {
  let winningCells = [];
  let win = true;

  for (let i = 0; i < matrix.length; i++) {
    win = true;
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== player) {
        win = false;
        break;
      }
    }
    if (win) {
      winningCells = Array.from({length: size}, (_, j) => [i, j]);
      highlightWinningLine(winningCells);
      showWinner(player);
      return true;
    }
  }

  for (let j = 0; j < matrix.length; j++) {
    win = true;
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i][j] !== player) {
        win = false;
        break;
      }
    }
    if (win) {
      winningCells = Array.from({length: size}, (_, i) => [i, j]);
      highlightWinningLine(winningCells);
      showWinner(player);
      return true;
    }
  }

  win = true;
  for (let i = 0; i < size; i++) {
    if (matrix[i][i] !== player) {
      win = false;
      break;
    }
  }
  if (win) {
    winningCells = Array.from({length: size}, (_, i) => [i, i]);
    highlightWinningLine(winningCells);
    showWinner(player);
    return true;
  }

  win = true;
  for (let i = 0; i < size; i++) {
    if (matrix[i][size - 1 - i] !== player) {
      win = false;
      break;
    }
  }
  if (win) {
    winningCells = Array.from({length: size}, (_, i) => [i, size - 1 - i]);
    highlightWinningLine(winningCells);
    showWinner(player);
    return true;
  }

  if (count === size * size) {
    showWinner();
    return;
  }
};

// ------------ start game ------------------
const crossSound = document.querySelector("#cross-sound");
const oSound = document.querySelector("#o-sound");
const warningSound = document.querySelector("#warning-sound");
const winSound = document.querySelector("#win-sound");

gameBoard.addEventListener("click", (e) => {
  const [i, j] = e.target.dataset.item.split(",");
  if (matrix[i][j] === "") {
    count++;
    if (step === 1) {
      crossSound.play();
      e.target.classList.add("cross", "no-hover");
      matrix[i][j] = step;
      checkWinner(step);
      step++;
    } else {
      oSound.play();
      e.target.classList.add("o", "no-hover");
      matrix[i][j] = step;
      checkWinner(step);
      step--;
    }
    playerStep.textContent = `Player ${step === 1 ? "X" : "Y"}`;
  } else warningSound.play();
});

// ------------ toggle theme-----------
const themeBtn = document.querySelector("#toggle-theme");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ------------close modal--------
const modalContent = document.querySelector(".modal_content");
modal.addEventListener("click", (e) => {
  if (!modalContent.contains(e.target)) {
    modal.classList.remove("show");
    winSound.load();
  }
});

// ----- mute audio----------
const muteBtn = document.querySelector("#toggle-sound");
const muteIcon = muteBtn.querySelector("i");
let isMuted = false;
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  crossSound.muted = isMuted;
  oSound.muted = isMuted;
  winSound.muted = isMuted;
  warningSound.muted = isMuted;

  muteIcon.className = isMuted
    ? "fa-solid fa-volume-off"
    : "fa-solid fa-volume-high";
});
