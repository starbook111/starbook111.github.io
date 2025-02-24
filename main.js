import { gameLoop, setStart, returnStart } from "./display.js";
import fileExport from "./download.js";

const edit = document.getElementById("edit");
const editCtx = edit.getContext("2d");

let cameraX = 0;
let cameraY = 0;

let pressedLocationX = 0;
let pressedLocationY = 0;

let isMouseDown = false;

let currentTool = "draw";

let red = 0;
let blue = 0;
let green = 0;

const worldData = [];

const firstValue = [
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000000000000",
];

const ColorVariations = {
  1: "gray",
};

const dragTool = document.querySelector('img[src="./images/drag.svg"]');
const drawTool = document.querySelector('img[src="./images/draw.svg"]');
const eraseTool = document.querySelector('img[src="./images/erase.svg"]');

const TileColorPalette = document.getElementById("TileColorPalette");
TileColorPalette.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

const tools = [drawTool, eraseTool, dragTool];

tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    tools.forEach((t) => t.classList.remove("selected"));
    tool.classList.add("selected");
    if (tool === drawTool) {
      currentTool = "draw";
    }
    if (tool === eraseTool) {
      currentTool = "erase";
    }
    if (tool === dragTool) {
      currentTool = "drag";
    }
  });
});

const playButton = document.querySelector('img[src="./images/play.svg"]');
const stopButton = document.querySelector('img[src="./images/stop.svg"]');

const ControlButton = [playButton, stopButton];

ControlButton.forEach((button) => {
  button.addEventListener("click", () => {
    ControlButton.forEach((t) => t.classList.remove("selected"));
    button.classList.add("selected");
    if (button === playButton) {
      if (!returnStart()) {
        setStart(true);
        gameLoop();
      }
    } else {
      setStart(false);
    }
  });
});

const drawingInEdit = () => {
  editCtx.clearRect(0, 0, 600, 450);
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
            editCtx.fillStyle = ColorVariations[data];
            editCtx.fillRect(
              (chunk.x * 480 + x * 20 - cameraX) * (10 / 9),
              (chunk.y * 360 + y * 20 - cameraY) * (10 / 9),
              20 * (10 / 9),
              20 * (10 / 9)
            );
          }
        });
      });
    });
};

const mod = (n, m) => {
  return ((n % m) + m) % m;
};

edit.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  pressedLocationX = event.clientX / (10 / 9) + cameraX;
  pressedLocationY = event.clientY / (10 / 9) + cameraY;
});

edit.addEventListener("mouseup", () => {
  isMouseDown = false;
});

edit.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    if (currentTool === "drag") {
      cameraX = pressedLocationX - event.clientX / (10 / 9);
      cameraY = pressedLocationY - event.clientY / (10 / 9);
    }
    if (currentTool === "draw") {
      let clientX = (event.clientX - 80) / (10 / 9) + cameraX;
      let clientY = (event.clientY - 110) / (10 / 9) + cameraY;
      let chunkExist = worldData.some(
        (Chunk) =>
          Chunk.x === Math.floor(clientX / 480) &&
          Chunk.y === Math.floor(clientY / 360)
      );
      if (!chunkExist) {
        const newChunkData = firstValue.map((row) => [...row]);
        worldData.push({
          x: Math.floor(clientX / 480),
          y: Math.floor(clientY / 360),
          data: newChunkData,
        });
      }
      worldData[
        worldData.findIndex(
          (Chunk) =>
            Chunk.x === Math.floor(clientX / 480) &&
            Chunk.y === Math.floor(clientY / 360)
        )
      ].data[mod(Math.floor(clientY / 20), 18)][
        mod(Math.floor(clientX / 20), 24)
      ] = "1";
    }
    if (currentTool === "erase") {
      let clientX = (event.clientX - 80) / (10 / 9) + cameraX;
      let clientY = (event.clientY - 110) / (10 / 9) + cameraY;
      let chunkExist = worldData.some(
        (Chunk) =>
          Chunk.x === Math.floor(clientX / 480) &&
          Chunk.y === Math.floor(clientY / 360)
      );
      if (!chunkExist) {
        const newChunkData = firstValue.map((row) => [...row]);
        worldData.push({
          x: Math.floor(clientX / 480),
          y: Math.floor(clientY / 360),
          data: newChunkData,
        });
      }
      worldData[
        worldData.findIndex(
          (Chunk) =>
            Chunk.x === Math.floor(clientX / 480) &&
            Chunk.y === Math.floor(clientY / 360)
        )
      ].data[Math.floor(clientY / 20) % 18][Math.floor(clientX / 20) % 24] =
        "0";
    }
    drawingInEdit();
  }
});

edit.addEventListener("mouseleave", () => {
  isMouseDown = false;
});

fileExport();

export { worldData, ColorVariations, mod };
