const boardEl = document.getElementById("board");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");

let board = Array(9).fill(null);
let player = "X";
let pc = "O";
let scores = JSON.parse(localStorage.getItem("scores")) || { p: 0, c: 0 };
let gamesPlayed = parseInt(localStorage.getItem("gamesPlayed")) || 0;

updateScore();

for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.onclick = () => playerMove(i);
  boardEl.appendChild(cell);
}

function playerMove(i) {
  if (board[i] || checkWinner()) return;
  board[i] = player;
  render();
  if (!checkWinner()) pcMove();
}

function pcMove() {
  let best = minimax(board, pc).index;
  board[best] = pc;
  render();
  checkWinner();
}

function render() {
  document.querySelectorAll(".cell").forEach((c, i) => {
    c.textContent = board[i];
    c.className = "cell";
    if (board[i]) c.classList.add(board[i].toLowerCase());
  });
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let w of wins) {
    if (board[w[0]] && board[w[0]] === board[w[1]] && board[w[1]] === board[w[2]]) {
      endGame(board[w[0]]);
      return true;
    }
  }

  if (!board.includes(null)) endGame("draw");
  return false;
}

function endGame(winner) {
  overlay.classList.add("show");
  if (winner === "draw") overlayText.textContent = "DRAW";
  else overlayText.textContent = winner + " WINS";

  if (winner === player) scores.p++;
  if (winner === pc) scores.c++;

  gamesPlayed++;
  localStorage.setItem("gamesPlayed", gamesPlayed);
  localStorage.setItem("scores", JSON.stringify(scores));
  updateScore();

  if (gamesPlayed % 3 === 0) showAd();
}

function resetGame() {
  board = Array(9).fill(null);
  overlay.classList.remove("show");
  render();
}

function updateScore() {
  document.getElementById("playerScore").textContent = scores.p;
  document.getElementById("pcScore").textContent = scores.c;
}

/* IA IMPOSIBLE */
function minimax(newBoard, playerTurn) {
  const avail = newBoard.map((v,i)=>v===null?i:null).filter(v=>v!==null);
  if (checkStatic(newBoard, player)) return {score:-10};
  if (checkStatic(newBoard, pc)) return {score:10};
  if (avail.length === 0) return {score:0};

  let moves = [];
  for (let i of avail) {
    let move = {};
    move.index = i;
    newBoard[i] = playerTurn;
    move.score = minimax(newBoard, playerTurn === pc ? player : pc).score;
    newBoard[i] = null;
    moves.push(move);
  }

  return playerTurn === pc
    ? moves.reduce((a,b)=>a.score>b.score?a:b)
    : moves.reduce((a,b)=>a.score<b.score?a:b);
}

function checkStatic(b, p) {
  return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    .some(w => b[w[0]]===p && b[w[1]]===p && b[w[2]]===p);
}

/* Ads + Legal */
function showAd() {
  document.getElementById("adInterstitial").classList.add("show");
  (adsbygoogle = window.adsbygoogle || []).push({});
}

function closeAd() {
  document.getElementById("adInterstitial").classList.remove("show");
}

function openLegal() {
  document.getElementById("legalModal").style.display = "flex";
}

function closeLegal() {
  document.getElementById("legalModal").style.display = "none";
}

(adsbygoogle = window.adsbygoogle || []).push({});
