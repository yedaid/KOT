const PLAYER_X = "✕";
const PLAYER_O = "◯";

const cells = document.querySelectorAll(".cell");
const winnerBox = document.getElementById("winner");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let currentPlayer = PLAYER_X;
let board = Array(9).fill("");
let gameOver = false;

let scores = { x: 0, o: 0 };
let gameCount = 0;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (board[index] || gameOver) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
      endGame(${currentPlayer === PLAYER_X ? "Player ✕ Wins!" : "Player ◯ Wins!"});
      updateScore();
      return;
    }

    if (!board.includes("")) {
      endGame("Draw!");
      return;
    }

    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  });
});

function checkWin() {
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === currentPlayer)
  );
}

function updateScore() {
  if (currentPlayer === PLAYER_X) {
    scores.x++;
    scoreX.textContent = scores.x;
  } else {
    scores.o++;
    scoreO.textContent = scores.o;
  }
}

function endGame(message) {
  winnerBox.textContent = message;
  gameOver = true;

  setTimeout(() => {
    resetGame();
  }, 2000);
}

function resetGame() {
  board.fill("");
  cells.forEach(c => c.textContent = "");
  winnerBox.textContent = "";
  currentPlayer = PLAYER_X;
  gameOver = false;

  gameCount++;

  if (gameCount % 3 === 0) {
    enableInterstitialAds();
  }
}

function enableInterstitialAds() {
  if (!window.adsbygoogle) return;

  try {
    (adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-XXXXXXXXXXXX",
      enable_page_level_ads: true
    });
  } catch (e) {
    console.log("Interstitial not ready");
  }
}