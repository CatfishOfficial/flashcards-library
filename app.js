const gameEl = document.getElementById("game");
const statusEl = document.getElementById("status");

const level = [
  "########################################",
  "#......................................#",
  "#......................................#",
  "#.............###......................#",
  "#......................................#",
  "#.................#####................#",
  "#......................................#",
  "#......###.............................#",
  "#......................................#",
  "#..................................G...#",
  "#.......................####...........#",
  "#......................................#",
  "#...............###....................#",
  "#......................................#",
  "#....P.................................#",
  "########################################",
];

const tileMap = level.map((row) => row.split(""));
const width = tileMap[0].length;
const height = tileMap.length;

const player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  onGround: false,
};

const keys = {
  left: false,
  right: false,
  jump: false,
};

const physics = {
  gravity: 0.28,
  moveSpeed: 0.6,
  maxFall: 3.5,
  jumpSpeed: -4.2,
  friction: 0.8,
};

let lastTime = 0;
let hasWon = false;

function findPlayerStart() {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (tileMap[y][x] === "P") {
        tileMap[y][x] = ".";
        return { x, y };
      }
    }
  }
  return { x: 1, y: height - 2 };
}

function resetGame() {
  const start = findPlayerStart();
  player.x = start.x;
  player.y = start.y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  hasWon = false;
  statusEl.textContent = "";
}

function isSolid(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return true;
  }
  return tileMap[y][x] === "#";
}

function isGoal(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return false;
  }
  return tileMap[y][x] === "G";
}

function updatePlayer() {
  if (hasWon) {
    player.vx = 0;
    player.vy = 0;
    return;
  }

  if (keys.left) {
    player.vx = -physics.moveSpeed;
  } else if (keys.right) {
    player.vx = physics.moveSpeed;
  } else {
    player.vx *= physics.friction;
    if (Math.abs(player.vx) < 0.05) {
      player.vx = 0;
    }
  }

  if (keys.jump && player.onGround) {
    player.vy = physics.jumpSpeed;
    player.onGround = false;
  }

  player.vy += physics.gravity;
  if (player.vy > physics.maxFall) {
    player.vy = physics.maxFall;
  }

  moveAxis(player.vx, 0);
  moveAxis(0, player.vy);
}

function moveAxis(dx, dy) {
  const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));
  const stepX = dx / steps;
  const stepY = dy / steps;

  for (let i = 0; i < steps; i += 1) {
    const nextX = player.x + stepX;
    const nextY = player.y + stepY;

    if (!isSolid(Math.round(nextX), Math.round(player.y))) {
      player.x = nextX;
    } else {
      player.vx = 0;
    }

    if (!isSolid(Math.round(player.x), Math.round(nextY))) {
      player.y = nextY;
      player.onGround = false;
    } else {
      if (stepY > 0) {
        player.onGround = true;
      }
      player.vy = 0;
    }
  }

  const tileX = Math.round(player.x);
  const tileY = Math.round(player.y);
  if (isGoal(tileX, tileY)) {
    hasWon = true;
    statusEl.textContent = "You reached the goal! Press R to play again.";
  }
}

function render() {
  const buffer = tileMap.map((row) => row.slice());
  const px = Math.round(player.x);
  const py = Math.round(player.y);
  if (buffer[py] && buffer[py][px]) {
    buffer[py][px] = "@";
  }
  gameEl.textContent = buffer.map((row) => row.join("")).join("\n");
}

function gameLoop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  if (delta > 0) {
    updatePlayer();
    render();
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keys.left = true;
      break;
    case "ArrowRight":
      keys.right = true;
      break;
    case "ArrowUp":
    case " ":
      keys.jump = true;
      break;
    case "r":
    case "R":
      resetGame();
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keys.left = false;
      break;
    case "ArrowRight":
      keys.right = false;
      break;
    case "ArrowUp":
    case " ":
      keys.jump = false;
      break;
    default:
      break;
  }
});

resetGame();
requestAnimationFrame(gameLoop);
