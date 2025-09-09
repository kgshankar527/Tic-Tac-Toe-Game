const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 10, paddleHeight = 80, ballSize = 12;
let playerScore = 0, computerScore = 0;

// Paddle positions
let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;

// Ball position and velocity
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballVelX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Arrow key control
let upPressed = false, downPressed = false;

// Mouse control
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  // Clamp paddle within canvas
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});

function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballVelX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballVelY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth - 10, computerY, paddleWidth, paddleHeight);

  // Draw ball
  ctx.fillRect(ballX, ballY, ballSize, ballSize);

  // Draw center line
  ctx.strokeStyle = "#555";
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw scores
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('computerScore').textContent = computerScore;
}

function update() {
  // Arrow key movement
  if (upPressed) playerY -= 7;
  if (downPressed) playerY += 7;
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));

  // Computer AI: move paddle towards ball
  let computerCenter = computerY + paddleHeight / 2;
  if (computerCenter < ballY + ballSize / 2 - 10) computerY += 5;
  else if (computerCenter > ballY + ballSize / 2 + 10) computerY -= 5;
  computerY = Math.max(0, Math.min(canvas.height - paddleHeight, computerY));

  // Move ball
  ballX += ballVelX;
  ballY += ballVelY;

  // Wall collision
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballVelY = -ballVelY;
    ballY = Math.max(0, Math.min(canvas.height - ballSize, ballY));
  }

  // Paddle collision
  // Left paddle
  if (
    ballX <= 10 + paddleWidth &&
    ballY + ballSize > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballVelX = Math.abs(ballVelX);
    // Add spin
    let hitPos = (ballY + ballSize/2) - (playerY + paddleHeight/2);
    ballVelY += hitPos * 0.15;
  }

  // Right paddle
  if (
    ballX + ballSize >= canvas.width - paddleWidth - 10 &&
    ballY + ballSize > computerY &&
    ballY < computerY + paddleHeight
  ) {
    ballVelX = -Math.abs(ballVelX);
    // Add spin
    let hitPos = (ballY + ballSize/2) - (computerY + paddleHeight/2);
    ballVelY += hitPos * 0.15;
  }

  // Score
  if (ballX < 0) {
    computerScore++;
    resetBall();
  }
  if (ballX + ballSize > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
