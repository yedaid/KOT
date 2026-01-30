const cells = document.querySelectorAll(".cell");
const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");

const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const tieSound = document.getElementById("tieSound");

let board = Array(9).fill("");
let gameActive = true;

let xScore = Number(localStorage.getItem("xScore")) || 0;
let oScore = Number(localStorage.getItem("oScore")) || 0;
updateScore();

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach((cell, i) => {
  cell.addEventListener("click", () => playerMove(i));
});

function playerMove(i) {
  if (!gameActive || board[i]) return;

  place(i, "X");
  if (checkEnd("X")) return;

  setTimeout(cpuMove, 500);
}

function cpuMove() {
  let move =
    findMove("O") ||
    findMove("X") ||
    (board[4] === "" ? 4 : null) ||
    [0,2,6,8].find(i => board[i] === "") ||
    board.findIndex(c => c === "");

  place(move, "O");
  checkEnd("O");
}

function findMove(player) {
  for (let combo of winCombos) {
    let values = combo.map(i => board[i]);
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return combo[values.indexOf("")];
    }
  }
  return null;
}

function place(i, player) {
  board[i] = player;
  cells[i].textContent = player;
  cells[i].classList.add(player.toLowerCase());
  clickSound.play();
}

function checkEnd(player) {
  for (let combo of winCombos) {
    if (combo.every(i => board[i] === player)) {
      showOverlay(player === "X" ? "YOU WIN" : "CPU WINS");
      player === "X" ? xScore++ : oScore++;
      updateScore();
      winSound.play();
      autoReset();
      return true;
    }
  }

  if (!board.includes("")) {
    showOverlay("DRAW");
    tieSound.play();
    autoReset();
    return true;
  }
  return false;
}

function showOverlay(text) {
  overlayText.textContent = text;
  overlay.classList.add("show");
}

function autoReset() {
  gameActive = false;
  setTimeout(() => {
    overlay.classList.remove("show");
    board.fill("");
    cells.forEach(c => {
      c.textContent = "";
      c.className = "cell";
    });
    gameActive = true;
  }, 2000);
}

function updateScore() {
  xScoreEl.textContent = xScore;
  oScoreEl.textContent = oScore;
  localStorage.setItem("xScore", xScore);
  localStorage.setItem("oScore", oScore);
}

function resetScore() {
  xScore = 0;
  oScore = 0;
  updateScore();
}

function fullscreen() {
  document.documentElement.requestFullscreen();
}