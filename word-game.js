
const wordList = [
  "crane", "slate", "audio", "brisk", "clump",
  "flair", "ghost", "honey", "irony", "joust",
  "knack", "light", "moist", "novel", "olive",
  "plank", "quart", "raven", "swamp", "torch",
  "ulcer", "vivid", "waltz", "xenon", "yacht",
  "zippy", "blaze", "crisp", "drove", "ember",
  "flint", "groan", "haste", "inlet", "jumpy"
];

const game = {
  state: "playing",      // "playing", "win", or "lose"
  targetWord: "",
  guesses: [],           // array of submitted guess strings
  feedback: [],          // array of feedback arrays per guess
  currentRow: 0,
  currentInput: []       // letters typed so far in current row
};




function resetGame() {
  game.state = "playing";
  game.targetWord = wordList[Math.floor(Math.random() * wordList.length)];
  game.guesses = [];
  game.feedback = [];
  game.currentRow = 0;
  game.currentInput = [];
}


function checkGuess(guess) {
  const target = game.targetWord.split("");
  const result = ["absent", "absent", "absent", "absent", "absent"];
  const targetCopy = [...target];


  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetCopy[i] = null;
    }
  }


  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const foundIndex = targetCopy.indexOf(guess[i]);
    if (foundIndex !== -1) {
      result[i] = "present";
      targetCopy[foundIndex] = null;
    }
  }

  return result;
}


function processKey(key) {

  if (game.state !== "playing") return;

  if (key === "Backspace") {

    if (game.currentInput.length > 0) {
      game.currentInput.pop();
    }

  } else if (key === "Enter") {

    if (game.currentInput.length < 5) return;

    const guess = game.currentInput.join("");
    const result = checkGuess(guess);

    game.guesses.push(guess);
    game.feedback.push(result);


    if (guess === game.targetWord) {
      game.state = "win";
    } else if (game.currentRow === 5) {

      game.state = "lose";
    }

    game.currentRow++;
    game.currentInput = [];

  } else if (/^[a-zA-Z]$/.test(key)) {

    if (game.currentInput.length < 5) {
      game.currentInput.push(key.toLowerCase());
    }
  }
}




function buildBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let row = 0; row < 6; row++) {
    const rowEl = document.createElement("div");
    rowEl.classList.add("board-row");
    rowEl.id = "row-" + row;

    for (let col = 0; col < 5; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = "tile-" + row + "-" + col;
      rowEl.appendChild(tile);
    }

    board.appendChild(rowEl);
  }
}


function renderBoard() {

  for (let row = 0; row < game.guesses.length; row++) {
    for (let col = 0; col < 5; col++) {
      const tile = document.getElementById("tile-" + row + "-" + col);
      tile.textContent = game.guesses[row][col].toUpperCase();
      tile.className = "tile " + game.feedback[row][col];
    }
  }


  if (game.currentRow < 6) {
    for (let col = 0; col < 5; col++) {
      const tile = document.getElementById("tile-" + game.currentRow + "-" + col);
      tile.textContent = game.currentInput[col] ? game.currentInput[col].toUpperCase() : "";
      tile.className = "tile" + (game.currentInput[col] ? " active" : "");
    }
  }
}


function renderStatus() {
  const statusEl = document.getElementById("status");
  statusEl.className = "status-message";

  if (game.state === "win") {
    statusEl.textContent = "You got it! The word was " + game.targetWord.toUpperCase() + ". 🎉";
    statusEl.classList.add("win");
  } else if (game.state === "lose") {
    statusEl.textContent = "Game over! The word was " + game.targetWord.toUpperCase() + ".";
    statusEl.classList.add("lose");
  } else {
    statusEl.textContent = "";
  }
}


function renderGame() {
  renderBoard();
  renderStatus();
}

document.addEventListener("keydown", (event) => {
  processKey(event.key);
  renderGame();
});


document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
  buildBoard();
  renderGame();
});


resetGame();
buildBoard();
renderGame();
