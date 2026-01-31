const cells = document.querySelectorAll('.cell');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let scoreX = 0;
let scoreO = 0;
let gameCount = 0; // For interstitial ads

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Add click events
cells.forEach((cell, idx) => {
  cell.addEventListener('click', () => makeMove(idx));
});

function makeMove(idx) {
  if(board[idx] !== '') return;
  board[idx] = currentPlayer;
  cells[idx].textContent = currentPlayer;
  cells[idx].classList.add(currentPlayer.toLowerCase());

  if(checkWin()) endGame(currentPlayer);
  else if(board.every(c => c !== '')) endGame('Tie');
  else currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
  return winningCombinations.some(combo => combo.every(idx => board[idx] === currentPlayer));
}

function endGame(winner) {
  overlayText.textContent = winner === 'Tie' ? 'TIE!' : `${winner} WINS!`;
  if(winner === 'X') scoreX++; else if(winner === 'O') scoreO++;
  updateScore();
  overlay.classList.add('show');

  gameCount++;
  if(gameCount % 3 === 0) showInterstitialAd();

  setTimeout(() => {
    overlay.classList.remove('show');
    resetBoard();
  }, 2000);
}

function resetBoard() {
  board.fill('');
  cells.forEach(c => { c.textContent=''; c.classList.remove('x','o'); });
  currentPlayer = 'X';
}

function updateScore() {
  scoreXEl.textContent = `X: ${scoreX}`;
  scoreOEl.textContent = `O: ${scoreO}`;
}

function toggleFullscreen() {
  if(!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

function showInterstitialAd() {
  // Replace with real Google AdSense interstitial if approved
  console.log("Interstitial ad placeholder");
}