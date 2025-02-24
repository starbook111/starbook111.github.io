import { worldData, ColorVariations, mod } from "./main.js";

const playScreen = document.getElementById("screen");
const ScreenCtx = playScreen.getContext("2d");

let start = false;

const setStart = (value) => {
  start = value;
};

const returnStart = () => {
  return start;
};

let playerX = 240;
let playerY = 180;

let speedX = 0;
let speedY = 0;

let cameraX = 0;
let cameraY = 0;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

document.addEventListener("keydown", (event) => {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
});

const drawingInEdit = () => {
  worldData
    .filter(
      (chunk) =>
        (chunk.x === Math.floor(cameraX / 480) ||
          chunk.x === Math.floor(cameraX / 480) + 1) &&
        (chunk.y === Math.floor(cameraY / 360) ||
          chunk.y === Math.floor(cameraY / 360) + 1)
    )
    .forEach((chunk) => {
      chunk.data.forEach((rowData, y) => {
        rowData.forEach((data, x) => {
          if (data != "0") {
            ScreenCtx.fillStyle = ColorVariations[data];
            ScreenCtx.fillRect(
              (chunk.x * 480 + x * 20 - cameraX) * 1.125,
              (chunk.y * 360 + y * 20 - cameraY) * 1.125,
              20 * 1.125,
              20 * 1.125
            );
          }
        });
      });
    });
};

const moveX = () => {
  for (let i = 0; i < Math.floor(Math.abs(speedX) / 10); i++) {
    if (speedX > 0) {
      playerX += 10;
    } else {
      playerX -= 10;
    }
    collisionX();
  }
  if (speedX > 0) {
    playerX += speedX % 10;
  } else {
    playerX += speedX % -10;
  }
  collisionX();
};

const collisionX = () => {
  if (
    worldData.some(
      (chunk) =>
        chunk.x === Math.floor((playerX + 20) / 480) &&
        chunk.y === Math.floor(playerY / 360)
    )
  ) {
    let Chunk = worldData.find(
      (chunk) =>
        chunk.x === Math.floor((playerX + 20) / 480) &&
        chunk.y === Math.floor(playerY / 360)
    ).data;
    if (
      Chunk[mod(Math.floor(playerY / 20), 18)][
        Math.floor((playerX + 20) / 20) % 24
      ] == "1"
    ) {
      playerX = Math.floor(playerX / 20) * 20 - 0.1;
      speedX = 0;
    } else if (mod(Math.floor(playerY / 20), 18) + 1 < Chunk.length) {
      if (
        Chunk[mod(Math.floor(playerY / 20), 18) + 1][
          mod(Math.floor((playerX + 20) / 20), 24)
        ] == "1"
      ) {
        playerX = Math.floor(playerX / 20) * 20 - 0.1;
        speedX = 0;
      }
    } else {
      
    }
  }
  if (
    worldData.some(
      (chunk) =>
        chunk.x === Math.floor(playerX / 480) &&
        chunk.y === Math.floor((playerY - 1) / 360)
    )
  ) {
    let Chunk = worldData.find(
      (chunk) =>
        chunk.x === Math.floor(playerX / 480) &&
        chunk.y === Math.floor(playerY / 360)
    ).data;
    if (
      Chunk[mod(Math.floor(playerY / 20), 18)][Math.floor(playerX / 20) % 24] ==
        "1"
    ) {
      playerX = Math.floor((playerX + 20) / 20) * 20 + 0.1;
      speedX = 0;
    } else if (mod(Math.floor(playerY / 20), 18) + 1 < Chunk.length) {
      if (
        Chunk[mod(Math.floor(playerY / 20), 18) + 1][
          mod(Math.floor(playerX / 20), 24)
        ] == "1"
      ) {
        playerX = Math.floor((playerX + 20) / 20) * 20 + 0.1;
        speedX = 0;
      }
    }
  }
};

const moveY = () => {
  for (let i = 0; i < Math.floor(Math.abs(speedY) / 10); i++) {
    if (speedY > 0) {
      playerY += 10;
    } else {
      playerY -= 10;
    }
    collisionY();
  }
  if (speedY > 0) {
    playerY += speedY % 10;
  } else {
    playerY += speedY % -10;
  }
  collisionY();
};

const collisionY = () => {
  if (
    worldData.some(
      (chunk) =>
        chunk.x === Math.floor(playerX / 480) &&
        chunk.y === Math.floor((playerY + 20) / 360)
    )
  ) {
    let Chunk = worldData.find(
      (chunk) =>
        chunk.x === Math.floor(playerX / 480) &&
        chunk.y === Math.floor((playerY + 20) / 360)
    ).data;
    if (
      Chunk[mod(Math.floor((playerY + 20) / 20), 18)][
        Math.floor(playerX / 20) % 24
      ] == "1" ||
      Chunk[mod(Math.floor((playerY + 20) / 20), 18)][
        mod(Math.floor(playerX / 20), 24) + 1
      ] == "1"
    ) {
      playerY = Math.floor(playerY / 20) * 20 - 0.1;
      speedY = 0;
    }
  }
  if (
    worldData.some(
      (chunk) =>
        chunk.x === Math.floor(playerX / 480) &&
        chunk.y === Math.floor(playerY / 360)
    )
  ) {
    let Chunk = worldData.find(
      (chunk) =>
        chunk.x === Math.floor(playerX / 480) &&
        chunk.y === Math.floor(playerY / 360)
    ).data;
    if (
      Chunk[mod(Math.floor(playerY / 20), 18)][
        mod(Math.floor(playerX / 20), 24)
      ] == "1" ||
      Chunk[mod(Math.floor(playerY / 20), 18)][
        mod(Math.floor(playerX / 20), 24) + 1
      ] == "1"
    ) {
      playerY = Math.floor((playerY + 20) / 20) * 20 + 0.1;
      speedY = 0;
    }
  }
};

const playerMove = () => {
  if (keys.ArrowRight) {
    speedX += 1;
  }
  if (keys.ArrowLeft) {
    speedX -= 1;
  }
  speedX *= 0.9;
  moveX();
  cameraX += (playerX - 240 + 10 * 1.125 - cameraX) * 0.1;
  if (keys.ArrowUp) {
    speedY = -10;
  }
  speedY += 0.8;
  moveY();
  cameraY += (playerY - 180 + 10 * 1.125 - cameraY) * 0.1;
  ScreenCtx.fillStyle = "lightblue";
  ScreenCtx.fillRect(
    (playerX - cameraX) * 1.125,
    (playerY - cameraY) * 1.125,
    20 * 1.125,
    20 * 1.125
  );
};

const gameLoop = () => {
  ScreenCtx.clearRect(0, 0, 540, 405);
  playerMove();
  drawingInEdit();
  if (start) {
    requestAnimationFrame(gameLoop);
  }
};

export { gameLoop, setStart, returnStart };
