const boardEl = document.getElementById("board");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const playerScoreEl = document.getElementById("playerScore");
const pcScoreEl = document.getElementById("pcScore");

let board = Array(9).fill(null);
let isGameOver = false;
let isPcThinking = false;

// Crear tablero
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", () => handleClick(i));
  boardEl.appendChild(cell);
}

loadScore();
render();

// Click humano
function handleClick(index) {
  if (board[index] || isGameOver || isPcThinking) return;

  board[index] = "X";
  render();

  if (checkWinner("X")) {
    endGame("PLAYER WINS", "player");
    return;
  }

  if (isDraw()) {
    endGame("DRAW");
    return;
  }

  isPcThinking = true;
  setTimeout(() => {
    pcMove();
    isPcThinking = false;
  }, 500);
}

// PC modo difícil
function pcMove() {
  const move = bestMove();
  board[move] = "O";
  render();

  if (checkWinner("O")) {
    endGame("PC WINS", "pc");
    return;
  }

  if (isDraw()) {
    endGame("DRAW");
  }
}

function render() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i] || "";
    cell.classList.remove("x", "o");
    if (board[i]) cell.classList.add(board[i].toLowerCase());
  });
}

// Minimax
function bestMove() {
  let bestScore = -Infinity;
  let move;

  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = "O";
      let score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
}

function minimax(board, isMax) {
  if (checkWinner("O")) return 1;
  if (checkWinner("X")) return -1;
  if (isDraw()) return 0;

  let best = isMax ? -Infinity : Infinity;

  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = isMax ? "O" : "X";
      let score = minimax(board, !isMax);
      board[i] = null;
      best = isMax ? Math.max(score, best) : Math.min(score, best);
    }
  });

  return best;
}

// Ganador
function checkWinner(p) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => board[i] === p));
}

function isDraw() {
  return board.every(c => c);
}

function endGame(text, winner) {
  isGameOver = true;
  overlayText.textContent = text;
  overlay.classList.add("show");
  if (winner) saveScore(winner);
}

// Reset
function resetGame() {
  board = Array(9).fill(null);
  isGameOver = false;
  overlay.classList.remove("show");
  render();
}

// Score
function saveScore(winner) {
  const score = JSON.parse(localStorage.getItem("kotScore")) || {player:0, pc:0};
  score[winner]++;
  localStorage.setItem("kotScore", JSON.stringify(score));
  loadScore();
}

function loadScore() {
  const score = JSON.parse(localStorage.getItem("kotScore")) || {player:0, pc:0};
  playerScoreEl.textContent = score.player;
  pcScoreEl.textContent = score.pc;
}

// Legal modal
function openLegal() {
  document.getElementById("legalModal").style.display = "flex";
}
function closeLegal() {
  document.getElementById("legalModal").style.display = "none";
}
