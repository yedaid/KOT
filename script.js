const boardEl = document.getElementById("board");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const playerScoreEl = document.getElementById("playerScore");
const pcScoreEl = document.getElementById("pcScore");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let board = Array(9).fill(null);
let isGameOver = false;
let isPcThinking = false;

// X = Player, O = PC
let startingPlayer = localStorage.getItem("startingPlayer") || "X";
let currentTurn = startingPlayer;

/* =====================
   INICIALIZAR TABLERO
===================== */
boardEl.innerHTML = "";
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", () => handlePlayerMove(i));
  boardEl.appendChild(cell);
}

loadScore();
render();
autoStartIfPc();

/* =====================
   TURNO PLAYER
===================== */
function handlePlayerMove(index) {
  if (
    board[index] ||
    isGameOver ||
    isPcThinking ||
    currentTurn !== "X"
  ) return;

  board[index] = "X";
  currentTurn = "O";
  render();

  if (checkWinner("X")) {
    endGame("PLAYER WINS", "player");
    return;
  }

  if (isDraw()) {
    endGame("DRAW");
    return;
  }

  pcThinking();
}

/* =====================
   TURNO PC
===================== */
function pcThinking() {
  isPcThinking = true;
  setTimeout(() => {
    pcMove();
    isPcThinking = false;
  }, 500);
}

function pcMove() {
  if (isGameOver || currentTurn !== "O") return;

  const move = bestMove();
  board[move] = "O";
  currentTurn = "X";
  render();

  if (checkWinner("O")) {
    endGame("PC WINS", "pc");
    return;
  }

  if (isDraw()) {
    endGame("DRAW");
  }
}

/* =====================
   AUTO INICIO SI PC EMPIEZA
===================== */
function autoStartIfPc() {
  if (currentTurn === "O") {
    pcThinking();
  }
}

/* =====================
   FINAL DEL JUEGO
===================== */
function endGame(text, winner) {
  isGameOver = true;
  overlayText.textContent = text;
  overlay.classList.add("show");

  if (winner) saveScore(winner);

  setTimeout(() => {
    resetGame();
  }, 1500);
}

/* =====================
   RESET + ALTERNAR TURNO
===================== */
function resetGame() {
  board = Array(9).fill(null);
  isGameOver = false;
  isPcThinking = false;

  // alternar quien empieza
  startingPlayer = startingPlayer === "X" ? "O" : "X";
  localStorage.setItem("startingPlayer", startingPlayer);

  currentTurn = startingPlayer;

  overlay.classList.remove("show");
  render();
  autoStartIfPc();
}

/* =====================
   RENDER
===================== */
function render() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i] || "";
    cell.classList.remove("x", "o");
    if (board[i]) cell.classList.add(board[i].toLowerCase());
  });
}

/* =====================
   SCORE
===================== */
function saveScore(winner) {
  const score = JSON.parse(localStorage.getItem("kotScore")) || {
    player: 0,
    pc: 0
  };
  score[winner]++;
  localStorage.setItem("kotScore", JSON.stringify(score));
  loadScore();
}

function loadScore() {
  const score = JSON.parse(localStorage.getItem("kotScore")) || {
    player: 0,
    pc: 0
  };
  playerScoreEl.textContent = score.player;
  pcScoreEl.textContent = score.pc;
}

/* =====================
   IA MINIMAX (DIFÍCIL)
===================== */
function bestMove() {
  let bestScore = -Infinity;
  let move;

  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
}

function minimax(b, isMax) {
  if (checkStaticWinner(b, "O")) return 10;
  if (checkStaticWinner(b, "X")) return -10;
  if (b.every(c => c)) return 0;

  if (isMax) {
    let best = -Infinity;
    b.forEach((c, i) => {
      if (!c) {
        b[i] = "O";
        best = Math.max(best, minimax(b, false));
        b[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    b.forEach((c, i) => {
      if (!c) {
        b[i] = "X";
        best = Math.min(best, minimax(b, true));
        b[i] = null;
      }
    });
    return best;
  }
}

/* =====================
   GANADOR / EMPATE
===================== */
function checkWinner(p) {
  return checkStaticWinner(board, p);
}

function checkStaticWinner(b, p) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => b[i] === p));
}

function isDraw() {
  return board.every(c => c);
}

/* =====================
   FULLSCREEN
===================== */
fullscreenBtn.addEventListener("click", toggleFullscreen);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

/* =====================
   MODAL LEGAL
===================== */
function openLegal() {
  document.getElementById("legalModal").style.display = "flex";
}

function closeLegal() {
  document.getElementById("legalModal").style.display = "none";
}
