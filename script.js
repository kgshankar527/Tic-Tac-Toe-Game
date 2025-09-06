let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let scoreO = document.querySelector("#score-o");
let scoreX = document.querySelector("#score-x");
let scoreDraw = document.querySelector("#score-draw");
let winLine = document.querySelector("#win-line");

let turnO = true;
let moveCount = 0;

// Score variables
let winsO = 0, winsX = 0, draws = 0;

// Patterns + Line positions
const winPatterns = [
  { pattern: [0, 1, 2], x: 50, y: 16.5, rotate: 0 },    // row 1
  { pattern: [3, 4, 5], x: 50, y: 50, rotate: 0 },      // row 2
  { pattern: [6, 7, 8], x: 50, y: 83.5, rotate: 0 },    // row 3
  { pattern: [0, 3, 6], x: 16.5, y: 50, rotate: 90 },   // col 1
  { pattern: [1, 4, 7], x: 50, y: 50, rotate: 90 },     // col 2
  { pattern: [2, 5, 8], x: 83.5, y: 50, rotate: 90 },   // col 3
  { pattern: [0, 4, 8], x: 50, y: 50, rotate: 45 },     // diagonal \
  { pattern: [2, 4, 6], x: 50, y: 50, rotate: -45 },    // diagonal /
];

const resetGame = () => {
  turnO = true;
  moveCount = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  winLine.style.display = "none"; // 🆕 लाइन छुपा दो
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO) {
      box.innerText = "O";
      turnO = false;
    } else {
      box.innerText = "X";
      turnO = true;
    }
    box.disabled = true;
    moveCount++;
    
    checkWinner();
  });
});

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner, lineConfig) => {
  msg.innerText = `🎉 Congratulations, Winner is ${winner} 🏆`;
  msgContainer.classList.remove("hide");
  disableBoxes();

  // Scoreboard update
  if (winner === "O") {
    winsO++;
    scoreO.innerText = winsO;
  } else {
    winsX++;
    scoreX.innerText = winsX;
  }

  // 🆕 जीत की लाइन दिखाना
  winLine.style.display = "block";
  winLine.style.width = "70%";
  winLine.style.left = lineConfig.x + "%";
  winLine.style.top = lineConfig.y + "%";
  winLine.style.transform = `translate(-50%, -50%) rotate(${lineConfig.rotate}deg)`;
};

const showDraw = () => {
  msg.innerText = "😐 Match Draw!";
  msgContainer.classList.remove("hide");
  draws++;
  scoreDraw.innerText = draws;
};

const checkWinner = () => {
  for (let obj of winPatterns) {
    let [a, b, c] = obj.pattern;
    let pos1Val = boxes[a].innerText;
    let pos2Val = boxes[b].innerText;
    let pos3Val = boxes[c].innerText;
    
    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val, obj);
        return;
      }
    }
  }

  if (moveCount === 9) {
    showDraw();
  }
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);