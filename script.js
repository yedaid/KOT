const boardEl = document.getElementById("board");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const playerScoreEl = document.getElementById("playerScore");
const pcScoreEl = document.getElementById("pcScore");

let board = Array(9).fill(null);
let isGameOver = false;
let isPcThinking = false;

// Crear tablero
boardEl.innerHTML = "";
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", () => handlePlayerMove(i));
  boardEl.appendChild(cell);
}

// Cargar score guardado
loadScore();
render();

/* =====================
   MOVIMIENTO DEL JUGADOR
===================== */
function handlePlayerMove(index) {
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

  // Turno de la PC con delay
  isPcThinking = true;
  setTimeout(() => {
    pcMove();
    isPcThinking = false;
  }, 500);
}

/* =====================
   MOVIMIENTO DE LA PC
===================== */
function pcMove() {
  if (isGameOver) return;

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
   FINAL DEL JUEGO
===================== */
function endGame(text, winner) {
  isGameOver = true;
  overlayText.textContent = text;
  overlay.classList.add("show");

  if (winner) saveScore(winner);

  // ⏱️ Reinicio automático a los 1.5 segundos
  setTimeout(() => {
    resetGame();
  }, 1500);
}

/* =====================
   RESET
===================== */
function resetGame() {
  board = Array(9).fill(null);
  isGameOver = false;
  isPcThinking = false;
  overlay.classList.remove("show");
  render();
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
   IA MODO DIFÍCIL (MINIMAX)
===================== */
function bestMove() {
  let bestScore = -Infinity;
  let move = null;

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

function minimax(newBoard, isMaximizing) {
  if (checkStaticWinner(newBoard, "O")) return 10;
  if (checkStaticWinner(newBoard, "X")) return -10;
  if (newBoard.every(c => c !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    newBoard.forEach((cell, i) => {
      if (!cell) {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, false));
        newBoard[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    newBoard.forEach((cell, i) => {
      if (!cell) {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, true));
        newBoard[i] = null;
      }
    });
    return best;
  }
}

/* =====================
   GANADOR / EMPATE
===================== */
function checkWinner(player) {
  return checkStaticWinner(board, player);
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
  return board.every(cell => cell !== null);
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
