import { gameLoop, setStart, returnStart } from "./display.js";
import fileExport from "./download.js";

const edit = document.getElementById("edit");
const editCtx = edit.getContext("2d");

let cameraX = 0;
let cameraY = 0;

let pressedLocationX = 0;
let pressedLocationY = 0;

let clickX = 0;
let clickY = 0;

let editIsMouseDown = false;

let worldCurrentTool = "draw";
let animationCurrentTool = "line";

let red = 0;
let blue = 0;
let green = 0;

let mode = "code";

const worldData = [];

const polygonData = [];

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

let EditingPolygonNumber = 0;

let time = 0;

const dragTool = document.querySelector('img[src="./images/drag.svg"]');
const drawTool = document.querySelector('img[src="./images/draw.svg"]');
const worldEraseTool = document.querySelector('img[src="./images/erase.svg"]');

const TileColorPalette = document.getElementById("TileColorPalette");
TileColorPalette.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

const worldTools = [drawTool, worldEraseTool, dragTool];

worldTools.forEach((tool) => {
  tool.addEventListener("click", () => {
    worldTools.forEach((t) => t.classList.remove("selected"));
    tool.classList.add("selected");
    if (tool === drawTool) {
      worldCurrentTool = "draw";
    }
    if (tool === worldEraseTool) {
      worldCurrentTool = "erase";
    }
    if (tool === dragTool) {
      worldCurrentTool = "drag";
    }
  });
});

const lineTool = document.querySelector('img[src="./images/line.svg"]');
const animationEraseTool = document.getElementById("animationErase");
const pointerTool = document.querySelector('img[src="./images/pointer.svg"]');

const animationTool = [lineTool, animationEraseTool, pointerTool];

animationTool.forEach((tool) => {
  tool.addEventListener("click", () => {
    animationTool.forEach((t) => t.classList.remove("selected"));
    tool.classList.add("selected");
    if (tool === lineTool) {
      animationCurrentTool = "line";
    }
    if (tool === animationEraseTool) {
      animationCurrentTool = "erase";
    }
    if (tool === pointerTool) {
      animationCurrentTool = "pointer";
    }
  });
});

lineTool.classList.add("selected");

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

const modeElement = document.querySelectorAll('p[class="mode"]');
const WorldSidebar = document.getElementById("WorldSidebar");
const AnimationSideber = document.getElementById("AnimationSideber");

modeElement.forEach((button) => {
  button.addEventListener("click", () => {
    modeElement.forEach((t) => t.classList.remove("selected"));
    button.classList.add("selected");
    if (button.textContent === "code") {
      mode = "code";
    } else if (button.textContent === "animation") {
      mode = "animation";
      AnimationSideber.classList.add("selected");
      WorldSidebar.classList.remove("selected");
    } else if (button.textContent === "world") {
      mode = "world";
      WorldSidebar.classList.add("selected");
      AnimationSideber.classList.remove("selected");
    }
  });
});

modeElement[0].classList.add("selected");

const circle = new Image();
circle.src = "./images/circle.svg";

const drawingInAnimation = () => {
  editCtx.clearRect(0, 0, 600, 450);
  polygonData.forEach((splite) => {
    splite.polygon.forEach((line) => {
      editCtx.strokeStyle = line.color;
      editCtx.beginPath();
      const FirstPoint = findPointData(line.line[0]);
      if (FirstPoint !== undefined) {
        editCtx.moveTo(FirstPoint.x * (10 / 9), FirstPoint.y * (10 / 9));
        line.line.forEach((point) => {
          const pointData = findPointData(point);
          let r = Math.sqrt(
            (pointData.x - clickX) ** 2 + (pointData.y - clickY) ** 2
          );
          if (r < 5) {
            editCtx.drawImage(
              circle,
              pointData.x * (10 / 9) - 5,
              pointData.y * (10 / 9) - 5,
              10,
              10
            );
          }
          editCtx.lineTo(pointData.x * (10 / 9), pointData.y * (10 / 9));
        });
        editCtx.stroke();
      }
    });
  });
};

const findPointData = (point) => {
  return point.find((PointPerHour) => PointPerHour.t <= time);
};

const drawingInWorld = () => {
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
  editIsMouseDown = true;
  pressedLocationX = (event.clientX - 160) / (10 / 9) + cameraX;
  pressedLocationY = (event.clientY - 110) / (10 / 9) + cameraY;
});

edit.addEventListener("mouseup", (event) => {
  editIsMouseDown = false;
  if (mode === "animation" && animationCurrentTool === "line") {
    let clientX = (event.clientX - 160) / (10 / 9);
    let clientY = (event.clientY - 110) / (10 / 9);
    polygonData[EditingPolygonNumber].polygon.push({
      color: "white",
      line: [
        [{ x: pressedLocationX, y: pressedLocationY, t: time }],
        [{ x: clientX, y: clientY, t: time }],
      ],
    });
    drawingInAnimation();
  }
});

edit.addEventListener("mousemove", (event) => {
  clickX = (event.clientX - 160) * (9 / 10);
  clickY = (event.clientY - 110) * (9 / 10);
  if (mode === "animation") {
    drawingInAnimation();
  }
  if (editIsMouseDown) {
    if (mode === "animation") {
      handleAnimationMouseMove(event);
    }
    if (mode === "world") {
      handleWorldMouseMove(event);
    }
  }
});

const handleAnimationMouseMove = (event) => {
  if (animationCurrentTool === "line") {
    drawingInAnimation();
    let clientX = (event.clientX - 160) / (10 / 9);
    let clientY = (event.clientY - 110) / (10 / 9);
    editCtx.strokeStyle = "white";
    editCtx.beginPath();
    editCtx.moveTo(pressedLocationX * (10 / 9), pressedLocationY * (10 / 9));
    editCtx.lineTo(clientX * (10 / 9), clientY * (10 / 9));
    editCtx.stroke();
  }
};

const handleWorldMouseMove = (event) => {
  if (worldCurrentTool === "drag") {
    handleWorldDrag(event);
  }
  if (worldCurrentTool === "draw") {
    handleWorldDraw(event);
  }
  if (worldCurrentTool === "erase") {
    handleWorldErase(event);
  }
  drawingInWorld();
};

const handleWorldDrag = (event) => {
  cameraX = pressedLocationX - event.clientX / (10 / 9) + 160 / (10 / 9);
  cameraY = pressedLocationY - event.clientY / (10 / 9) + 110 / (10 / 9);
};

const handleWorldDraw = (event) => {
  let clientX = (event.clientX - 160) / (10 / 9) + cameraX;
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
  ].data[mod(Math.floor(clientY / 20), 18)][mod(Math.floor(clientX / 20), 24)] =
    "1";
};

const handleWorldErase = (event) => {
  let clientX = (event.clientX - 160) / (10 / 9) + cameraX;
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
  ].data[Math.floor(clientY / 20) % 18][Math.floor(clientX / 20) % 24] = "0";
};

edit.addEventListener("mouseleave", () => {
  editIsMouseDown = false;
});

const addPolygon = document.getElementById("addPolygon");
const addSelection = document.getElementById("addSelection");
const sidebar = document.getElementById("sidebar");

addPolygon.addEventListener("click", () => {
  polygonData.push({ name: "test", polygon: [] });
  const PolygonIcon = document.createElement("img");
  PolygonIcon.classList.add("polygonIcon");
  sidebar.appendChild(PolygonIcon);
});

addPolygon.addEventListener("mouseenter", () => {
  addSelection.classList.add("hover");
});

addPolygon.addEventListener("mouseleave", () => {
  addSelection.classList.remove("hover");
});

let isMouseDown = false;

document.addEventListener("mousedown", () => {
  isMouseDown = true;
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

const TimeBar = document.getElementById("TimeBar");
const TimeLine = document.getElementById("TimeLine");

TimeBar.addEventListener("mousemove", (event) => {
  if (isMouseDown && event.clientX - 7.5 > 152.5) {
    TimeLine.style.left = `${event.clientX - 7.5}px`;
    time = event.clientX - 7.5;
    drawingInAnimation();
  }
});

fileExport();

export { worldData, ColorVariations, mod };
