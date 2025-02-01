let light_mode = 1;

let icon_angle = 0;

const circle_half_stroke = document.getElementById("circle-half-stroke");
const stroke = document.getElementById("stroke");
const width = document.getElementById("w");
const height = document.getElementById("h");
const explanation = document.getElementById("explanation");
const new_project = document.getElementById("new");
const set = document.getElementById("setting");
const block = document.getElementById("block");
const block_2 = document.getElementById("block_2");
const block_3 = document.getElementById("block_3");
const block_4 = document.getElementById("block_4");
const block_5 = document.getElementById("block_5");
const block_6 = document.getElementById("block_6");

circle_half_stroke.addEventListener("click", () => {
  icon_angle += 360;
  circle_half_stroke.style.rotate = `${icon_angle}deg`;
  light_mode *= -1;
  if (light_mode === 1) {
    document.body.style.backgroundColor = "white";
    circle_half_stroke.setAttribute("src", "./icon/sun.svg");
    block.setAttribute("src", "./icon/block.svg");
    block_2.setAttribute("src", "./icon/block_2.svg");
    block_3.setAttribute("src", "./icon/block_3.svg");
    block_4.setAttribute("src", "./icon/block_4.svg");
    block_5.setAttribute("src", "./icon/block_5.svg");
    block_6.setAttribute("src", "./icon/block_6.svg");
    stroke.style.backgroundColor = "white";
    new_project.style.color = "black";
    width.style.color = "black";
    height.style.color = "black";
    explanation.style.color = "black";
    set.style.color = "black";
  }
  if (light_mode === -1) {
    document.body.style.backgroundColor = "black";
    circle_half_stroke.setAttribute("src", "./icon/moon.svg");
    block.setAttribute("src", "./icon/block_b.svg");
    block_2.setAttribute("src", "./icon/block_2_b.svg");
    block_3.setAttribute("src", "./icon/block_3_b.svg");
    block_4.setAttribute("src", "./icon/block_4_b.svg");
    block_5.setAttribute("src", "./icon/block_5_b.svg");
    block_6.setAttribute("src", "./icon/block_6_b.svg");
    stroke.style.backgroundColor = "black";
    new_project.style.color = "white";
    width.style.color = "white";
    height.style.color = "white";
    explanation.style.color = "white";
    set.style.color = "white";
  }
});

document.getElementById("button").addEventListener("click", () => {
  document.getElementById("edit").style.display = "block";
  let x = document.getElementById("width").value * 20;
  let y = document.getElementById("height").value * 20;

  document.getElementById("home").remove();

  let worldData = [];

  let change = false;

  const WorldDataHandler = {
    set(target, property, value) {
      if (target[property] !== value) {
        change = true;
      }
      target[property] = value;
      return true;
    },
    deleteProperty(target, property) {
      if (property in target) {
        change = true;
      }
      delete target[property];
      return true;
    },
  };

  worldData = new Proxy(worldData, WorldDataHandler);

  let data = "";

  while (data.length <= x / 20) {
    data = data + "0";
  }

  for (let i = 0; i < y / 20; i++) {
    worldData.push(data);
  }

  let main_chara = 0;

  let scrollX = 0;
  let scrollY = 0;

  const canvas = document.getElementById("screen");
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = false;

  let camera_x = 0;
  let camera_y = 0;
  let camera_size = 100;

  let mode = 0;
  let mode_2 = 0;
  let flag = false;

  let mouseX = 0;
  let mouseY = 0;

  let var_length = 0;
  let text_length = 0;

  let select = false;

  let cursor = true;

  let push_point = false;

  let Mouse_Angle = 0;
  let f_Mouse_Angle = false;

  let Checkbox = false;

  let icon_push = false;

  const img_list = [];

  ctx.fillStyle = "azure";

  const trackMouse = () => {
    if (isMouseDown) {
      ctx.strokeStyle = "white";
      ctx.strokeRect(
        Math.round(click_x / 20) * 20 - scrollX,
        Math.round(click_y / 20) * 20 - scrollY,
        Math.round(
          (mouseX - rect.left - Math.round(click_x / 20) * 20 + scrollX) / 20
        ) * 20,
        Math.round(
          (mouseY - rect.top - Math.round(click_y / 20) * 20 + scrollY) / 20
        ) * 20
      );
      requestAnimationFrame(trackMouse);
    } else {
      let newChar = "";
      for (let i = deltaX - 1; i >= 0; i--) {
        newChar = newChar + "1";
      }
      for (let i = deltaY - 1; i >= 0; i--) {
        let str = worldData[Math.round(click_y / 20) + i];
        let index = Math.round(click_x / 20);
        worldData[Math.round(click_y / 20) + i] =
          str.substring(0, index) +
          newChar +
          str.substring(index + newChar.length);
      }
    }
  };

  const number_output = (point) => {
    timeline = point.length - 1;
    point.some((point_d, index_3) => {
      if (point_d.t > time) {
        timeline = index_3 - 1;
        return true;
      }
    });
  };

  const loc_output = (point) => {
    point_X =
      point[timeline].x +
      ((point[timeline + 1].x - point[timeline].x) *
        (time - point[timeline].t)) /
        (point[timeline + 1].t - point[timeline].t);
    point_Y =
      point[timeline].y +
      ((point[timeline + 1].y - point[timeline].y) *
        (time - point[timeline].t)) /
        (point[timeline + 1].t - point[timeline].t);
  };

  const isPointInPolygon = (point, vertices) => {
    let inside = false;
    const { x, y } = point;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i][0].x,
        yi = vertices[i][0].y;
      const xj = vertices[j][0].x,
        yj = vertices[j][0].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  };

  function isPointNearEdge(point, vertices, threshold = 3) {
    const { x: px, y: py } = point;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const x1 = vertices[i][0].x,
        y1 = vertices[i][0].y;
      const x2 = vertices[j][0].x,
        y2 = vertices[j][0].y;

      const L2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      if (L2 === 0) continue;

      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / L2;
      t = Math.max(0, Math.min(1, t));

      const closestX = x1 + t * (x2 - x1);
      const closestY = y1 + t * (y2 - y1);

      const distance = Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);

      if (distance <= threshold) {
        return true;
      }
    }

    return false;
  }

  let player_x = 0;
  let player_y = 0;

  let speed_x = 0;
  let speed_y = 0;

  let speed = 4;

  let gravity = 2;

  let Air_Resistance = 0.8;

  let jump = 0;

  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  let mouse_x = 0;
  let mouse_y = 0;

  let polygon_data = [];

  const draw_data = [];

  for (let j = 0; j < Math.ceil(y / 360); j++) {
    draw_data.push([]);
    for (let i = 0; i < Math.ceil(x / 600); i++) {
      const img_data = new Image();
      img_data.src = "./icon/game_b.svg";
      draw_data[draw_data.length - 1].push(img_data);
    }
  }

  const orbitData = [{ x: 240, y: 180, t: 0 }];

  const Anime_data = [];

  let ret = 0;

  const point_data = [];

  const image = new Image();
  image.src = "./icon/background-3.svg";

  let edit = 0;

  let color_b = "rgb(0, 0, 0)";
  let f_color = "rgb(0, 0, 0)";
  let s_color = "rgb(0, 0, 0)";

  let mouse_over = false;
  let mouse_over_2 = false;

  let tick = 0;

  let full_screen = false;

  let num = 0;

  let frame_n = false;

  let pointerX = 0;
  let pointerY = 0;

  let line_0;
  let line_1;

  let isMouseDown = false;
  let isMousepush = false;

  let setting = false;

  const inp = document.getElementById("inp");
  const div_4 = document.getElementById("text");
  const icon_v = document.getElementById("var");
  const div_5 = document.getElementById("icons_3");
  const img_3 = document.getElementById("icon_c");
  const img_2 = document.getElementById("icon_u");
  const h2_3 = document.getElementById("animation");
  const h2_4 = document.getElementById("gimmick");
  const div = document.getElementById("icons");
  const frame = document.getElementById("frame");
  const handle = document.getElementById("handle");
  const slider_value = document.getElementById("slider-value");
  const custom_menu = document.getElementById("custom_menu");
  let choice = document.getElementById("choice");
  const Moving_icon = document.getElementById("Moving_icon");
  const coordinate = document.getElementById("coordinate");
  const color_picker = document.getElementById("color-picker");
  const color_picker_2 = document.getElementById("color-picker-2");
  const color_picker_3 = document.getElementById("color-picker-3");
  const color_picker_4 = document.getElementById("color-picker-4");

  const rotate_arrow = new Image();
  rotate_arrow.src = "./icon/rotate_arrow.svg";
  ctx.lineWidth = 1;

  ctx.strokeStyle = "white";

  let click_point = [];

  let point_x = 0;
  let point_y = 0;

  let start_x = 0;
  let start_y = 0;

  let end_x = 0;
  let end_y = 0;

  let point_X = 0;
  let point_Y = 0;

  let touch_x = false;
  let touch_y = 0;

  let choice_x = 28;
  let choice_y = 170;

  let choice_x2 = 29;
  let choice_y2 = 311;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = 600 * dpr;
  canvas.height = 324 * dpr;

  canvas.style.width = "600px";
  canvas.style.height = "324px";

  ctx.scale(dpr, dpr);

  let timeline;

  let time = 0;

  let Time_Recording = 0;
  let gameTime = 0;

  let start = false;

  let id = 0;
  let p_id = 0;

  let caret_angle = 0;
  let center_x = 0;
  let center_y = 0;

  let Add_anime = false;

  let caret = document.getElementById("caret-right");
  let Settings_screen = document.getElementById("Settings_screen");
  let setting_element = document.getElementById("setting");
  let fill = document.getElementById("fill");
  let stroke = document.getElementById("stroke_e");

  let img = new Image();

  let drawimg = new Image();

  const md5Hash = () => {
    return CryptoJS.MD5(
      Math.random().toString(36) + Date.now().toString(36)
    ).toString();
  };

  const gameLoop = () => {
    const begin = Date.now();
    tick++;
    if (start && tick % 2 === 0) {
      time++;
      slider_value.innerHTML = time;
      handle.style.left = `${time + 20}px`;
    }
    if (edit === 0) {
      if (tick % 2 === 0) {
        ctx.clearRect(0, 0, 1280, 720);
        if (full_screen) {
          div.style.opacity = 0;
        } else {
          div.style.opacity = 1;
        }
        img_2.style.display = "none";
        img_3.style.display = "none";
        img_3.style.pointerEvents = "none";
        inp.style.pointerEvents = "none";
        if (flag) {
          gameTime++;
          if (Checkbox) {
            orbitData.some((data, index) => {
              if (data.t > gameTime) {
                scrollX =
                  orbitData[index - 1].x +
                  (data.x - orbitData[index - 1].x) *
                    ((gameTime - orbitData[index - 1].t) /
                      (data.t - orbitData[index - 1].t)) -
                  300;
                scrollY =
                  orbitData[index - 1].y +
                  (data.y - orbitData[index - 1].y) *
                    ((gameTime - orbitData[index - 1].t) /
                      (data.t - orbitData[index - 1].t)) -
                  162;
                return true;
              }
            });
          } else {
            scrollX += (player_x - scrollX - 300) * 0.1;
            scrollY += (player_y - scrollY - 162) * 0.1;
          }

          if (keys.ArrowRight) {
            speed_x += speed;
          }

          if (keys.ArrowLeft) {
            speed_x -= speed;
          }

          speed_x *= Air_Resistance;
          player_x += speed_x;
          if (
            Math.round((player_y - 10) / 20) + 1 > 0 &&
            Math.round((player_y - 10) / 20) + 1 < y / 20
          ) {
            if (
              worldData[Math.round((player_y - 10) / 20)][
                Math.round((player_x - 10) / 20) + 1
              ] === "1" ||
              worldData[Math.round((player_y - 10) / 20) + 1][
                Math.round((player_x - 10) / 20) + 1
              ] === "1"
            ) {
              player_x = Math.round(player_x / 20) * 20 - 0.1;
              speed_x = 0;
            }

            if (
              worldData[Math.round((player_y - 10) / 20)][
                Math.round((player_x - 10) / 20)
              ] === "1" ||
              worldData[Math.round((player_y - 10) / 20) + 1][
                Math.round((player_x - 10) / 20)
              ] === "1"
            ) {
              player_x = Math.round(player_x / 20) * 20 + 0.1;
              speed_x = 0;
            }
          }

          speed_y += gravity;

          if (keys.ArrowUp && jump < 10) {
            speed_y = -16 + jump;
            jump += 1;
          } else {
            jump = 10;
          }

          if (speed_y > 0) {
            for (let i = Math.floor(speed_y / 10); i > 0; i--) {
              player_y += 10;

              if (
                Math.round((player_y - 10) / 20) + 1 > 0 &&
                Math.round((player_y - 10) / 20) + 1 < y / 20
              ) {
                if (
                  worldData[Math.round((player_y - 10) / 20) + 1][
                    Math.round((player_x - 10) / 20)
                  ] === "1" ||
                  worldData[Math.round((player_y - 10) / 20) + 1][
                    Math.round((player_x - 10) / 20) + 1
                  ] === "1"
                ) {
                  player_y = Math.round(player_y / 20) * 20 - 0.1;
                  speed_y = 0;
                  jump = 0;
                }
              }
            }
            player_y += speed_y % 10;
            if (
              Math.round((player_y - 10) / 20) + 1 > 0 &&
              Math.round((player_y - 10) / 20) + 1 < y / 20
            ) {
              if (
                worldData[Math.round((player_y - 10) / 20) + 1][
                  Math.round((player_x - 10) / 20)
                ] === "1" ||
                worldData[Math.round((player_y - 10) / 20) + 1][
                  Math.round((player_x - 10) / 20) + 1
                ] === "1"
              ) {
                player_y = Math.round(player_y / 20) * 20 - 0.1;
                speed_y = 0;
                jump = 0;
              }
            }
          } else {
            for (let i = Math.floor(speed_y / -10); i > 0; i--) {
              player_y -= 10;
              if (
                Math.round((player_y - 10) / 20) + 1 > 0 &&
                Math.round((player_y - 10) / 20) + 1 < y / 20
              ) {
                if (
                  worldData[Math.round((player_y - 10) / 20)][
                    Math.round((player_x - 10) / 20)
                  ] === "1" ||
                  worldData[Math.round((player_y - 10) / 20)][
                    Math.round((player_x - 10) / 20) + 1
                  ] === "1"
                ) {
                  player_y = Math.round(player_y / 20) * 20 + 0.1;
                  speed_y = 0;
                  jump = 10;
                }
              }
            }
            player_y += speed_y % -10;
            if (
              Math.round((player_y - 10) / 20) + 1 > 0 &&
              Math.round((player_y - 10) / 20) + 1 < y / 20
            ) {
              if (
                worldData[Math.round((player_y - 10) / 20)][
                  Math.round((player_x - 10) / 20)
                ] === "1" ||
                worldData[Math.round((player_y - 10) / 20)][
                  Math.round((player_x - 10) / 20) + 1
                ] === "1"
              ) {
                player_y = Math.round(player_y / 20) * 20 + 0.1;
                speed_y = 0;
                jump = 10;
              }
            }
          }
        } else {
          player_x = 240;
          player_y = 0;
          speed_x = 0;
          speed_y = 0;
          gameTime = 0;
        }

        if (change) {
          let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360">`;
          for (let j = 0; j < 18; j++) {
            for (let i = 0; i < 30; i++) {
              if (
                Math.floor((scrollY + pointerY) / 360) * 18 + j <
                worldData.length
              ) {
                if (
                  worldData[Math.floor((scrollY + pointerY) / 360) * 18 + j][
                    Math.floor((scrollX + pointerX) / 600) * 30 + i
                  ] === "0"
                ) {
                  svg += `<rect x="${i * 20}" y="${
                    j * 20
                  }" width="20" height="20" fill="azure"/>`;
                }
                if (
                  worldData[Math.floor((scrollY + pointerY) / 360) * 18 + j][
                    Math.floor((scrollX + pointerX) / 600) * 30 + i
                  ] === "1"
                ) {
                  svg += `<rect x="${i * 20}" y="${
                    j * 20
                  }" width="20" height="20" fill="${color_b}"/>`;
                }
              }
            }
          }
          svg += "</svg>";
          let encodedSvg = encodeURIComponent(svg);
          let dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
          const img_data = new Image();
          img_data.src = dataUrl;
          img_data.onload = () => {
            draw_data[Math.floor((scrollY + pointerY) / 360)][
              Math.floor((scrollX + pointerX) / 600)
            ] = img_data;
          };
          change = false;
        }

        for (
          let j = Math.floor(scrollY / 360);
          j < Math.floor(scrollY / 360) + 2;
          j++
        ) {
          if (j <= draw_data.length - 1) {
            for (
              let i = Math.floor(scrollX / 600);
              i < Math.floor(scrollX / 600) + 2;
              i++
            ) {
              if (i >= 0 && j >= 0) {
                if (i <= draw_data[j].length - 1) {
                  ctx.drawImage(
                    draw_data[j][i],
                    i * 600 - scrollX,
                    j * 360 - scrollY,
                    600,
                    360
                  );
                }
              }
            }
          }
        }

        if (flag) {
          ctx.fillStyle = "lightblue";
          ctx.fillRect(player_x - scrollX, player_y - scrollY, 20, 20);
        }

        Anime_data.forEach((animedata) => {
          polygon_data[animedata.number].forEach((polygon) => {
            ctx.beginPath();
            let draw_number = polygon.d[0].length - 1;
            polygon.d[0].some((point_d, p_index) => {
              if (point_d.t >= time) {
                draw_number = p_index;
              }
            });
            let draw_x = 0;
            let draw_y = 0;
            if (draw_number === 0 || time > polygon.d[0][draw_number].t) {
              draw_x = polygon.d[0][draw_number].x;
              draw_y = polygon.d[0][draw_number].y;
            } else {
              draw_x =
                polygon.d[0][draw_number - 1].x +
                ((polygon.d[0][draw_number].x -
                  polygon.d[0][draw_number - 1].x) *
                  (time - polygon.d[0][draw_number - 1].t)) /
                  (polygon.d[0][draw_number].t -
                    polygon.d[0][draw_number - 1].t);
              draw_y =
                polygon.d[0][draw_number - 1].y +
                ((polygon.d[0][draw_number].y -
                  polygon.d[0][draw_number - 1].y) *
                  (time - polygon.d[0][draw_number - 1].t)) /
                  (polygon.d[0][draw_number].t -
                    polygon.d[0][draw_number - 1].t);
            }
            ctx.strokeStyle = "black";
            ctx.moveTo(
              draw_x + animedata.x - scrollX,
              draw_y + animedata.y - scrollY
            );
            polygon.d.forEach((point) => {
              draw_number = point.length - 1;
              point.some((point_d, p_index) => {
                if (point_d.t >= time) {
                  draw_number = p_index;
                }
                return true;
              });
              if (draw_number === 0 || time > point[draw_number].t) {
                draw_x = point[draw_number].x;
                draw_y = point[draw_number].y;
              } else {
                draw_x =
                  point[draw_number - 1].x +
                  ((point[draw_number].x - point[draw_number - 1].x) *
                    (time - point[draw_number - 1].t)) /
                    (point[draw_number].t - point[draw_number - 1].t);
                draw_y =
                  point[draw_number - 1].y +
                  ((point[draw_number].y - point[draw_number - 1].y) *
                    (time - point[draw_number - 1].t)) /
                    (point[draw_number].t - point[draw_number - 1].t);
              }
              ctx.lineTo(
                draw_x + animedata.x - scrollX,
                draw_y + animedata.y - scrollY
              );
            });
            if (polygon.close) {
              ctx.closePath();
            }
            ctx.stroke();
          });
        });

        if (mode === 5 && isMouseDown) {
          ctx.moveTo(
            orbitData[orbitData.length - 1].x - scrollX,
            orbitData[orbitData.length - 1].y - scrollY
          );
          ctx.lineTo(pointerX, pointerY);
          ctx.stroke();
        }
      }
      if (mode === 5) {
        ctx.strokeStyle = "gray";
        ctx.beginPath();
        ctx.moveTo(orbitData[0].x - scrollX, orbitData[0].y - scrollY);
        orbitData.forEach((data) => {
          ctx.lineTo(data.x - scrollX, data.y - scrollY);
        });
        ctx.stroke();
      }
      if (setting) {
        caret_angle += (90 - caret_angle) * 0.1;
      } else {
        caret_angle -= caret_angle * 0.1;
      }
      caret.style.transform = `rotate(${caret_angle}deg)`;
      Settings_screen.style.height = `${caret_angle * 2.5}px`;
      Settings_screen.style.display = "block";
      setting_element.style.display = "block";
      caret.style.display = "block";
      div_5.style.display = "none";
      choice.style.left = `${choice_x}px`;
      choice.style.top = `${choice_y}px`;
      fill.style.display = "none";
      stroke.style.display = "none";
    } else {
      ctx.clearRect(0, 0, 1280, 720);
      line_0 = false;
      line_1 = false;
      if (mode_2 == 2 && isMouseDown && cursor) {
        point_data.length = 0;
        ctx.setLineDash([4, 2]);
        ctx.lineDashOffset = tick;
        ctx.strokeRect(
          point_x,
          point_y,
          pointerX - point_x,
          pointerY - point_y
        );
      }
      if (!isMouseDown) {
        cursor = true;
      }

      if (!cursor && isMousepush) {
        f_Mouse_Angle = Math.asin(
          (center_y - pointerY) /
            Math.sqrt((center_x - pointerX) ** 2 + (center_y - pointerY) ** 2)
        );
        if (pointerX < center_x) {
          f_Mouse_Angle *= -1;
          f_Mouse_Angle += Math.PI;
        }
      }

      if (!cursor && isMouseDown) {
        Mouse_Angle = Math.asin(
          (center_y - pointerY) /
            Math.sqrt((center_x - pointerX) ** 2 + (center_y - pointerY) ** 2)
        );
        if (pointerX < center_x) {
          Mouse_Angle *= -1;
          Mouse_Angle += Math.PI;
        }
      }

      ctx.setLineDash([1, 0]);
      if (mode_2 == 3 && isMouseDown) {
        ctx.strokeRect(
          point_x,
          point_y,
          pointerX - point_x,
          pointerY - point_y
        );
      }
      if (frame_n !== false) {
        let top = false;
        let bottom = false;
        let left = false;
        let right = false;
        let Modified = false;
        if (!isMouseDown) {
          push_point = false;
        }
        polygon_data[frame_n].forEach((polygon, index) => {
          let polygon_d = polygon.d;
          ctx.beginPath();
          polygon_d.forEach((point, index_2) => {
            number_output(point);
            if (point.length > timeline + 1) {
              if (point[0].t <= time) {
                loc_output(point);
                if (point_data.includes(point[timeline].id)) {
                  let rotate_x = 0;
                  let rotate_y = 0;
                  let z = Math.sqrt(
                    (point_X - center_x) ** 2 + (point_Y - center_y) ** 2
                  );
                  let angle = Math.asin((point_Y - center_y) / z);
                  if (point[timeline].x < center_x) {
                    rotate_x =
                      -Math.cos(angle - f_Mouse_Angle + Mouse_Angle) * z +
                      center_x;
                    rotate_y =
                      Math.sin(angle - f_Mouse_Angle + Mouse_Angle) * z +
                      center_y;
                  } else {
                    rotate_x =
                      Math.cos(angle + f_Mouse_Angle - Mouse_Angle) * z +
                      center_x;
                    rotate_y =
                      Math.sin(angle + f_Mouse_Angle - Mouse_Angle) * z +
                      center_y;
                  }
                  if (isMouseDown || f_Mouse_Angle) {
                    point_X = rotate_x;
                    point_Y = rotate_y;
                  }
                  if (f_Mouse_Angle != false && !isMouseDown) {
                    if (point[timeline].t == time) {
                      polygon_data[frame_n][index].d[index_2][timeline].x =
                        rotate_x;
                      polygon_data[frame_n][index].d[index_2][timeline].y =
                        rotate_y;
                    } else {
                      point.some((point_d, index_3) => {
                        if (point_d.t > time) {
                          polygon_data[frame_n][index].d[index_2].splice(
                            index_3,
                            0,
                            { x: point_X, y: point_Y, k: "l", t: time, id: id }
                          );
                          id++;
                          return true;
                        }
                      });
                      if (point[point.length - 1].t < time) {
                        polygon_data[frame_n][index].d[index_2].push({
                          x: point_X,
                          y: point_Y,
                          k: "l",
                          t: time,
                          id: id,
                        });
                        id++;
                      }
                    }
                    Modified = true;
                  }
                }
                if (point_data.includes(point[timeline].id)) {
                  ctx.strokeStyle = "rgba(0, 0, 0, 0)";
                }
                if (index_2 == 0) {
                  ctx.moveTo(point_X, point_Y);
                }
                if (point[timeline].k === "l") {
                  ctx.lineTo(point_X, point_Y);
                }
                if (point[timeline].k === "q") {
                  ctx.quadraticCurveTo(
                    point[timeline].cpx,
                    point[timeline].cpy,
                    point_X,
                    point_Y
                  );
                  ctx.lineTo(point[timeline].cpx, point[timeline].cpy);
                  ctx.lineTo(point_X, point_Y);
                }
              }
            } else {
              point_X = point[timeline].x;
              point_Y = point[timeline].y;
              if (point_data.includes(point[timeline].id)) {
                let rotate_x = 0;
                let rotate_y = 0;
                let z = Math.sqrt(
                  (point_X - center_x) ** 2 + (point_Y - center_y) ** 2
                );
                let angle = Math.asin((point_Y - center_y) / z);
                if (point[timeline].x < center_x) {
                  rotate_x =
                    -Math.cos(angle - f_Mouse_Angle + Mouse_Angle) * z +
                    center_x;
                  rotate_y =
                    Math.sin(angle - f_Mouse_Angle + Mouse_Angle) * z +
                    center_y;
                } else {
                  rotate_x =
                    Math.cos(angle + f_Mouse_Angle - Mouse_Angle) * z +
                    center_x;
                  rotate_y =
                    Math.sin(angle + f_Mouse_Angle - Mouse_Angle) * z +
                    center_y;
                }
                if (isMouseDown || f_Mouse_Angle) {
                  point_X = rotate_x;
                  point_Y = rotate_y;
                }
                if (f_Mouse_Angle != false && !isMouseDown) {
                  if (point[timeline].t == time) {
                    polygon_data[frame_n][index].d[index_2][timeline].x =
                      rotate_x;
                    polygon_data[frame_n][index].d[index_2][timeline].y =
                      rotate_y;
                  } else {
                    point.some((point_d, index_3) => {
                      if (point_d.t > time) {
                        polygon_data[frame_n][index].d[index_2].splice(
                          index_3,
                          0,
                          { x: point_X, y: point_Y, k: "l", t: time, id: id }
                        );
                        id++;
                        return true;
                      }
                    });
                    if (point[point.length - 1].t < time) {
                      polygon_data[frame_n][index].d[index_2].push({
                        x: point_X,
                        y: point_Y,
                        k: "l",
                        t: time,
                        id: id,
                      });
                      id++;
                    }
                  }
                  Modified = true;
                }
              }
              if (index_2 == 0) {
                ctx.moveTo(point_X, point_Y);
              }
              if (point[timeline].k === "l") {
                ctx.lineTo(point_X, point_Y);
              }
              if (point[timeline].k === "q") {
                ctx.quadraticCurveTo(
                  point[timeline].cpx,
                  point[timeline].cpy,
                  point_X,
                  point_Y
                );
                ctx.lineTo(point[timeline].cpx, point[timeline].cpy);
                ctx.lineTo(point_X, point_Y);
                if (
                  (isMouseDown &&
                    point[timeline].cpx > pointerX - 5 &&
                    point[timeline].cpx < pointerX + 5 &&
                    point[timeline].cpy > pointerY - 5 &&
                    point[timeline].cpy < pointerY + 5) ||
                  push_point === point[timeline].id
                ) {
                  push_point = point[timeline].id;
                  polygon_data[frame_n][index].d[index_2][timeline].cpx =
                    pointerX;
                  polygon_data[frame_n][index].d[index_2][timeline].cpy =
                    pointerY;
                }
              }
            }
          });

          if (Modified) {
            f_Mouse_Angle = false;
          }

          if (polygon.close) {
            ctx.closePath();
          }

          ctx.fillStyle = polygon.f_color;
          ctx.fill();

          if (
            isPointNearEdge({ x: pointerX, y: pointerY }, polygon_d) &&
            mode_2 == 4
          ) {
            ctx.strokeStyle = s_color;
            ctx.stroke();
            if (isMouseDown) {
              polygon_data[frame_n][index].s_color = s_color;
            }
          } else {
            if (polygon.s_color != false) {
              ctx.strokeStyle = polygon.s_color;
              ctx.stroke();
            }
            if (
              isPointInPolygon({ x: pointerX, y: pointerY }, polygon_d) &&
              mode_2 == 4
            ) {
              ctx.fillStyle = f_color;
              ctx.fill();
              if (isMouseDown) {
                polygon_data[frame_n][index].f_color = f_color;
              }
            }
          }
          if (mode_2 == 1) {
            touch_x = false;
            polygon_d.forEach((point, index_2) => {
              number_output(point);
              if (point.length > timeline + 1) {
                if (point[0].t <= time) {
                  loc_output(point);
                  if (
                    Math.sqrt(
                      (pointerX - point_X) ** 2 + (pointerY - point_Y) ** 2
                    ) <= 5
                  ) {
                    ctx.strokeStyle = "rgb(99, 255, 250)";
                    ctx.beginPath();
                    ctx.arc(point_X, point_Y, 5, 0, Math.PI * 2, true);
                    ctx.stroke();
                    if (isMousepush) {
                      click_point.push([index, index_2]);
                    }
                  }
                }
              } else {
                if (
                  Math.sqrt(
                    (pointerX - point[timeline].x) ** 2 +
                      (pointerY - point[timeline].y) ** 2
                  ) <= 5
                ) {
                  ctx.strokeStyle = "rgb(99, 255, 250)";
                  ctx.beginPath();
                  ctx.arc(
                    point[timeline].x,
                    point[timeline].y,
                    5,
                    0,
                    Math.PI * 2,
                    true
                  );
                  touch_x = point[timeline].x;
                  touch_y = point[timeline].y;
                  select = [index, index_2, timeline];
                  ctx.stroke();
                  if (isMousepush) {
                    click_point.push([index, index_2]);
                  }
                }
              }
            });
            click_point.forEach((data3) => {
              let point_dl = polygon_data[frame_n][data3[0]].d[data3[1]];
              if (point_dl[0] > time) {
                polygon_data[frame_n][data3[0]].d[data3[1]].unshift({
                  x: pointerX,
                  y: pointerY,
                  k: "l",
                  t: time,
                  id: id,
                });
                id++;
              } else {
                if (point_dl[point_dl.length - 1].t < time) {
                  polygon_data[frame_n][data3[0]].d[data3[1]].push({
                    x: pointerX,
                    y: pointerY,
                    k: "l",
                    t: time,
                    id: id,
                  });
                  id++;
                } else {
                  point_dl.some((point_d, index_4) => {
                    if (point_d.t == time) {
                      polygon_data[frame_n][data3[0]].d[data3[1]][index_4] = {
                        x: pointerX,
                        y: pointerY,
                        k: polygon_data[frame_n][data3[0]].d[data3[1]][index_4]
                          .k,
                        t: time,
                        id: id,
                      };
                      id++;
                      return true;
                    }
                    if (point_d.t > time) {
                      polygon_data[frame_n][data3[0]].d[data3[1]].splice(
                        index_4,
                        0,
                        {
                          x: pointerX,
                          y: point_y,
                          k: "l",
                          t: time,
                          id: id,
                        }
                      );
                      id++;
                      return true;
                    }
                  });
                }
              }
            });
          }
          if (mode_2 == 2) {
            let polygon_d = polygon.d;
            polygon_d.forEach((point) => {
              number_output(point);
              if (point.length > timeline + 1) {
                if (point[0].t <= time) {
                  loc_output(point);
                  if (point_data.includes(point[timeline].id)) {
                    if (point_X < left || left == false) {
                      left = point_X;
                    }
                    if (point_X > right || right == false) {
                      right = point_X;
                    }
                    if (point_Y < top || top == false) {
                      top = point_Y;
                    }
                    if (point_Y > bottom || bottom == false) {
                      bottom = point_Y;
                    }
                    ctx.strokeStyle = "rgb(99, 255, 250)";
                    ctx.beginPath();
                    ctx.moveTo(point_X, point_Y);
                    ctx.arc(point_X, point_Y, 5, 0, Math.PI * 2, true);
                    ctx.stroke();
                  }
                }
              } else {
                point_X = point[timeline].x;
                point_Y = point[timeline].y;
                if (point_data.includes(point[timeline].id)) {
                  if (point_X < left || left == false) {
                    left = point_X;
                  }
                  if (point_X > right || right == false) {
                    right = point_X;
                  }
                  if (point_Y < top || top == false) {
                    top = point_Y;
                  }
                  if (point_Y > bottom || bottom == false) {
                    bottom = point_Y;
                  }
                  ctx.strokeStyle = "rgb(99, 255, 250)";
                  ctx.beginPath();
                  ctx.moveTo(point_X, point_Y);
                  ctx.arc(point_X, point_Y, 5, 0, Math.PI * 2, true);
                  ctx.stroke();
                }
              }
              if (isMouseDown) {
                if (point_x < pointerX) {
                  if (point_y < pointerY) {
                    if (
                      point_x < point_X &&
                      pointerX > point_X &&
                      point_y < point_Y &&
                      pointerY > point_Y
                    ) {
                      if (!point_data.includes(point[timeline].id)) {
                        point_data.push(point[timeline].id);
                      }
                    }
                  } else {
                    if (
                      point_x < point_X &&
                      pointerX > point_X &&
                      pointerY < point_Y &&
                      point_y > point_Y
                    ) {
                      if (!point_data.includes(point[timeline].id)) {
                        point_data.push(point[timeline].id);
                      }
                    }
                  }
                } else {
                  if (point_y < pointerY) {
                    if (
                      pointerX < point_X &&
                      point_x > point_X &&
                      point_y < point_Y &&
                      pointerY > point_Y
                    ) {
                      if (!point_data.includes(point[timeline].id)) {
                        point_data.push(point[timeline].id);
                      }
                    }
                  } else {
                    if (
                      pointerX < point_X &&
                      point_x > point_X &&
                      pointerY < point_Y &&
                      point_y > point_Y
                    ) {
                      if (!point_data.includes(point[timeline].id)) {
                        point_data.push(point[timeline].id);
                      }
                    }
                  }
                }
              }
            });
          }
          if (mode_2 == 0) {
            if (
              Math.sqrt(
                (point_x - polygon_d[0][0].x) ** 2 +
                  (point_y - polygon_d[0][0].y) ** 2
              ) <= 5
            ) {
              line_0 = [index, true];
              start_x = polygon_d[0][0].x;
              start_y = polygon_d[0][0].y;
            }
            if (
              Math.sqrt(
                (point_x - polygon_d[polygon_d.length - 1][0].x) ** 2 +
                  (point_y - polygon_d[polygon_d.length - 1][0].y) ** 2
              ) <= 5
            ) {
              line_0 = [index, false];
              start_x = polygon_d[polygon_d.length - 1][0].x;
              start_y = polygon_d[polygon_d.length - 1][0].y;
            }

            if (
              Math.sqrt(
                (pointerX - polygon_d[0][0].x) ** 2 +
                  (pointerY - polygon_d[0][0].y) ** 2
              ) <= 5
            ) {
              ctx.strokeStyle = "rgb(99, 255, 250)";
              ctx.beginPath();
              ctx.arc(
                polygon_d[0][0].x,
                polygon_d[0][0].y,
                5,
                0,
                Math.PI * 2,
                true
              );
              ctx.stroke();
              line_1 = [index, true];
              end_x = polygon_d[0][0].x;
              end_y = polygon_d[0][0].y;
            }
            if (
              Math.sqrt(
                (pointerX - polygon_d[polygon_d.length - 1][0].x) ** 2 +
                  (pointerY - polygon_d[polygon_d.length - 1][0].y) ** 2
              ) <= 5
            ) {
              ctx.strokeStyle = "rgb(99, 255, 250)";
              ctx.beginPath();
              ctx.arc(
                polygon_d[polygon_d.length - 1][0].x,
                polygon_d[polygon_d.length - 1][0].y,
                5,
                0,
                Math.PI * 2,
                true
              );
              ctx.stroke();
              line_1 = [index, false];
              end_x = polygon_d[polygon_d.length - 1][0].x;
              end_y = polygon_d[polygon_d.length - 1][0].y;
            }
          }
        });
        if (point_data.length != 0 && !isMouseDown) {
          ctx.strokeRect(left, top, right - left, bottom - top);
          ctx.beginPath();
          ctx.moveTo((left + right) / 2, bottom);
          ctx.lineTo((left + right) / 2, bottom + 20);
          ctx.stroke();
          ctx.drawImage(
            rotate_arrow,
            (left + right) / 2 - 10,
            bottom + 15,
            20,
            10
          );
          if (
            pointerX > (left + right) / 2 - 10 &&
            pointerX < (left + right) / 2 + 10 &&
            pointerY > bottom + 10 &&
            pointerY < bottom + 30
          ) {
            document.body.style.cursor = "pointer";
            cursor = false;
            center_x = (left + right) / 2;
            center_y = (top + bottom) / 2;
          } else {
            document.body.style.cursor = "default";
          }
        }
        isMousepush = false;
        if (isMouseDown && mode_2 == 0) {
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.moveTo(start_x, start_y);
          ctx.lineTo(end_x, end_y);
          ctx.stroke();
        }
      }

      div.style.opacity = 0;
      inp.style.pointerEvents = "all";
      h2_3.style.opacity = 1;
      img_3.style.pointerEvents = "all";
      if (!full_screen) {
        img_2.style.display = "block";
        img_3.style.display = "block";
        div_5.style.display = "inline";
      } else {
        img_2.style.display = "none";
        img_3.style.display = "none";
        div_5.style.display = "none";
      }
      choice.style.left = `${choice_x2}px`;
      choice.style.top = `${choice_y2}px`;
      Settings_screen.style.display = "none";
      setting_element.style.display = "none";
      caret.style.display = "none";
      fill.style.display = "block";
      stroke.style.display = "block";
    }

    if (mouse_x <= 150 && mouse_x <= 200 && mouse_y >= 150 && mouse_y <= 200) {
      let upload = document.getElementById("icon_6");
      upload.getAttribute("width", "50px");
      upload.getAttribute("height", "50px");
    }

    if (main_chara !== 0 && edit === 1) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          ctx.drawImage(
            image,
            ((((-canvas.clientWidth / 2 +
              canvas.clientWidth * i * 4 -
              camera_x) *
              camera_size) /
              100) %
              (canvas.clientWidth * 2)) +
              canvas.clientWidth / 2,
            ((((-canvas.clientHeight / 2 + 600 * j * 4 - camera_y) *
              camera_size) /
              100) %
              (canvas.clientHeight * 2)) +
              canvas.clientHeight / 2,
            (canvas.clientWidth * camera_size) / 10,
            (canvas.clientHeight * camera_size) / 10
          );
        }
      }
    }
    icon_click = false;

    if (mouse_over || var_length > 1) {
      mouse_over_2 =
        100 < mouse_x &&
        110 + var_length > mouse_x &&
        260 < mouse_y &&
        text_length + 325 > mouse_y;
    }

    if (mouse_over || mouse_over_2) {
      var_length += (165 - var_length) * 0.1;
      if (var_length > 150) {
        text_length += (240 - text_length) * 0.1;
        div_4.style.opacity = 1;
      }
      h2_3.style.pointerEvents = "all";
      img_3.style.transform = "rotate(135deg)";
      img_3.style.top = "235px";
      img_3.style.left = "50px";
      img_3.style.width = "60px";
      img_3.style.height = "60px";
    } else {
      if (text_length < 1) {
        var_length -= var_length * 0.1;
        div_4.style.opacity = 0;
      }
      text_length -= text_length * 0.3;
      img_3.style.transform = "rotate(0deg)";
      img_3.style.top = "245px";
      img_3.style.left = "60px";
      img_3.style.width = "40px";
      img_3.style.height = "40px";
    }

    icon_v.style.width = `${Math.round(var_length)}px`;
    div_4.style.height = `${text_length}px`;
    h2_3.style.top = `${text_length - 240}px`;
    h2_4.style.top = `${text_length - 200}px`;

    if (text_length > 160) {
      h2_3.style.clipPath = `inset(0 ${100 - (text_length - 200) * 2.5}% 0 ${
        100 - (text_length - 200) * 2.5
      }%)`;
      h2_4.style.clipPath = `inset(0 ${100 - (text_length - 200) * 2.5}% 0 ${
        100 - (text_length - 200) * 2.5
      }%)`;
    } else {
      h2_3.style.clipPath = `inset(100% 100% 100% 100%)`;
      h2_4.style.clipPath = `inset(100% 100% 100% 100%)`;
    }

    const compress = document.getElementById("compress").classList;

    if (full_screen) {
      let otherElements = document.querySelectorAll(
        "body > *:not(#screen):not(#compress)"
      );
      compress.remove("hidden");
      otherElements.forEach((data) => {
        data.classList.add("hidden");
      });
    } else {
      compress.add("hidden");
    }

    if (!isMouseDown_2) {
      icon_push = false;
    }

    if (icon_push !== false) {
      Moving_icon.style.left = `${mouse_x - 25}px`;
      Moving_icon.style.top = `${mouse_y - 25}px`;
      coordinate.style.left = `${mouse_x + 30}px`;
      coordinate.style.top = `${mouse_y - 60}px`;
      coordinate.textContent = `x:${mouse_x - 940}, y:${mouse_y - 327}`;
      Moving_icon.style.display = "block";
      if (mouse_x > 640 && mouse_x < 1240 && mouse_y > 165 && mouse_y < 490) {
        coordinate.style.display = "block";
        Add_anime = icon_push;
      } else {
        coordinate.style.display = "none";
      }
    } else {
      Moving_icon.style.display = "none";
      coordinate.style.display = "none";
      if (Add_anime !== false) {
        Anime_data.push({
          x: mouse_x + scrollX - 940,
          y: mouse_y + scrollY - 327,
          number: Number(Add_anime),
        });
        Add_anime = false;
      }
    }
    const end = Date.now();
    setTimeout(gameLoop, 16 - (end - begin));
  };

  let click_x = 0;
  let click_y = 0;
  let click_x2 = 0;
  let click_y2 = 0;
  let deltaX = 0;
  let deltaY = 0;
  let rect = canvas.getBoundingClientRect();

  canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      isMouseDown = true;
      isMousepush = true;
    }
    point_x = event.pageX - rect.left;
    point_y = event.pageY - rect.top;
    start_x = point_x;
    start_y = point_y;
    click_x = event.pageX - rect.left + scrollX;
    click_y = event.pageY - rect.top + scrollY;
    click_x2 = ((event.pageX - rect.left) / camera_size) * 100 + camera_x;
    click_y2 = ((event.pageY - rect.top) / camera_size) * 100 + camera_y;
  });

  canvas.addEventListener("mouseup", () => {
    click_point = [];
    if (edit === 1) {
      if (mode_2 == 0 && polygon_data.length > 0 && isMouseDown) {
        if (line_0 == false && line_1 == false) {
          polygon_data[frame_n].push({
            d: [
              [
                {
                  x: point_x,
                  y: point_y,
                  k: "l",
                  t: time,
                  id: id,
                },
              ],
              [
                {
                  x: pointerX,
                  y: pointerY,
                  k: "l",
                  t: time,
                  id: id + 1,
                },
              ],
            ],
            close: false,
            f_color: "rgba(0, 0, 0, 0)",
            s_color: "white",
            id: p_id,
          });
          id += 2;
          p_id++;
        } else {
          if (line_1 == false) {
            if (line_0[1]) {
              polygon_data[frame_n][line_0[0]].d.unshift([
                {
                  x: pointerX,
                  y: pointerY,
                  k: "l",
                  t: time,
                  id: id,
                },
              ]);
              id++;
            } else {
              polygon_data[frame_n][line_0[0]].d.push([
                {
                  x: pointerX,
                  y: pointerY,
                  k: "l",
                  t: time,
                  id: id,
                },
              ]);
              id++;
            }
          } else {
            if (line_0 == false) {
              if (line_1[1]) {
                polygon_data[frame_n][line_1[0]].d.unshift([
                  {
                    x: point_x,
                    y: point_y,
                    k: "l",
                    t: time,
                    id: id,
                  },
                ]);
                id++;
              } else {
                polygon_data[frame_n][line_1[0]].d.push([
                  {
                    x: point_x,
                    y: point_y,
                    k: "l",
                    t: time,
                    id: id,
                  },
                ]);
                id++;
              }
            } else {
              if (line_0[0] == line_1[0]) {
                polygon_data[frame_n][line_0[0]].close = true;
              } else {
                if (line_0[1]) {
                  if (line_1[1]) {
                    polygon_data[frame_n][line_0[0]].d.unshift(
                      ...[...polygon_data[frame_n][line_1[0]].d].reverse()
                    );
                    polygon_data[frame_n].splice(line_1[0], 1);
                  } else {
                    polygon_data[frame_n][line_0[0]].d.unshift(
                      ...polygon_data[frame_n][line_1[0]].d
                    );
                    polygon_data[frame_n].splice(line_1[0], 1);
                  }
                } else {
                  if (line_1[1]) {
                    polygon_data[frame_n][line_0[0]].d.push(
                      ...polygon_data[frame_n][line_1[0]].d
                    );
                    polygon_data[frame_n].splice(line_1[0], 1);
                  } else {
                    polygon_data[frame_n][line_0[0]].d.push(
                      ...[...polygon_data[frame_n][line_1[0]].d].reverse()
                    );
                    polygon_data[frame_n].splice(line_1[0], 1);
                  }
                }
              }
            }
          }
        }
      }
      if (mode_2 == 3 && polygon_data.length > 0) {
        polygon_data[frame_n].push({
          d: [
            [{ x: point_x, y: point_y, k: "l", t: 0, id: id }],
            [{ x: pointerX, y: point_y, k: "l", t: 0, id: id + 1 }],
            [{ x: pointerX, y: pointerY, k: "l", t: 0, id: id + 2 }],
            [{ x: point_x, y: pointerY, k: "l", t: 0, id: id + 3 }],
            [{ x: point_x, y: point_y, k: "l", t: 0, id: id + 4 }],
          ],
          close: true,
          f_color: "rgba(0, 0, 0, 0)",
          s_color: "white",
          id: p_id,
        });
        id += 5;
        p_id += 1;
      }
    }
    if (mode === 5) {
      Time_Recording += 90;
      orbitData.push({
        x: pointerX + scrollX,
        y: pointerY + scrollY,
        t: Time_Recording,
      });
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    pointerX = event.pageX - rect.left;
    pointerY = event.pageY - rect.top;
    end_x = pointerX;
    end_y = pointerY;
    if (isMouseDown) {
      if (mode === 0 && edit === 0) {
        scrollX = click_x - event.pageX + rect.left;
        scrollY = click_y - event.pageY + rect.top;
        camera_x = click_x2 - ((event.pageX - rect.left) / camera_size) * 100;
        camera_y = click_y2 - ((event.pageY - rect.top) / camera_size) * 100;
      }
      if (
        mode === 1 &&
        event.pageX - rect.left + scrollX - 10 < x &&
        event.pageY - rect.top + scrollY < y - 20 &&
        event.pageX - rect.left + scrollX - 10 > 0 &&
        event.pageY - rect.top + scrollY > 0
      ) {
        let w_data =
          worldData[Math.round((event.pageY - rect.top + scrollY - 10) / 20)];
        worldData[Math.round((event.pageY - rect.top + scrollY - 10) / 20)] =
          w_data.substring(0, (event.pageX - rect.left + scrollX) / 20) +
          "1" +
          w_data.substring((event.pageX - rect.left + scrollX) / 20 + 1);
      }
      if (
        mode === 2 &&
        event.pageX - rect.left + scrollX - 10 < x &&
        event.pageY - rect.top + scrollY < y - 20 &&
        event.pageX - rect.left + scrollX - 10 > 0 &&
        event.pageY - rect.top + scrollY > 0
      ) {
        let rowData =
          worldData[Math.round((event.pageY - rect.top + scrollY - 10) / 20)];
        worldData[Math.round((event.pageY - rect.top + scrollY - 10) / 20)] =
          rowData.substring(0, (event.pageX - rect.left + scrollX) / 20) +
          "0" +
          rowData.substring((event.pageX - rect.left + scrollX) / 20 + 1);
      }
      if (
        mode === 3 &&
        event.pageX - rect.left + scrollX - 10 <= x &&
        event.pageY - rect.top + scrollY < y &&
        event.pageX - rect.left + scrollX - 10 >= 0 &&
        event.pageY - rect.top + scrollY >= 0
      ) {
        mouseX = event.pageX;
        mouseY = event.pageY;
        deltaX = -Math.round(
          (click_x - event.pageX + rect.left - scrollX) / 20
        );
        deltaY = -Math.round((click_y - event.pageY + rect.top - scrollY) / 20);
        trackMouse();
      }
    }
  });

  document.addEventListener("click", () => {
    custom_menu.style.display = "none";
  });

  canvas.addEventListener("contextmenu", () => {
    if (touch_x != false) {
      custom_menu.style.display = "block";
      custom_menu.style.top = `${touch_y + 165}px`;
      custom_menu.style.left = `${touch_x + 640}px`;
      record_x = touch_x;
      record_y = touch_y;
    }
  });

  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  document.addEventListener("keydown", (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = true;
    }
    if (event.ctrlKey || event.metaKey) {
      if (event.key === "z" || event.key === "Z") {
        if (event.shiftKey) {
          if (ret > 0) {
            ret--;
          }
        } else {
          if (ret < 10) {
            ret++;
          }
        }
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = false;
    }
  });

  document.getElementById("icon_0").addEventListener("click", () => {
    mode = 0;
    choice_x = 28;
    choice_y = 170;
  });

  document.getElementById("icon_1").addEventListener("click", () => {
    mode = 1;
    choice_x = 91;
    choice_y = 170;
  });

  document.getElementById("icon_2").addEventListener("click", () => {
    mode = 2;
    choice_x = 30;
    choice_y = 246;
  });

  document.getElementById("icon_3").addEventListener("click", () => {
    mode = 3;
    choice_x = 91;
    choice_y = 246;
  });

  document.getElementById("icon_4").addEventListener("click", () => {
    mode = 4;
    choice_x = 30;
    choice_y = 322;
  });

  document.getElementById("icon_12").addEventListener("click", () => {
    mode = 5;
    choice_x = 91;
    choice_y = 322;
  });

  document.getElementById("icon_5").addEventListener("click", () => {
    flag = !flag;
  });

  document.getElementById("icon_u").addEventListener("click", () => {
    let new_img = document.createElement("img");
  });

  document.getElementById("expand").addEventListener("click", () => {
    full_screen = true;
    canvas.setAttribute("width", "900px");
    canvas.setAttribute("height", "486px");
    canvas.style.top = "80px";
    canvas.style.left = "182.5px";
  });

  document.getElementById("caret-right").addEventListener("click", () => {
    setting = !setting;
  });

  document.getElementById("Auto-scroll").addEventListener("change", (event) => {
    if (event.target.checked) {
      Checkbox = true;
    } else {
      Checkbox = false;
    }
  });

  const click_e = [];

  const icon_c = (id) => {
    let icon_e = document.getElementById(id);
    const elements = document.querySelectorAll(".select");
    elements.forEach((data) => {
      data.classList.remove("select");
    });
    frame_n = id;
    icon_e.classList.add("select");
    click_e.push([
      icon_e.addEventListener("click", () => {
        const elements = document.querySelectorAll(".select");
        elements.forEach((data) => {
          data.classList.remove("select");
        });
        frame_n = id;
        icon_e.classList.add("select");
      }),
      icon_e.addEventListener("mousemove", () => {
        if (isMouseDown_2) {
          icon_e.style.opacity = 0;
          icon_push = icon_e.id;
        }
      }),
      icon_e.addEventListener("mouseout", () => {
        icon_e.style.opacity = 1;
      }),
    ]);
    click_e[click_e.length - 1];
  };

  document.getElementById("slider").addEventListener("mousemove", (event) => {
    if (isMouseDown_2) {
      time = event.clientX - 20;
      handle.style.left = `${event.clientX}px`;
      slider_value.innerHTML = time;
      point_data.length = 0;
    }
  });

  document.getElementById("animation").addEventListener("click", () => {
    let div_e = document.createElement("div");
    div_e.setAttribute("class", "svg");
    div_e.setAttribute("id", num);
    frame.appendChild(div_e);
    icon_c(num);
    num++;
    polygon_data.push([]);
  });

  document.getElementById("icon_c").addEventListener("mouseover", () => {
    mouse_over = true;
  });

  document.getElementById("icon_c").addEventListener("mouseout", () => {
    mouse_over = false;
  });

  document.getElementById("world").addEventListener("click", () => {
    edit = 0;
  });

  document.getElementById("polygon").addEventListener("click", () => {
    edit = 1;
  });

  document.getElementById("icon_7").addEventListener("click", () => {
    mode_2 = 0;
    choice_x2 = 29;
    choice_y2 = 311;
  });

  document.getElementById("icon_8").addEventListener("click", () => {
    mode_2 = 1;
    choice_x2 = 89;
    choice_y2 = 311;
  });

  document.getElementById("icon_9").addEventListener("click", () => {
    mode_2 = 2;
    choice_x2 = 29;
    choice_y2 = 382;
  });

  document.getElementById("icon_10").addEventListener("click", () => {
    mode_2 = 3;
    choice_x2 = 89;
    choice_y2 = 382;
  });

  document.getElementById("icon_11").addEventListener("click", () => {
    mode_2 = 4;
    choice_x2 = 29;
    choice_y2 = 441;
  });

  document.getElementById("linear").addEventListener("click", () => {
    custom_menu.style.display = "none";
    polygon_data[frame_n][select[0]].d[select[1]][select[2]].k = "l";
  });

  document.getElementById("Linear-Out").addEventListener("click", () => {
    custom_menu.style.display = "none";
    let p_data = polygon_data[frame_n][select[0]].d[select[1]][select[2]];
    let p_data_2 = 0;
    if (select[1] === 0) {
      if (polygon_data[frame_n][select[0]].d[1].length - 1 > select[2]) {
        p_data_2 = polygon_data[frame_n][select[0]].d[1][select[2]];
        console.log(1);
      } else {
        p_data_2 =
          polygon_data[frame_n][select[0]].d[1][
            polygon_data[frame_n][select[0]].d[1].length - 1
          ];
        console.log(2);
      }
    } else {
      if (
        polygon_data[frame_n][select[0]].d[select[1] - 1].length - 1 >
        select[2]
      ) {
        p_data_2 = polygon_data[frame_n][select[0]].d[select[1] - 1][select[2]];
        console.log(3);
      } else {
        p_data_2 =
          polygon_data[frame_n][select[0]].d[select[1] - 1][
            polygon_data[frame_n][select[0]].d[select[1] - 1].length - 1
          ];
        console.log(4);
      }
    }
    let distance = Math.sqrt(
      (p_data.x - p_data_2.x) ** 2 + (p_data.y - p_data_2.y) ** 2
    );
    let angle = Math.asin((p_data.y - p_data_2.y) / distance);
    polygon_data[frame_n][select[0]].d[select[1]][select[2]].k = "q";
    polygon_data[frame_n][select[0]].d[select[1]][select[2]].cpx =
      p_data.x + Math.sin(angle + 45) * 100;
    polygon_data[frame_n][select[0]].d[select[1]][select[2]].cpy =
      p_data.y + Math.sin(angle + 45) * 100;
  });

  document.getElementById("gravity").addEventListener("input", () => {
    gravity = Number(document.getElementById("gravity").value);
  });

  document.getElementById("Player-speed").addEventListener("input", () => {
    speed = Number(document.getElementById("Player-speed").value);
  });

  document.getElementById("Air-Resistance").addEventListener("input", () => {
    Air_Resistance = Number(document.getElementById("Air-Resistance").value);
  });

  let isMouseDown_2 = false;

  let click_x3 = 0;
  let click_y3 = 0;

  document.addEventListener("mousedown", (event) => {
    mouse_x = event.pageX;
    mouse_y = event.pageY;
    isMouseDown_2 = true;
    img_list.forEach((data, index) => {
      let ic = data.getBoundingClientRect();
      if (
        mouse_x <= ic.right &&
        mouse_x >= ic.left &&
        mouse_y <= ic.bottom &&
        mouse_y >= ic.top &&
        isMouseDown_2
      ) {
        click_x3 =
          Number(data.style.left.slice(0, data.style.left.length - 2)) -
          mouse_x;
        click_y3 =
          Number(data.style.top.slice(0, data.style.top.length - 2)) - mouse_y;
      }
    });
  });

  document.addEventListener("mouseup", () => {
    isMouseDown = false;
    isMousepush = false;
    isMouseDown_2 = false;
  });

  document.addEventListener("mousemove", (event) => {
    mouse_x = event.pageX;
    mouse_y = event.pageY;
    img_list.forEach((data, index) => {
      let ic = data.getBoundingClientRect();
      if (
        mouse_x <= ic.right &&
        mouse_x >= ic.left &&
        mouse_y <= ic.bottom &&
        mouse_y >= ic.top &&
        isMouseDown_2
      ) {
        img_list[index].style.left = `${mouse_x + click_x3}px`;
        img_list[index].style.top = `${mouse_y + click_y3}px`;
        icon_click = true;
      } else {
        img_list[index].style.left = "0px";
        img_list[index].style.top = `${data.id * 90 + 83}px`;
      }
    });
  });

  window.addEventListener("wheel", (event) => {
    if (camera_size > 20 || event.deltaY < 0) {
      camera_size -= (event.deltaY * camera_size) / 1000;
      if (camera_size <= 20) {
        camera_size = 20;
      }
    }
  });

  let count = 0;

  inp.addEventListener("change", (event) => {
    let img = document.createElement("img");
    img.setAttribute("width", "40px");
    img.setAttribute("height", "40px");
    img.setAttribute("class", "icon_3");
    img.style.top = `${count * 90 + 83}px`;
    img.setAttribute("id", count);
    if (main_chara === 0) {
      main_chara = img;
    }
    img_list.push(img);
    div_2.appendChild(img_list[img_list.length - 1]);
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      img_list[img_list.length - 1].src = reader.result;
    };
    reader.readAsDataURL(file);
    count++;
  });

  $(document).ready(function () {
    $("#color-picker").spectrum({
      showInput: true,
      showInitial: true,
      preferredFormat: "rgb",
      change: function (color) {
        canvas.style.backgroundColor = color.toRgbString();
      },
    });

    $("#color-picker-2").spectrum({
      showInput: true,
      showInitial: true,
      preferredFormat: "rgb",
      change: function (color) {
        color_b = color.toRgbString();
        change = true;
      },
    });

    $("#color-picker-3").spectrum({
      showInput: true,
      showInitial: true,
      preferredFormat: "rgb",
      change: function (color) {
        f_color = color.toRgbString();
      },
    });

    $("#color-picker-4").spectrum({
      showInput: true,
      showInitial: true,
      preferredFormat: "rgb",
      change: function (color) {
        s_color = color.toRgbString();
      },
    });
  });
  const toggleBtn = document.getElementById("toggle-btn");

  toggleBtn.addEventListener("click", () => {
    start = !start;
  });

  const svg_data = [
    [
      "0.svg",
      `<svg version="1.1" width="2" height="2" viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Exported by Scratch - http://scratch.mit.edu/ -->
    </svg><!--rotationCenter:0:0-->`,
    ],
    [
      "757061eae980f49194cd8cabc54f8b41.svg",
      `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0,0,20,20"><g transform="translate(-230,-170)"><g fill="#808080" stroke="none" stroke-miterlimit="10"><path d="M230,190v-20h20v20z"/></g></g></svg><!--rotationCenter:10:10-->`,
    ],
    [
      "",
      `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="480" height="360" viewBox="0,0,480,360"><g fill="none" stroke="none" stroke-width="0.5" stroke-miterlimit="10"><image x="0" y="0" transform="scale(0.5,0.5)" width="960" height="720" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAALQCAYAAABfdxm0AAAAAXNSR0IArs4c6QAAIABJREFUeF7t10ENADAMA7GWP+hNGoydyyBOP9mZOeMIECBAgAABAgQIECBAgMDnAmsAf96weAQIECBAgAABAgQIECDwBAxgj0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgV2r3QAAAUr0lEQVQIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQICAAewHCBAgQIAAAQIECBAgQCAhYAAnahaSAAECBAgQIECAAAECBAxgP0CAAAECBAgQIECAAAECCQEDOFGzkAQIECBAgAABAgQIECBgAPsBAgQIECBAgAABAgQIEEgIGMCJmoUkQIAAAQIECBAgQIAAAQPYDxAgQIAAAQIECBAgQIBAQsAATtQsJAECBAgQIECAAAECBAgYwH6AAAECBAgQIECAAAECBBICBnCiZiEJECBAgAABAgQIECBAwAD2AwQIECBAgAABAgQIECCQEDCAEzULSYAAAQIECBAgQIAAAQIGsB8gQIAAAQIECBAgQIAAgYSAAZyoWUgCBAgQIECAAAECBAgQMID9AAECBAgQIECAAAECBAgkBAzgRM1CEiBAgAABAgQIECBAgIAB7AcIECBAgAABAgQIECBAICFgACdqFpIAAQIECBAgQIAAAQIEDGA/QIAAAQIECBAgQIAAAQIJAQM4UbOQBAgQIECAAAECBAgQIGAA+wECBAgQIECAAAECBAgQSAgYwImahSRAgAABAgQIECBAgAABA9gPECBAgAABAgQIECBAgEBCwABO1CwkAQIECBAgQIAAAQIECBjAfoAAAQIECBAgQIAAAQIEEgIGcKJmIQkQIECAAAECBAgQIEDAAPYDBAgQIECAAAECBAgQIJAQMIATNQtJgAABAgQIECBAgAABAgawHyBAgAABAgQIECBAgACBhIABnKhZSAIECBAgQIAAAQIECBAwgP0AAQIECBAgQIAAAQIECCQEDOBEzUISIECAAAECBAgQIECAgAHsBwgQIECAAAECBAgQIEAgIWAAJ2oWkgABAgQIECBAgAABAgQMYD9AgAABAgQIECBAgAABAgkBAzhRs5AECBAgQIAAAQIECBAgYAD7AQIECBAgQIAAAQIECBBICBjAiZqFJECAAAECBAgQIECAAAED2A8QIECAAAECBAgQIECAQELAAE7ULCQBAgQIECBAgAABAgQIGMB+gAABAgQIECBAgAABAgQSAgZwomYhCRAgQIAAAQIECBAgQMAA9gMECBAgQIAAAQIECBAgkBAwgBM1C0mAAAECBAgQIECAAAECBrAfIECAAAECBAgQIECAAIGEgAGcqFlIAgQIECBAgAABAgQIEDCA/QABAgQIECBAgAABAgQIJAQM4ETNQhIgQIAAAQIECBAgQIDABXho0B/y9/CmAAAAAElFTkSuQmCC"/></g></svg><!--rotationCenter:240:180-->`,
    ],
    [
      "camera.svg",
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="0" height="0" viewBox="0 0 0 0">
        <!-- Exported by Scratch - http://scratch.mit.edu/ -->
        </svg><!--rotationCenter:0:0-->`,
    ],
    [
      "768c5818dfacffccc2ee51945135ad38.svg",
      `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0,0,20,20"><g transform="translate(-230,-170)"><g fill="#fffaf0" stroke="none" stroke-miterlimit="10"><path d="M230,190v-20h20v20z"/></g></g></svg><!--rotationCenter:10:10-->`,
    ],
    [
      "air.svg",
      `<svg version="1.1" width="2" height="2" viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Exported by Scratch - http://scratch.mit.edu/ -->
        </svg><!--rotationCenter:0:0-->`,
    ],
    [
      "2d6568bca66b266d8f00a41b4788e2cb.svg",
      `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="405">
      <rect width="540" height="405" />
      </svg>`,
    ],
  ];

  document.getElementById("label_d").addEventListener("click", function () {
    const world_data_1 = `${worldData}`.split(",").reverse();

    const data = {
      targets: [
        {
          isStage: true,
          name: "Stage",
          variables: {
            "Dvurghk]!y~Bh$7[2zA5": ["scroll x", 0],
            "2h8YgD*M18jG|aW4!Axy": ["scroll y", 0],
            "*;me:g-HOyhqXS4?0h6l": ["speed x", 0],
            "lm|A+e~e,o@Dvm{Jb(m:": ["speed y", 0],
            "S+8p+@wQM(qi-*DG2PC]": ["player x", 0],
            "EcO;L;k5IAWZlA-s`0CR": ["player y", 0],
            "{WG8L;z]k}]DSIo]@Uk@": ["jump level", 0],
            "K@2#jx|!Thcp]Pyu:bUe": ["index", 0],
          },
          lists: {
            "Hv91qM{{A!%6e9!gs^{w": ["data", world_data_1],
          },
          broadcasts: {},
          blocks: {},
          comments: {
            hf: {
              blockId: null,
              x: 50,
              y: 50,
              width: 350,
              height: 170,
              minimized: false,
              text: 'Configuration for https://turbowarp.org/\nYou can move, resize, and minimize this comment, but don\'t edit it by hand. This comment can be deleted to remove the stored settings.\n{"runtimeOptions":{"fencing":false}} // _twconfig_',
            },
          },
          currentCostume: 0,
          costumes: [
            {
              name: "background",
              bitmapResolution: 1,
              dataFormat: "svg",
              assetId: "a38908cb5b0c69bd3d47c5f3ea2c5bdb",
              md5ext: "a38908cb5b0c69bd3d47c5f3ea2c5bdb.svg",
              rotationCenterX: 240,
              rotationCenterY: 180,
            },
          ],
          sounds: [],
          volume: 100,
          layerOrder: 0,
          tempo: 60,
          videoTransparency: 50,
          videoState: "on",
          textToSpeechLanguage: null,
        },
        {
          isStage: false,
          name: "スプライト1",
          variables: {
            "BT=:.t$2qx+Hy0zw8B4:": ["clone x", 0],
            "M.l*44|7F!B7eZ?a.)C=": ["clone y", 0],
          },
          lists: {},
          broadcasts: {},
          blocks: {
            "e+": {
              opcode: "event_whenflagclicked",
              next: "a/",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 64,
            },
            "a/": {
              opcode: "looks_hide",
              next: "a:",
              parent: "e+",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a:": {
              opcode: "procedures_call",
              next: "a;",
              parent: "a/",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
              mutation: {
                tagName: "mutation",
                children: [],
                proccode: "clone create",
                argumentids: "[]",
                warp: "true",
              },
            },
            "a;": {
              opcode: "control_forever",
              next: null,
              parent: "a:",
              inputs: { SUBSTACK: [2, "e,"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e,": {
              opcode: "pen_clear",
              next: null,
              parent: "a;",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e-": {
              opcode: "control_start_as_clone",
              next: "a=",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 416,
            },
            "a=": {
              opcode: "looks_show",
              next: "a?",
              parent: "e-",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a?": {
              opcode: "control_forever",
              next: null,
              parent: "a=",
              inputs: { SUBSTACK: [2, "c"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            c: {
              opcode: "control_if",
              next: "d",
              parent: "a?",
              inputs: { CONDITION: [2, "a@"], SUBSTACK: [2, "e."] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a@": {
              opcode: "operator_gt",
              next: null,
              parent: "c",
              inputs: {
                OPERAND1: [3, "e/", [10, ""]],
                OPERAND2: [1, [10, "479"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e/": {
              opcode: "operator_subtract",
              next: null,
              parent: "a@",
              inputs: {
                NUM1: [3, [12, "clone x", "BT=:.t$2qx+Hy0zw8B4:"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e.": {
              opcode: "data_changevariableby",
              next: null,
              parent: "c",
              inputs: { VALUE: [1, [4, "-960"]] },
              fields: { VARIABLE: ["clone x", "BT=:.t$2qx+Hy0zw8B4:"] },
              shadow: false,
              topLevel: false,
            },
            d: {
              opcode: "control_if",
              next: "e",
              parent: "c",
              inputs: { CONDITION: [2, "a["], SUBSTACK: [2, "e:"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a[": {
              opcode: "operator_lt",
              next: null,
              parent: "d",
              inputs: {
                OPERAND1: [3, "e;", [10, ""]],
                OPERAND2: [1, [10, "-479"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e;": {
              opcode: "operator_subtract",
              next: null,
              parent: "a[",
              inputs: {
                NUM1: [3, [12, "clone x", "BT=:.t$2qx+Hy0zw8B4:"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e:": {
              opcode: "data_changevariableby",
              next: null,
              parent: "d",
              inputs: { VALUE: [1, [4, "960"]] },
              fields: { VARIABLE: ["clone x", "BT=:.t$2qx+Hy0zw8B4:"] },
              shadow: false,
              topLevel: false,
            },
            e: {
              opcode: "control_if",
              next: "f",
              parent: "d",
              inputs: { CONDITION: [2, "a]"], SUBSTACK: [2, "e="] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a]": {
              opcode: "operator_gt",
              next: null,
              parent: "e",
              inputs: {
                OPERAND1: [3, "e?", [10, ""]],
                OPERAND2: [1, [10, "359"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e?": {
              opcode: "operator_subtract",
              next: null,
              parent: "a]",
              inputs: {
                NUM1: [3, [12, "clone y", "M.l*44|7F!B7eZ?a.)C="], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e=": {
              opcode: "data_changevariableby",
              next: null,
              parent: "e",
              inputs: { VALUE: [1, [4, "-720"]] },
              fields: { VARIABLE: ["clone y", "M.l*44|7F!B7eZ?a.)C="] },
              shadow: false,
              topLevel: false,
            },
            f: {
              opcode: "control_if",
              next: "x",
              parent: "e",
              inputs: { CONDITION: [2, "a^"], SUBSTACK: [2, "e@"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a^": {
              opcode: "operator_lt",
              next: null,
              parent: "f",
              inputs: {
                OPERAND1: [3, "e[", [10, ""]],
                OPERAND2: [1, [10, "-359"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e[": {
              opcode: "operator_subtract",
              next: null,
              parent: "a^",
              inputs: {
                NUM1: [3, [12, "clone y", "M.l*44|7F!B7eZ?a.)C="], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e@": {
              opcode: "data_changevariableby",
              next: null,
              parent: "f",
              inputs: { VALUE: [1, [4, "720"]] },
              fields: { VARIABLE: ["clone y", "M.l*44|7F!B7eZ?a.)C="] },
              shadow: false,
              topLevel: false,
            },
            x: {
              opcode: "looks_switchcostumeto",
              next: "g",
              parent: "f",
              inputs: { COSTUME: [1, "e]"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e]": {
              opcode: "looks_costume",
              next: null,
              parent: "x",
              inputs: {},
              fields: { COSTUME: ["move", null] },
              shadow: true,
              topLevel: false,
            },
            g: {
              opcode: "motion_gotoxy",
              next: "y",
              parent: "x",
              inputs: { X: [3, "e^", [4, ""]], Y: [3, "e_", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e^": {
              opcode: "operator_subtract",
              next: null,
              parent: "g",
              inputs: {
                NUM1: [3, [12, "clone x", "BT=:.t$2qx+Hy0zw8B4:"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            e_: {
              opcode: "operator_subtract",
              next: null,
              parent: "g",
              inputs: {
                NUM1: [3, [12, "clone y", "M.l*44|7F!B7eZ?a.)C="], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            y: {
              opcode: "looks_switchcostumeto",
              next: null,
              parent: "g",
              inputs: { COSTUME: [3, "a_", "e`"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            a_: {
              opcode: "operator_join",
              next: null,
              parent: "y",
              inputs: {
                STRING1: [3, "e{", [10, ""]],
                STRING2: [3, [12, "clone y", "M.l*44|7F!B7eZ?a.)C="], [10, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e{": {
              opcode: "operator_join",
              next: null,
              parent: "a_",
              inputs: {
                STRING1: [3, [12, "clone x", "BT=:.t$2qx+Hy0zw8B4:"], [10, ""]],
                STRING2: [1, [10, ","]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e`": {
              opcode: "looks_costume",
              next: null,
              parent: "y",
              inputs: {},
              fields: { COSTUME: ["0,0", null] },
              shadow: true,
              topLevel: false,
            },
            "a`": {
              opcode: "procedures_definition",
              next: "a{",
              parent: null,
              inputs: { custom_block: [1, "e|"] },
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 1408,
            },
            "e|": {
              opcode: "procedures_prototype",
              next: null,
              parent: "a`",
              inputs: {},
              fields: {},
              shadow: true,
              topLevel: false,
              mutation: {
                tagName: "mutation",
                children: [],
                proccode: "clone create",
                argumentids: "[]",
                argumentnames: "[]",
                argumentdefaults: "[]",
                warp: "true",
              },
            },
            "a{": {
              opcode: "data_setvariableto",
              next: "a|",
              parent: "a`",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["clone x", "BT=:.t$2qx+Hy0zw8B4:"] },
              shadow: false,
              topLevel: false,
            },
            "a|": {
              opcode: "data_setvariableto",
              next: "a}",
              parent: "a{",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["clone y", "M.l*44|7F!B7eZ?a.)C="] },
              shadow: false,
              topLevel: false,
            },
            "a}": {
              opcode: "control_repeat",
              next: null,
              parent: "a|",
              inputs: { TIMES: [1, [6, "2"]], SUBSTACK: [2, "z"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            z: {
              opcode: "control_repeat",
              next: "e}",
              parent: "a}",
              inputs: { TIMES: [1, [6, "2"]], SUBSTACK: [2, "A"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            A: {
              opcode: "control_create_clone_of",
              next: "e~",
              parent: "z",
              inputs: { CLONE_OPTION: [1, "fa"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fa: {
              opcode: "control_create_clone_of_menu",
              next: null,
              parent: "A",
              inputs: {},
              fields: { CLONE_OPTION: ["_myself_", null] },
              shadow: true,
              topLevel: false,
            },
            "e~": {
              opcode: "data_changevariableby",
              next: null,
              parent: "A",
              inputs: { VALUE: [1, [4, "-360"]] },
              fields: { VARIABLE: ["clone y", "M.l*44|7F!B7eZ?a.)C="] },
              shadow: false,
              topLevel: false,
            },
            "e}": {
              opcode: "data_changevariableby",
              next: null,
              parent: "z",
              inputs: { VALUE: [1, [4, "480"]] },
              fields: { VARIABLE: ["clone x", "BT=:.t$2qx+Hy0zw8B4:"] },
              shadow: false,
              topLevel: false,
            },
          },
          comments: {},
          currentCostume: 2,
          costumes: [
            {
              name: "",
              bitmapResolution: 1,
              dataFormat: "svg",
              assetId: "cd21514d0531fdffb22204e0ec5ed84a",
              md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
              rotationCenterX: 0,
              rotationCenterY: 0,
            },
            {
              name: "move",
              bitmapResolution: 1,
              dataFormat: "svg",
              assetId: "2d6568bca66b266d8f00a41b4788e2cb",
              md5ext: "2d6568bca66b266d8f00a41b4788e2cb.svg",
              rotationCenterX: 270.5,
              rotationCenterY: 202.5,
            },
          ],
          sounds: [],
          volume: 100,
          layerOrder: 1,
          visible: false,
          x: 0,
          y: 0,
          size: 100,
          direction: 90,
          draggable: false,
          rotationStyle: "all around",
        },
        {
          isStage: false,
          name: "スプライト2",
          variables: {},
          lists: {},
          broadcasts: {},
          blocks: {
            fb: {
              opcode: "event_whenflagclicked",
              next: "a~",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 64,
            },
            "a~": {
              opcode: "data_setvariableto",
              next: "ba",
              parent: "fb",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            ba: {
              opcode: "data_setvariableto",
              next: "bb",
              parent: "a~",
              inputs: { VALUE: [1, [10, "240"]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            bb: {
              opcode: "data_setvariableto",
              next: "bc",
              parent: "ba",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            bc: {
              opcode: "data_setvariableto",
              next: "bd",
              parent: "bb",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            be: {
              opcode: "control_forever",
              next: null,
              parent: "bd",
              inputs: { SUBSTACK: [2, "bf"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bf: {
              opcode: "data_changevariableby",
              next: "a",
              parent: "be",
              inputs: { VALUE: [1, [4, "-2"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            h: {
              opcode: "control_if",
              next: "B",
              parent: "bg",
              inputs: { CONDITION: [2, "C"], SUBSTACK: [2, "D"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bh: {
              opcode: "operator_gt",
              next: null,
              parent: "C",
              inputs: {
                OPERAND1: [3, "E", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            E: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bh",
              inputs: {
                STRING: [3, "bi", [10, ""]],
                LETTER: [3, "bj", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bi: {
              opcode: "data_itemoflist",
              next: null,
              parent: "E",
              inputs: { INDEX: [3, "F", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            F: {
              opcode: "operator_add",
              next: null,
              parent: "bi",
              inputs: { NUM1: [3, "bk", [4, ""]], NUM2: [3, "bl", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bk: {
              opcode: "operator_round",
              next: null,
              parent: "F",
              inputs: { NUM: [3, "fc", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fc: {
              opcode: "operator_divide",
              next: null,
              parent: "bk",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bj: {
              opcode: "operator_add",
              next: null,
              parent: "E",
              inputs: { NUM1: [3, "bm", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bm: {
              opcode: "operator_round",
              next: null,
              parent: "bj",
              inputs: { NUM: [3, "fd", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fd: {
              opcode: "operator_divide",
              next: null,
              parent: "bm",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fe: {
              opcode: "data_setvariableto",
              next: null,
              parent: "D",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            D: {
              opcode: "data_setvariableto",
              next: "fe",
              parent: "h",
              inputs: { VALUE: [3, "bn", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            bn: {
              opcode: "operator_add",
              next: null,
              parent: "D",
              inputs: { NUM1: [3, "bo", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bo: {
              opcode: "operator_multiply",
              next: null,
              parent: "bn",
              inputs: { NUM1: [3, "bp", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bp: {
              opcode: "operator_round",
              next: null,
              parent: "bo",
              inputs: { NUM: [3, "bq", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bq: {
              opcode: "operator_divide",
              next: null,
              parent: "bp",
              inputs: { NUM1: [3, "ff", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ff: {
              opcode: "operator_subtract",
              next: null,
              parent: "bq",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            G: {
              opcode: "data_changevariableby",
              next: "j",
              parent: "i",
              inputs: { VALUE: [3, "fg", [4, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            C: {
              opcode: "operator_or",
              next: null,
              parent: "h",
              inputs: { OPERAND2: [2, "br"], OPERAND1: [2, "bh"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            br: {
              opcode: "operator_gt",
              next: null,
              parent: "C",
              inputs: {
                OPERAND1: [3, "H", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            H: {
              opcode: "operator_letter_of",
              next: null,
              parent: "br",
              inputs: {
                STRING: [3, "bs", [10, ""]],
                LETTER: [3, "bt", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bs: {
              opcode: "data_itemoflist",
              next: null,
              parent: "H",
              inputs: { INDEX: [3, "I", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            I: {
              opcode: "operator_add",
              next: null,
              parent: "bs",
              inputs: { NUM1: [3, "bu", [4, ""]], NUM2: [3, "bv", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bu: {
              opcode: "operator_round",
              next: null,
              parent: "I",
              inputs: { NUM: [3, "fh", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fh: {
              opcode: "operator_divide",
              next: null,
              parent: "bu",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bt: {
              opcode: "operator_add",
              next: null,
              parent: "H",
              inputs: { NUM1: [3, "bw", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bw: {
              opcode: "operator_round",
              next: null,
              parent: "bt",
              inputs: { NUM: [3, "fi", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fi: {
              opcode: "operator_divide",
              next: null,
              parent: "bw",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            B: {
              opcode: "control_if",
              next: null,
              parent: "h",
              inputs: { CONDITION: [2, "J"], SUBSTACK: [2, "K"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            J: {
              opcode: "operator_or",
              next: null,
              parent: "B",
              inputs: { OPERAND1: [2, "bx"], OPERAND2: [2, "by"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bx: {
              opcode: "operator_gt",
              next: null,
              parent: "J",
              inputs: {
                OPERAND1: [3, "L", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            L: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bx",
              inputs: {
                STRING: [3, "bz", [10, ""]],
                LETTER: [3, "bA", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bz: {
              opcode: "data_itemoflist",
              next: null,
              parent: "L",
              inputs: { INDEX: [3, "M", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            M: {
              opcode: "operator_add",
              next: null,
              parent: "bz",
              inputs: { NUM1: [3, "bB", [4, ""]], NUM2: [3, "bC", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bB: {
              opcode: "operator_round",
              next: null,
              parent: "M",
              inputs: { NUM: [3, "fj", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fj: {
              opcode: "operator_divide",
              next: null,
              parent: "bB",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bA: {
              opcode: "operator_add",
              next: null,
              parent: "L",
              inputs: { NUM1: [3, "bD", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bD: {
              opcode: "operator_round",
              next: null,
              parent: "bA",
              inputs: { NUM: [3, "fk", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fk: {
              opcode: "operator_divide",
              next: null,
              parent: "bD",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            by: {
              opcode: "operator_gt",
              next: null,
              parent: "J",
              inputs: {
                OPERAND1: [3, "N", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            N: {
              opcode: "operator_letter_of",
              next: null,
              parent: "by",
              inputs: {
                STRING: [3, "bE", [10, ""]],
                LETTER: [3, "bF", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bE: {
              opcode: "data_itemoflist",
              next: null,
              parent: "N",
              inputs: { INDEX: [3, "O", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            O: {
              opcode: "operator_add",
              next: null,
              parent: "bE",
              inputs: { NUM1: [3, "bG", [4, ""]], NUM2: [3, "bH", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bG: {
              opcode: "operator_round",
              next: null,
              parent: "O",
              inputs: { NUM: [3, "fl", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fl: {
              opcode: "operator_divide",
              next: null,
              parent: "bG",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bF: {
              opcode: "operator_add",
              next: null,
              parent: "N",
              inputs: { NUM1: [3, "bI", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bI: {
              opcode: "operator_round",
              next: null,
              parent: "bF",
              inputs: { NUM: [3, "fm", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fm: {
              opcode: "operator_divide",
              next: null,
              parent: "bI",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bJ: {
              opcode: "data_setvariableto",
              next: "fn",
              parent: "K",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            K: {
              opcode: "data_setvariableto",
              next: "bJ",
              parent: "B",
              inputs: { VALUE: [3, "bK", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            bK: {
              opcode: "operator_add",
              next: null,
              parent: "K",
              inputs: { NUM1: [3, "bL", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bL: {
              opcode: "operator_multiply",
              next: null,
              parent: "bK",
              inputs: { NUM1: [3, "bM", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bM: {
              opcode: "operator_round",
              next: null,
              parent: "bL",
              inputs: { NUM: [3, "bN", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bN: {
              opcode: "operator_divide",
              next: null,
              parent: "bM",
              inputs: { NUM1: [3, "fo", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fo: {
              opcode: "operator_subtract",
              next: null,
              parent: "bN",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            k: {
              opcode: "control_if",
              next: "P",
              parent: "bO",
              inputs: { CONDITION: [2, "Q"], SUBSTACK: [2, "R"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            Q: {
              opcode: "operator_or",
              next: null,
              parent: "k",
              inputs: { OPERAND1: [2, "bP"], OPERAND2: [2, "bQ"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bP: {
              opcode: "operator_gt",
              next: null,
              parent: "Q",
              inputs: {
                OPERAND1: [3, "S", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            S: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bP",
              inputs: {
                STRING: [3, "bR", [10, ""]],
                LETTER: [3, "bS", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bR: {
              opcode: "data_itemoflist",
              next: null,
              parent: "S",
              inputs: { INDEX: [3, "T", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            T: {
              opcode: "operator_add",
              next: null,
              parent: "bR",
              inputs: { NUM1: [3, "bT", [4, ""]], NUM2: [3, "bU", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bT: {
              opcode: "operator_round",
              next: null,
              parent: "T",
              inputs: { NUM: [3, "fp", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fp: {
              opcode: "operator_divide",
              next: null,
              parent: "bT",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bS: {
              opcode: "operator_add",
              next: null,
              parent: "S",
              inputs: { NUM1: [3, "bV", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bV: {
              opcode: "operator_round",
              next: null,
              parent: "bS",
              inputs: { NUM: [3, "fq", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fq: {
              opcode: "operator_divide",
              next: null,
              parent: "bV",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bQ: {
              opcode: "operator_gt",
              next: null,
              parent: "Q",
              inputs: {
                OPERAND1: [3, "U", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            U: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bQ",
              inputs: {
                STRING: [3, "bW", [10, ""]],
                LETTER: [3, "bX", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bW: {
              opcode: "data_itemoflist",
              next: null,
              parent: "U",
              inputs: { INDEX: [3, "V", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            V: {
              opcode: "operator_add",
              next: null,
              parent: "bW",
              inputs: { NUM1: [3, "bY", [4, ""]], NUM2: [3, "bZ", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bY: {
              opcode: "operator_round",
              next: null,
              parent: "V",
              inputs: { NUM: [3, "fr", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fr: {
              opcode: "operator_divide",
              next: null,
              parent: "bY",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bX: {
              opcode: "operator_add",
              next: null,
              parent: "U",
              inputs: { NUM1: [3, "b!", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b!": {
              opcode: "operator_round",
              next: null,
              parent: "bX",
              inputs: { NUM: [3, "fs", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fs: {
              opcode: "operator_divide",
              next: null,
              parent: "b!",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ft: {
              opcode: "data_setvariableto",
              next: null,
              parent: "R",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            R: {
              opcode: "data_setvariableto",
              next: "ft",
              parent: "k",
              inputs: { VALUE: [3, "b#", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "b#": {
              opcode: "operator_add",
              next: null,
              parent: "R",
              inputs: { NUM1: [3, "b%", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b%": {
              opcode: "operator_multiply",
              next: null,
              parent: "b#",
              inputs: { NUM1: [3, "b(", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b(": {
              opcode: "operator_round",
              next: null,
              parent: "b%",
              inputs: { NUM: [3, "b)", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b)": {
              opcode: "operator_divide",
              next: null,
              parent: "b(",
              inputs: { NUM1: [3, "fu", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fu: {
              opcode: "operator_subtract",
              next: null,
              parent: "b)",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            P: {
              opcode: "control_if",
              next: null,
              parent: "k",
              inputs: { CONDITION: [2, "W"], SUBSTACK: [2, "X"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            W: {
              opcode: "operator_or",
              next: null,
              parent: "P",
              inputs: { OPERAND1: [2, "b*"], OPERAND2: [2, "b+"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b*": {
              opcode: "operator_gt",
              next: null,
              parent: "W",
              inputs: {
                OPERAND1: [3, "Y", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            Y: {
              opcode: "operator_letter_of",
              next: null,
              parent: "b*",
              inputs: {
                STRING: [3, "b,", [10, ""]],
                LETTER: [3, "b-", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b,": {
              opcode: "data_itemoflist",
              next: null,
              parent: "Y",
              inputs: { INDEX: [3, "Z", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            Z: {
              opcode: "operator_add",
              next: null,
              parent: "b,",
              inputs: { NUM1: [3, "b.", [4, ""]], NUM2: [3, "b/", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b.": {
              opcode: "operator_round",
              next: null,
              parent: "Z",
              inputs: { NUM: [3, "fv", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fv: {
              opcode: "operator_divide",
              next: null,
              parent: "b.",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b-": {
              opcode: "operator_add",
              next: null,
              parent: "Y",
              inputs: { NUM1: [3, "b:", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b:": {
              opcode: "operator_round",
              next: null,
              parent: "b-",
              inputs: { NUM: [3, "fw", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fw: {
              opcode: "operator_divide",
              next: null,
              parent: "b:",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b+": {
              opcode: "operator_gt",
              next: null,
              parent: "W",
              inputs: {
                OPERAND1: [3, "!", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "!": {
              opcode: "operator_letter_of",
              next: null,
              parent: "b+",
              inputs: {
                STRING: [3, "b;", [10, ""]],
                LETTER: [3, "b=", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b;": {
              opcode: "data_itemoflist",
              next: null,
              parent: "!",
              inputs: { INDEX: [3, "#", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "#": {
              opcode: "operator_add",
              next: null,
              parent: "b;",
              inputs: { NUM1: [3, "b?", [4, ""]], NUM2: [3, "b@", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b?": {
              opcode: "operator_round",
              next: null,
              parent: "#",
              inputs: { NUM: [3, "fx", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fx: {
              opcode: "operator_divide",
              next: null,
              parent: "b?",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b=": {
              opcode: "operator_add",
              next: null,
              parent: "!",
              inputs: { NUM1: [3, "b[", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b[": {
              opcode: "operator_round",
              next: null,
              parent: "b=",
              inputs: { NUM: [3, "fy", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fy: {
              opcode: "operator_divide",
              next: null,
              parent: "b[",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fz: {
              opcode: "data_setvariableto",
              next: null,
              parent: "X",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            X: {
              opcode: "data_setvariableto",
              next: "fz",
              parent: "P",
              inputs: { VALUE: [3, "b]", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "b]": {
              opcode: "operator_add",
              next: null,
              parent: "X",
              inputs: { NUM1: [3, "b^", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b^": {
              opcode: "operator_multiply",
              next: null,
              parent: "b]",
              inputs: { NUM1: [3, "b_", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            b_: {
              opcode: "operator_round",
              next: null,
              parent: "b^",
              inputs: { NUM: [3, "b`", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b`": {
              opcode: "operator_divide",
              next: null,
              parent: "b_",
              inputs: { NUM1: [3, "fA", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fA: {
              opcode: "operator_subtract",
              next: null,
              parent: "b`",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b{": {
              opcode: "procedures_definition",
              next: "l",
              parent: null,
              inputs: { custom_block: [1, "fB"] },
              fields: {},
              shadow: false,
              topLevel: true,
              x: 750,
              y: 64,
            },
            fB: {
              opcode: "procedures_prototype",
              next: null,
              parent: "b{",
              inputs: {},
              fields: {},
              shadow: true,
              topLevel: false,
              mutation: {
                tagName: "mutation",
                children: [],
                proccode: "当たり判定y",
                argumentids: "[]",
                argumentnames: "[]",
                argumentdefaults: "[]",
                warp: "true",
              },
            },
            "b|": {
              opcode: "procedures_definition",
              next: "m",
              parent: null,
              inputs: { custom_block: [1, "fC"] },
              fields: {},
              shadow: false,
              topLevel: true,
              x: 750,
              y: 3096,
            },
            fC: {
              opcode: "procedures_prototype",
              next: null,
              parent: "b|",
              inputs: {},
              fields: {},
              shadow: true,
              topLevel: false,
              mutation: {
                tagName: "mutation",
                children: [],
                proccode: "当たり判定x",
                argumentids: "[]",
                argumentnames: "[]",
                argumentdefaults: "[]",
                warp: "true",
              },
            },
            n: {
              opcode: "control_repeat",
              next: "%",
              parent: "l",
              inputs: { TIMES: [3, "b}", [6, ""]], SUBSTACK: [2, "bg"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fD: {
              opcode: "operator_divide",
              next: null,
              parent: "b}",
              inputs: {
                NUM1: [3, [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b}": {
              opcode: "operator_mathop",
              next: null,
              parent: "n",
              inputs: { NUM: [3, "fD", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            bg: {
              opcode: "data_changevariableby",
              next: "h",
              parent: "n",
              inputs: { VALUE: [1, [4, "10"]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            l: {
              opcode: "control_if_else",
              next: null,
              parent: "b{",
              inputs: {
                SUBSTACK: [2, "n"],
                CONDITION: [2, "fE"],
                SUBSTACK2: [2, "o"],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fE: {
              opcode: "operator_gt",
              next: null,
              parent: "l",
              inputs: {
                OPERAND1: [
                  3,
                  [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"],
                  [10, ""],
                ],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            o: {
              opcode: "control_repeat",
              next: "(",
              parent: "l",
              inputs: { TIMES: [3, "b~", [6, ""]], SUBSTACK: [2, "ca"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b~": {
              opcode: "operator_mathop",
              next: null,
              parent: "o",
              inputs: { NUM: [3, "fF", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            fF: {
              opcode: "operator_divide",
              next: null,
              parent: "b~",
              inputs: {
                NUM1: [3, [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"], [4, ""]],
                NUM2: [1, [4, "-10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ca: {
              opcode: "data_changevariableby",
              next: "p",
              parent: "o",
              inputs: { VALUE: [1, [4, "-10"]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            p: {
              opcode: "control_if",
              next: ")",
              parent: "ca",
              inputs: { CONDITION: [2, "*"], SUBSTACK: [2, "+"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "*": {
              opcode: "operator_or",
              next: null,
              parent: "p",
              inputs: { OPERAND1: [2, "cb"], OPERAND2: [2, "cc"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cb: {
              opcode: "operator_gt",
              next: null,
              parent: "*",
              inputs: {
                OPERAND1: [3, ",", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ",": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cb",
              inputs: {
                STRING: [3, "cd", [10, ""]],
                LETTER: [3, "ce", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cd: {
              opcode: "data_itemoflist",
              next: null,
              parent: ",",
              inputs: { INDEX: [3, "-", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "-": {
              opcode: "operator_add",
              next: null,
              parent: "cd",
              inputs: { NUM1: [3, "cf", [4, ""]], NUM2: [3, "cg", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cf: {
              opcode: "operator_round",
              next: null,
              parent: "-",
              inputs: { NUM: [3, "fG", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fG: {
              opcode: "operator_divide",
              next: null,
              parent: "cf",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ce: {
              opcode: "operator_add",
              next: null,
              parent: ",",
              inputs: { NUM1: [3, "ch", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ch: {
              opcode: "operator_round",
              next: null,
              parent: "ce",
              inputs: { NUM: [3, "fH", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fH: {
              opcode: "operator_divide",
              next: null,
              parent: "ch",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cc: {
              opcode: "operator_gt",
              next: null,
              parent: "*",
              inputs: {
                OPERAND1: [3, ".", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ".": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cc",
              inputs: {
                STRING: [3, "ci", [10, ""]],
                LETTER: [3, "cj", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ci: {
              opcode: "data_itemoflist",
              next: null,
              parent: ".",
              inputs: { INDEX: [3, "/", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "/": {
              opcode: "operator_add",
              next: null,
              parent: "ci",
              inputs: { NUM1: [3, "ck", [4, ""]], NUM2: [3, "cl", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ck: {
              opcode: "operator_round",
              next: null,
              parent: "/",
              inputs: { NUM: [3, "fI", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fI: {
              opcode: "operator_divide",
              next: null,
              parent: "ck",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cj: {
              opcode: "operator_add",
              next: null,
              parent: ".",
              inputs: { NUM1: [3, "cm", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cm: {
              opcode: "operator_round",
              next: null,
              parent: "cj",
              inputs: { NUM: [3, "fJ", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fJ: {
              opcode: "operator_divide",
              next: null,
              parent: "cm",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "+": {
              opcode: "data_setvariableto",
              next: "fK",
              parent: "p",
              inputs: { VALUE: [3, "cn", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            cn: {
              opcode: "operator_add",
              next: null,
              parent: "+",
              inputs: { NUM1: [3, "co", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            co: {
              opcode: "operator_multiply",
              next: null,
              parent: "cn",
              inputs: { NUM1: [3, "cp", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cp: {
              opcode: "operator_round",
              next: null,
              parent: "co",
              inputs: { NUM: [3, "cq", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cq: {
              opcode: "operator_divide",
              next: null,
              parent: "cp",
              inputs: { NUM1: [3, "fL", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fL: {
              opcode: "operator_subtract",
              next: null,
              parent: "cq",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fK: {
              opcode: "data_setvariableto",
              next: null,
              parent: "+",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            ")": {
              opcode: "control_if",
              next: null,
              parent: "p",
              inputs: { CONDITION: [2, ":"], SUBSTACK: [2, ";"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ":": {
              opcode: "operator_or",
              next: null,
              parent: ")",
              inputs: { OPERAND1: [2, "cr"], OPERAND2: [2, "cs"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cr: {
              opcode: "operator_gt",
              next: null,
              parent: ":",
              inputs: {
                OPERAND1: [3, "=", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "=": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cr",
              inputs: {
                STRING: [3, "ct", [10, ""]],
                LETTER: [3, "cu", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ct: {
              opcode: "data_itemoflist",
              next: null,
              parent: "=",
              inputs: { INDEX: [3, "?", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "?": {
              opcode: "operator_add",
              next: null,
              parent: "ct",
              inputs: { NUM1: [3, "cv", [4, ""]], NUM2: [3, "cw", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cv: {
              opcode: "operator_round",
              next: null,
              parent: "?",
              inputs: { NUM: [3, "fM", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fM: {
              opcode: "operator_divide",
              next: null,
              parent: "cv",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cu: {
              opcode: "operator_add",
              next: null,
              parent: "=",
              inputs: { NUM1: [3, "cx", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cx: {
              opcode: "operator_round",
              next: null,
              parent: "cu",
              inputs: { NUM: [3, "fN", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fN: {
              opcode: "operator_divide",
              next: null,
              parent: "cx",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cs: {
              opcode: "operator_gt",
              next: null,
              parent: ":",
              inputs: {
                OPERAND1: [3, "@", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "@": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cs",
              inputs: {
                STRING: [3, "cy", [10, ""]],
                LETTER: [3, "cz", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cy: {
              opcode: "data_itemoflist",
              next: null,
              parent: "@",
              inputs: { INDEX: [3, "[", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "[": {
              opcode: "operator_add",
              next: null,
              parent: "cy",
              inputs: { NUM1: [3, "cA", [4, ""]], NUM2: [3, "cB", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cA: {
              opcode: "operator_round",
              next: null,
              parent: "[",
              inputs: { NUM: [3, "fO", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fO: {
              opcode: "operator_divide",
              next: null,
              parent: "cA",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cz: {
              opcode: "operator_add",
              next: null,
              parent: "@",
              inputs: { NUM1: [3, "cC", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cC: {
              opcode: "operator_round",
              next: null,
              parent: "cz",
              inputs: { NUM: [3, "fP", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fP: {
              opcode: "operator_divide",
              next: null,
              parent: "cC",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ";": {
              opcode: "data_setvariableto",
              next: "fQ",
              parent: ")",
              inputs: { VALUE: [3, "cD", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            cD: {
              opcode: "operator_add",
              next: null,
              parent: ";",
              inputs: { NUM1: [3, "cE", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cE: {
              opcode: "operator_multiply",
              next: null,
              parent: "cD",
              inputs: { NUM1: [3, "cF", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cF: {
              opcode: "operator_round",
              next: null,
              parent: "cE",
              inputs: { NUM: [3, "cG", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cG: {
              opcode: "operator_divide",
              next: null,
              parent: "cF",
              inputs: { NUM1: [3, "fR", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fR: {
              opcode: "operator_subtract",
              next: null,
              parent: "cG",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fQ: {
              opcode: "data_setvariableto",
              next: null,
              parent: ";",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            "(": {
              opcode: "data_changevariableby",
              next: "q",
              parent: "o",
              inputs: { VALUE: [3, "fS", [4, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            fS: {
              opcode: "operator_mod",
              next: null,
              parent: "(",
              inputs: {
                NUM1: [3, [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"], [4, ""]],
                NUM2: [1, [4, "-10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "%": {
              opcode: "data_changevariableby",
              next: "r",
              parent: "n",
              inputs: { VALUE: [3, "fT", [4, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            fT: {
              opcode: "operator_mod",
              next: null,
              parent: "%",
              inputs: {
                NUM1: [3, [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            q: {
              opcode: "control_if",
              next: "]",
              parent: "(",
              inputs: { CONDITION: [2, "^"], SUBSTACK: [2, "_"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "^": {
              opcode: "operator_or",
              next: null,
              parent: "q",
              inputs: { OPERAND1: [2, "cH"], OPERAND2: [2, "cI"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cH: {
              opcode: "operator_gt",
              next: null,
              parent: "^",
              inputs: {
                OPERAND1: [3, "`", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "`": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cH",
              inputs: {
                STRING: [3, "cJ", [10, ""]],
                LETTER: [3, "cK", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cJ: {
              opcode: "data_itemoflist",
              next: null,
              parent: "`",
              inputs: { INDEX: [3, "{", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "{": {
              opcode: "operator_add",
              next: null,
              parent: "cJ",
              inputs: { NUM1: [3, "cL", [4, ""]], NUM2: [3, "cM", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cL: {
              opcode: "operator_round",
              next: null,
              parent: "{",
              inputs: { NUM: [3, "fU", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fU: {
              opcode: "operator_divide",
              next: null,
              parent: "cL",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cK: {
              opcode: "operator_add",
              next: null,
              parent: "`",
              inputs: { NUM1: [3, "cN", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cN: {
              opcode: "operator_round",
              next: null,
              parent: "cK",
              inputs: { NUM: [3, "fV", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fV: {
              opcode: "operator_divide",
              next: null,
              parent: "cN",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cI: {
              opcode: "operator_gt",
              next: null,
              parent: "^",
              inputs: {
                OPERAND1: [3, "|", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "|": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cI",
              inputs: {
                STRING: [3, "cO", [10, ""]],
                LETTER: [3, "cP", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cO: {
              opcode: "data_itemoflist",
              next: null,
              parent: "|",
              inputs: { INDEX: [3, "}", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "}": {
              opcode: "operator_add",
              next: null,
              parent: "cO",
              inputs: { NUM1: [3, "cQ", [4, ""]], NUM2: [3, "cR", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cQ: {
              opcode: "operator_round",
              next: null,
              parent: "}",
              inputs: { NUM: [3, "fW", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fW: {
              opcode: "operator_divide",
              next: null,
              parent: "cQ",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cP: {
              opcode: "operator_add",
              next: null,
              parent: "|",
              inputs: { NUM1: [3, "cS", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cS: {
              opcode: "operator_round",
              next: null,
              parent: "cP",
              inputs: { NUM: [3, "fX", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fX: {
              opcode: "operator_divide",
              next: null,
              parent: "cS",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            _: {
              opcode: "data_setvariableto",
              next: "cT",
              parent: "q",
              inputs: { VALUE: [3, "cU", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            cU: {
              opcode: "operator_add",
              next: null,
              parent: "_",
              inputs: { NUM1: [3, "cV", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cV: {
              opcode: "operator_multiply",
              next: null,
              parent: "cU",
              inputs: { NUM1: [3, "cW", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cW: {
              opcode: "operator_round",
              next: null,
              parent: "cV",
              inputs: { NUM: [3, "cX", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cX: {
              opcode: "operator_divide",
              next: null,
              parent: "cW",
              inputs: { NUM1: [3, "fY", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fY: {
              opcode: "operator_subtract",
              next: null,
              parent: "cX",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cT: {
              opcode: "data_setvariableto",
              next: "fZ",
              parent: "_",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            "]": {
              opcode: "control_if",
              next: null,
              parent: "q",
              inputs: { CONDITION: [2, "~"], SUBSTACK: [2, "aa"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "~": {
              opcode: "operator_or",
              next: null,
              parent: "]",
              inputs: { OPERAND1: [2, "cY"], OPERAND2: [2, "cZ"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cY: {
              opcode: "operator_gt",
              next: null,
              parent: "~",
              inputs: {
                OPERAND1: [3, "ab", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ab: {
              opcode: "operator_letter_of",
              next: null,
              parent: "cY",
              inputs: {
                STRING: [3, "c!", [10, ""]],
                LETTER: [3, "c#", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c!": {
              opcode: "data_itemoflist",
              next: null,
              parent: "ab",
              inputs: { INDEX: [3, "ac", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ac: {
              opcode: "operator_add",
              next: null,
              parent: "c!",
              inputs: { NUM1: [3, "c%", [4, ""]], NUM2: [3, "c(", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c%": {
              opcode: "operator_round",
              next: null,
              parent: "ac",
              inputs: { NUM: [3, "f!", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f!": {
              opcode: "operator_divide",
              next: null,
              parent: "c%",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c#": {
              opcode: "operator_add",
              next: null,
              parent: "ab",
              inputs: { NUM1: [3, "c)", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c)": {
              opcode: "operator_round",
              next: null,
              parent: "c#",
              inputs: { NUM: [3, "f#", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f#": {
              opcode: "operator_divide",
              next: null,
              parent: "c)",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cZ: {
              opcode: "operator_gt",
              next: null,
              parent: "~",
              inputs: {
                OPERAND1: [3, "ad", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ad: {
              opcode: "operator_letter_of",
              next: null,
              parent: "cZ",
              inputs: {
                STRING: [3, "c*", [10, ""]],
                LETTER: [3, "c+", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c*": {
              opcode: "data_itemoflist",
              next: null,
              parent: "ad",
              inputs: { INDEX: [3, "ae", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ae: {
              opcode: "operator_add",
              next: null,
              parent: "c*",
              inputs: { NUM1: [3, "c,", [4, ""]], NUM2: [3, "c-", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c,": {
              opcode: "operator_round",
              next: null,
              parent: "ae",
              inputs: { NUM: [3, "f%", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f%": {
              opcode: "operator_divide",
              next: null,
              parent: "c,",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c+": {
              opcode: "operator_add",
              next: null,
              parent: "ad",
              inputs: { NUM1: [3, "c.", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c.": {
              opcode: "operator_round",
              next: null,
              parent: "c+",
              inputs: { NUM: [3, "f(", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f(": {
              opcode: "operator_divide",
              next: null,
              parent: "c.",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aa: {
              opcode: "data_setvariableto",
              next: "c/",
              parent: "]",
              inputs: { VALUE: [3, "c:", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            "c:": {
              opcode: "operator_add",
              next: null,
              parent: "aa",
              inputs: { NUM1: [3, "c;", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c;": {
              opcode: "operator_multiply",
              next: null,
              parent: "c:",
              inputs: { NUM1: [3, "c=", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c=": {
              opcode: "operator_round",
              next: null,
              parent: "c;",
              inputs: { NUM: [3, "c?", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c?": {
              opcode: "operator_divide",
              next: null,
              parent: "c=",
              inputs: { NUM1: [3, "f)", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f)": {
              opcode: "operator_subtract",
              next: null,
              parent: "c?",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c/": {
              opcode: "data_setvariableto",
              next: "f*",
              parent: "aa",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            r: {
              opcode: "control_if",
              next: "af",
              parent: "%",
              inputs: { CONDITION: [2, "ag"], SUBSTACK: [2, "ah"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ag: {
              opcode: "operator_or",
              next: null,
              parent: "r",
              inputs: { OPERAND1: [2, "c@"], OPERAND2: [2, "c["] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c@": {
              opcode: "operator_gt",
              next: null,
              parent: "ag",
              inputs: {
                OPERAND1: [3, "ai", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ai: {
              opcode: "operator_letter_of",
              next: null,
              parent: "c@",
              inputs: {
                STRING: [3, "c]", [10, ""]],
                LETTER: [3, "c^", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c]": {
              opcode: "data_itemoflist",
              next: null,
              parent: "ai",
              inputs: { INDEX: [3, "aj", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aj: {
              opcode: "operator_add",
              next: null,
              parent: "c]",
              inputs: { NUM1: [3, "c_", [4, ""]], NUM2: [3, "c`", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            c_: {
              opcode: "operator_round",
              next: null,
              parent: "aj",
              inputs: { NUM: [3, "f+", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f+": {
              opcode: "operator_divide",
              next: null,
              parent: "c_",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c^": {
              opcode: "operator_add",
              next: null,
              parent: "ai",
              inputs: { NUM1: [3, "c{", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c{": {
              opcode: "operator_round",
              next: null,
              parent: "c^",
              inputs: { NUM: [3, "f,", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f,": {
              opcode: "operator_divide",
              next: null,
              parent: "c{",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c[": {
              opcode: "operator_gt",
              next: null,
              parent: "ag",
              inputs: {
                OPERAND1: [3, "ak", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ak: {
              opcode: "operator_letter_of",
              next: null,
              parent: "c[",
              inputs: {
                STRING: [3, "c|", [10, ""]],
                LETTER: [3, "c}", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c|": {
              opcode: "data_itemoflist",
              next: null,
              parent: "ak",
              inputs: { INDEX: [3, "al", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            al: {
              opcode: "operator_add",
              next: null,
              parent: "c|",
              inputs: { NUM1: [3, "c~", [4, ""]], NUM2: [3, "da", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c~": {
              opcode: "operator_round",
              next: null,
              parent: "al",
              inputs: { NUM: [3, "f-", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f-": {
              opcode: "operator_divide",
              next: null,
              parent: "c~",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c}": {
              opcode: "operator_add",
              next: null,
              parent: "ak",
              inputs: { NUM1: [3, "db", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            db: {
              opcode: "operator_round",
              next: null,
              parent: "c}",
              inputs: { NUM: [3, "f.", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f.": {
              opcode: "operator_divide",
              next: null,
              parent: "db",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ah: {
              opcode: "data_setvariableto",
              next: "f/",
              parent: "r",
              inputs: { VALUE: [3, "dc", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            dc: {
              opcode: "operator_add",
              next: null,
              parent: "ah",
              inputs: { NUM1: [3, "dd", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dd: {
              opcode: "operator_multiply",
              next: null,
              parent: "dc",
              inputs: { NUM1: [3, "de", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            de: {
              opcode: "operator_round",
              next: null,
              parent: "dd",
              inputs: { NUM: [3, "df", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            df: {
              opcode: "operator_divide",
              next: null,
              parent: "de",
              inputs: { NUM1: [3, "f:", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f:": {
              opcode: "operator_subtract",
              next: null,
              parent: "df",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f/": {
              opcode: "data_setvariableto",
              next: null,
              parent: "ah",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            af: {
              opcode: "control_if",
              next: null,
              parent: "r",
              inputs: { CONDITION: [2, "am"], SUBSTACK: [2, "an"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            am: {
              opcode: "operator_or",
              next: null,
              parent: "af",
              inputs: { OPERAND1: [2, "dg"], OPERAND2: [2, "dh"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dg: {
              opcode: "operator_gt",
              next: null,
              parent: "am",
              inputs: {
                OPERAND1: [3, "ao", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ao: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dg",
              inputs: {
                STRING: [3, "di", [10, ""]],
                LETTER: [3, "dj", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            di: {
              opcode: "data_itemoflist",
              next: null,
              parent: "ao",
              inputs: { INDEX: [3, "ap", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ap: {
              opcode: "operator_add",
              next: null,
              parent: "di",
              inputs: { NUM1: [3, "dk", [4, ""]], NUM2: [3, "dl", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dk: {
              opcode: "operator_round",
              next: null,
              parent: "ap",
              inputs: { NUM: [3, "f;", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f;": {
              opcode: "operator_divide",
              next: null,
              parent: "dk",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dj: {
              opcode: "operator_add",
              next: null,
              parent: "ao",
              inputs: { NUM1: [3, "dm", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dm: {
              opcode: "operator_round",
              next: null,
              parent: "dj",
              inputs: { NUM: [3, "f=", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f=": {
              opcode: "operator_divide",
              next: null,
              parent: "dm",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dh: {
              opcode: "operator_gt",
              next: null,
              parent: "am",
              inputs: {
                OPERAND1: [3, "aq", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aq: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dh",
              inputs: {
                STRING: [3, "dn", [10, ""]],
                LETTER: [3, "do", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dn: {
              opcode: "data_itemoflist",
              next: null,
              parent: "aq",
              inputs: { INDEX: [3, "ar", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ar: {
              opcode: "operator_add",
              next: null,
              parent: "dn",
              inputs: { NUM1: [3, "dp", [4, ""]], NUM2: [3, "dq", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dp: {
              opcode: "operator_round",
              next: null,
              parent: "ar",
              inputs: { NUM: [3, "f?", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f?": {
              opcode: "operator_divide",
              next: null,
              parent: "dp",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            do: {
              opcode: "operator_add",
              next: null,
              parent: "aq",
              inputs: { NUM1: [3, "dr", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dr: {
              opcode: "operator_round",
              next: null,
              parent: "do",
              inputs: { NUM: [3, "f@", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f@": {
              opcode: "operator_divide",
              next: null,
              parent: "dr",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            an: {
              opcode: "data_setvariableto",
              next: "ds",
              parent: "af",
              inputs: { VALUE: [3, "dt", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            dt: {
              opcode: "operator_add",
              next: null,
              parent: "an",
              inputs: { NUM1: [3, "du", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            du: {
              opcode: "operator_multiply",
              next: null,
              parent: "dt",
              inputs: { NUM1: [3, "dv", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dv: {
              opcode: "operator_round",
              next: null,
              parent: "du",
              inputs: { NUM: [3, "dw", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dw: {
              opcode: "operator_divide",
              next: null,
              parent: "dv",
              inputs: { NUM1: [3, "f[", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f[": {
              opcode: "operator_subtract",
              next: null,
              parent: "dw",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ds: {
              opcode: "data_setvariableto",
              next: "f]",
              parent: "an",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            i: {
              opcode: "control_repeat",
              next: "G",
              parent: "m",
              inputs: { TIMES: [3, "dx", [6, ""]], SUBSTACK: [2, "bO"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f^": {
              opcode: "operator_divide",
              next: null,
              parent: "dx",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bO: {
              opcode: "data_changevariableby",
              next: "k",
              parent: "i",
              inputs: { VALUE: [1, [4, "10"]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            dx: {
              opcode: "operator_mathop",
              next: null,
              parent: "i",
              inputs: { NUM: [3, "f^", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            fg: {
              opcode: "operator_mod",
              next: null,
              parent: "G",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            j: {
              opcode: "control_if",
              next: "as",
              parent: "G",
              inputs: { CONDITION: [2, "at"], SUBSTACK: [2, "au"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            at: {
              opcode: "operator_or",
              next: null,
              parent: "j",
              inputs: { OPERAND1: [2, "dy"], OPERAND2: [2, "dz"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dy: {
              opcode: "operator_gt",
              next: null,
              parent: "at",
              inputs: {
                OPERAND1: [3, "av", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            av: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dy",
              inputs: {
                STRING: [3, "dA", [10, ""]],
                LETTER: [3, "dB", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dA: {
              opcode: "data_itemoflist",
              next: null,
              parent: "av",
              inputs: { INDEX: [3, "aw", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aw: {
              opcode: "operator_add",
              next: null,
              parent: "dA",
              inputs: { NUM1: [3, "dC", [4, ""]], NUM2: [3, "dD", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dC: {
              opcode: "operator_round",
              next: null,
              parent: "aw",
              inputs: { NUM: [3, "f_", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            f_: {
              opcode: "operator_divide",
              next: null,
              parent: "dC",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dB: {
              opcode: "operator_add",
              next: null,
              parent: "av",
              inputs: { NUM1: [3, "dE", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dE: {
              opcode: "operator_round",
              next: null,
              parent: "dB",
              inputs: { NUM: [3, "f`", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f`": {
              opcode: "operator_divide",
              next: null,
              parent: "dE",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dz: {
              opcode: "operator_gt",
              next: null,
              parent: "at",
              inputs: {
                OPERAND1: [3, "ax", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ax: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dz",
              inputs: {
                STRING: [3, "dF", [10, ""]],
                LETTER: [3, "dG", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dF: {
              opcode: "data_itemoflist",
              next: null,
              parent: "ax",
              inputs: { INDEX: [3, "ay", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ay: {
              opcode: "operator_add",
              next: null,
              parent: "dF",
              inputs: { NUM1: [3, "dH", [4, ""]], NUM2: [3, "dI", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dH: {
              opcode: "operator_round",
              next: null,
              parent: "ay",
              inputs: { NUM: [3, "f{", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f{": {
              opcode: "operator_divide",
              next: null,
              parent: "dH",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dG: {
              opcode: "operator_add",
              next: null,
              parent: "ax",
              inputs: { NUM1: [3, "dJ", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dJ: {
              opcode: "operator_round",
              next: null,
              parent: "dG",
              inputs: { NUM: [3, "f|", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f|": {
              opcode: "operator_divide",
              next: null,
              parent: "dJ",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            au: {
              opcode: "data_setvariableto",
              next: "f}",
              parent: "j",
              inputs: { VALUE: [3, "dK", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            dK: {
              opcode: "operator_add",
              next: null,
              parent: "au",
              inputs: { NUM1: [3, "dL", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dL: {
              opcode: "operator_multiply",
              next: null,
              parent: "dK",
              inputs: { NUM1: [3, "dM", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dM: {
              opcode: "operator_round",
              next: null,
              parent: "dL",
              inputs: { NUM: [3, "dN", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dN: {
              opcode: "operator_divide",
              next: null,
              parent: "dM",
              inputs: { NUM1: [3, "f~", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f~": {
              opcode: "operator_subtract",
              next: null,
              parent: "dN",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f}": {
              opcode: "data_setvariableto",
              next: null,
              parent: "au",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            as: {
              opcode: "control_if",
              next: null,
              parent: "j",
              inputs: { CONDITION: [2, "az"], SUBSTACK: [2, "aA"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            az: {
              opcode: "operator_or",
              next: null,
              parent: "as",
              inputs: { OPERAND1: [2, "dO"], OPERAND2: [2, "dP"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dO: {
              opcode: "operator_gt",
              next: null,
              parent: "az",
              inputs: {
                OPERAND1: [3, "aB", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aB: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dO",
              inputs: {
                STRING: [3, "dQ", [10, ""]],
                LETTER: [3, "dR", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dQ: {
              opcode: "data_itemoflist",
              next: null,
              parent: "aB",
              inputs: { INDEX: [3, "aC", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aC: {
              opcode: "operator_add",
              next: null,
              parent: "dQ",
              inputs: { NUM1: [3, "dS", [4, ""]], NUM2: [3, "dT", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dS: {
              opcode: "operator_round",
              next: null,
              parent: "aC",
              inputs: { NUM: [3, "ga", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ga: {
              opcode: "operator_divide",
              next: null,
              parent: "dS",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dR: {
              opcode: "operator_add",
              next: null,
              parent: "aB",
              inputs: { NUM1: [3, "dU", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dU: {
              opcode: "operator_round",
              next: null,
              parent: "dR",
              inputs: { NUM: [3, "gb", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gb: {
              opcode: "operator_divide",
              next: null,
              parent: "dU",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dP: {
              opcode: "operator_gt",
              next: null,
              parent: "az",
              inputs: {
                OPERAND1: [3, "aD", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aD: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dP",
              inputs: {
                STRING: [3, "dV", [10, ""]],
                LETTER: [3, "dW", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dV: {
              opcode: "data_itemoflist",
              next: null,
              parent: "aD",
              inputs: { INDEX: [3, "aE", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aE: {
              opcode: "operator_add",
              next: null,
              parent: "dV",
              inputs: { NUM1: [3, "dX", [4, ""]], NUM2: [3, "dY", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dX: {
              opcode: "operator_round",
              next: null,
              parent: "aE",
              inputs: { NUM: [3, "gc", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gc: {
              opcode: "operator_divide",
              next: null,
              parent: "dX",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dW: {
              opcode: "operator_add",
              next: null,
              parent: "aD",
              inputs: { NUM1: [3, "dZ", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dZ: {
              opcode: "operator_round",
              next: null,
              parent: "dW",
              inputs: { NUM: [3, "gd", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gd: {
              opcode: "operator_divide",
              next: null,
              parent: "dZ",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aA: {
              opcode: "data_setvariableto",
              next: "ge",
              parent: "as",
              inputs: { VALUE: [3, "d!", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "d!": {
              opcode: "operator_add",
              next: null,
              parent: "aA",
              inputs: { NUM1: [3, "d#", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d#": {
              opcode: "operator_multiply",
              next: null,
              parent: "d!",
              inputs: { NUM1: [3, "d%", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d%": {
              opcode: "operator_round",
              next: null,
              parent: "d#",
              inputs: { NUM: [3, "d(", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d(": {
              opcode: "operator_divide",
              next: null,
              parent: "d%",
              inputs: { NUM1: [3, "gf", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gf: {
              opcode: "operator_subtract",
              next: null,
              parent: "d(",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ge: {
              opcode: "data_setvariableto",
              next: null,
              parent: "aA",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            m: {
              opcode: "control_if_else",
              next: null,
              parent: "b|",
              inputs: {
                SUBSTACK: [2, "i"],
                CONDITION: [2, "gg"],
                SUBSTACK2: [2, "s"],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gg: {
              opcode: "operator_gt",
              next: null,
              parent: "m",
              inputs: {
                OPERAND1: [
                  3,
                  [12, "speed x", "*;me:g-HOyhqXS4?0h6l"],
                  [10, ""],
                ],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            s: {
              opcode: "control_repeat",
              next: "aF",
              parent: "m",
              inputs: { TIMES: [3, "d)", [6, ""]], SUBSTACK: [2, "d*"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d)": {
              opcode: "operator_mathop",
              next: null,
              parent: "s",
              inputs: { NUM: [3, "gh", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            gh: {
              opcode: "operator_divide",
              next: null,
              parent: "d)",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "-10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d*": {
              opcode: "data_changevariableby",
              next: "t",
              parent: "s",
              inputs: { VALUE: [1, [4, "-10"]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            t: {
              opcode: "control_if",
              next: "aG",
              parent: "d*",
              inputs: { CONDITION: [2, "aH"], SUBSTACK: [2, "aI"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aH: {
              opcode: "operator_or",
              next: null,
              parent: "t",
              inputs: { OPERAND1: [2, "d+"], OPERAND2: [2, "d,"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d+": {
              opcode: "operator_gt",
              next: null,
              parent: "aH",
              inputs: {
                OPERAND1: [3, "aJ", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aJ: {
              opcode: "operator_letter_of",
              next: null,
              parent: "d+",
              inputs: {
                STRING: [3, "d-", [10, ""]],
                LETTER: [3, "d.", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d-": {
              opcode: "data_itemoflist",
              next: null,
              parent: "aJ",
              inputs: { INDEX: [3, "aK", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aK: {
              opcode: "operator_add",
              next: null,
              parent: "d-",
              inputs: { NUM1: [3, "d/", [4, ""]], NUM2: [3, "d:", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d/": {
              opcode: "operator_round",
              next: null,
              parent: "aK",
              inputs: { NUM: [3, "gi", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gi: {
              opcode: "operator_divide",
              next: null,
              parent: "d/",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d.": {
              opcode: "operator_add",
              next: null,
              parent: "aJ",
              inputs: { NUM1: [3, "d;", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d;": {
              opcode: "operator_round",
              next: null,
              parent: "d.",
              inputs: { NUM: [3, "gj", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gj: {
              opcode: "operator_divide",
              next: null,
              parent: "d;",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d,": {
              opcode: "operator_gt",
              next: null,
              parent: "aH",
              inputs: {
                OPERAND1: [3, "aL", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aL: {
              opcode: "operator_letter_of",
              next: null,
              parent: "d,",
              inputs: {
                STRING: [3, "d=", [10, ""]],
                LETTER: [3, "d?", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d=": {
              opcode: "data_itemoflist",
              next: null,
              parent: "aL",
              inputs: { INDEX: [3, "aM", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aM: {
              opcode: "operator_add",
              next: null,
              parent: "d=",
              inputs: { NUM1: [3, "d@", [4, ""]], NUM2: [3, "d[", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d@": {
              opcode: "operator_round",
              next: null,
              parent: "aM",
              inputs: { NUM: [3, "gk", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gk: {
              opcode: "operator_divide",
              next: null,
              parent: "d@",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d?": {
              opcode: "operator_add",
              next: null,
              parent: "aL",
              inputs: { NUM1: [3, "d]", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d]": {
              opcode: "operator_round",
              next: null,
              parent: "d?",
              inputs: { NUM: [3, "gl", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gl: {
              opcode: "operator_divide",
              next: null,
              parent: "d]",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aI: {
              opcode: "data_setvariableto",
              next: "gm",
              parent: "t",
              inputs: { VALUE: [3, "d^", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "d^": {
              opcode: "operator_add",
              next: null,
              parent: "aI",
              inputs: { NUM1: [3, "d_", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            d_: {
              opcode: "operator_multiply",
              next: null,
              parent: "d^",
              inputs: { NUM1: [3, "d`", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d`": {
              opcode: "operator_round",
              next: null,
              parent: "d_",
              inputs: { NUM: [3, "d{", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d{": {
              opcode: "operator_divide",
              next: null,
              parent: "d`",
              inputs: { NUM1: [3, "gn", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gn: {
              opcode: "operator_subtract",
              next: null,
              parent: "d{",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gm: {
              opcode: "data_setvariableto",
              next: null,
              parent: "aI",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            aG: {
              opcode: "control_if",
              next: null,
              parent: "t",
              inputs: { CONDITION: [2, "aN"], SUBSTACK: [2, "aO"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aN: {
              opcode: "operator_or",
              next: null,
              parent: "aG",
              inputs: { OPERAND1: [2, "d|"], OPERAND2: [2, "d}"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d|": {
              opcode: "operator_gt",
              next: null,
              parent: "aN",
              inputs: {
                OPERAND1: [3, "aP", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aP: {
              opcode: "operator_letter_of",
              next: null,
              parent: "d|",
              inputs: {
                STRING: [3, "d~", [10, ""]],
                LETTER: [3, "ea", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d~": {
              opcode: "data_itemoflist",
              next: null,
              parent: "aP",
              inputs: { INDEX: [3, "aQ", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aQ: {
              opcode: "operator_add",
              next: null,
              parent: "d~",
              inputs: { NUM1: [3, "eb", [4, ""]], NUM2: [3, "ec", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eb: {
              opcode: "operator_round",
              next: null,
              parent: "aQ",
              inputs: { NUM: [3, "go", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            go: {
              opcode: "operator_divide",
              next: null,
              parent: "eb",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ea: {
              opcode: "operator_add",
              next: null,
              parent: "aP",
              inputs: { NUM1: [3, "ed", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ed: {
              opcode: "operator_round",
              next: null,
              parent: "ea",
              inputs: { NUM: [3, "gp", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gp: {
              opcode: "operator_divide",
              next: null,
              parent: "ed",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d}": {
              opcode: "operator_gt",
              next: null,
              parent: "aN",
              inputs: {
                OPERAND1: [3, "aR", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aR: {
              opcode: "operator_letter_of",
              next: null,
              parent: "d}",
              inputs: {
                STRING: [3, "ee", [10, ""]],
                LETTER: [3, "ef", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ee: {
              opcode: "data_itemoflist",
              next: null,
              parent: "aR",
              inputs: { INDEX: [3, "aS", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aS: {
              opcode: "operator_add",
              next: null,
              parent: "ee",
              inputs: { NUM1: [3, "eg", [4, ""]], NUM2: [3, "eh", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eg: {
              opcode: "operator_round",
              next: null,
              parent: "aS",
              inputs: { NUM: [3, "gq", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gq: {
              opcode: "operator_divide",
              next: null,
              parent: "eg",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ef: {
              opcode: "operator_add",
              next: null,
              parent: "aR",
              inputs: { NUM1: [3, "ei", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ei: {
              opcode: "operator_round",
              next: null,
              parent: "ef",
              inputs: { NUM: [3, "gr", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gr: {
              opcode: "operator_divide",
              next: null,
              parent: "ei",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aO: {
              opcode: "data_setvariableto",
              next: "gs",
              parent: "aG",
              inputs: { VALUE: [3, "ej", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            ej: {
              opcode: "operator_add",
              next: null,
              parent: "aO",
              inputs: { NUM1: [3, "ek", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ek: {
              opcode: "operator_multiply",
              next: null,
              parent: "ej",
              inputs: { NUM1: [3, "el", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            el: {
              opcode: "operator_round",
              next: null,
              parent: "ek",
              inputs: { NUM: [3, "em", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            em: {
              opcode: "operator_divide",
              next: null,
              parent: "el",
              inputs: { NUM1: [3, "gt", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gt: {
              opcode: "operator_subtract",
              next: null,
              parent: "em",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gs: {
              opcode: "data_setvariableto",
              next: null,
              parent: "aO",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            aF: {
              opcode: "data_changevariableby",
              next: "u",
              parent: "s",
              inputs: { VALUE: [3, "gu", [4, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            gu: {
              opcode: "operator_mod",
              next: null,
              parent: "aF",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "-10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            u: {
              opcode: "control_if",
              next: "aT",
              parent: "aF",
              inputs: { CONDITION: [2, "aU"], SUBSTACK: [2, "aV"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aU: {
              opcode: "operator_or",
              next: null,
              parent: "u",
              inputs: { OPERAND1: [2, "en"], OPERAND2: [2, "eo"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            en: {
              opcode: "operator_gt",
              next: null,
              parent: "aU",
              inputs: {
                OPERAND1: [3, "aW", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aW: {
              opcode: "operator_letter_of",
              next: null,
              parent: "en",
              inputs: {
                STRING: [3, "ep", [10, ""]],
                LETTER: [3, "eq", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ep: {
              opcode: "data_itemoflist",
              next: null,
              parent: "aW",
              inputs: { INDEX: [3, "aX", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aX: {
              opcode: "operator_add",
              next: null,
              parent: "ep",
              inputs: { NUM1: [3, "er", [4, ""]], NUM2: [3, "es", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            er: {
              opcode: "operator_round",
              next: null,
              parent: "aX",
              inputs: { NUM: [3, "gv", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gv: {
              opcode: "operator_divide",
              next: null,
              parent: "er",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eq: {
              opcode: "operator_add",
              next: null,
              parent: "aW",
              inputs: { NUM1: [3, "et", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            et: {
              opcode: "operator_round",
              next: null,
              parent: "eq",
              inputs: { NUM: [3, "gw", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gw: {
              opcode: "operator_divide",
              next: null,
              parent: "et",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eo: {
              opcode: "operator_gt",
              next: null,
              parent: "aU",
              inputs: {
                OPERAND1: [3, "aY", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aY: {
              opcode: "operator_letter_of",
              next: null,
              parent: "eo",
              inputs: {
                STRING: [3, "eu", [10, ""]],
                LETTER: [3, "ev", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eu: {
              opcode: "data_itemoflist",
              next: null,
              parent: "aY",
              inputs: { INDEX: [3, "aZ", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            aZ: {
              opcode: "operator_add",
              next: null,
              parent: "eu",
              inputs: { NUM1: [3, "ew", [4, ""]], NUM2: [3, "ex", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ew: {
              opcode: "operator_round",
              next: null,
              parent: "aZ",
              inputs: { NUM: [3, "gx", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gx: {
              opcode: "operator_divide",
              next: null,
              parent: "ew",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ev: {
              opcode: "operator_add",
              next: null,
              parent: "aY",
              inputs: { NUM1: [3, "ey", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ey: {
              opcode: "operator_round",
              next: null,
              parent: "ev",
              inputs: { NUM: [3, "gy", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gy: {
              opcode: "operator_divide",
              next: null,
              parent: "ey",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aV: {
              opcode: "data_setvariableto",
              next: "gz",
              parent: "u",
              inputs: { VALUE: [3, "ez", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            ez: {
              opcode: "operator_add",
              next: null,
              parent: "aV",
              inputs: { NUM1: [3, "eA", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eA: {
              opcode: "operator_multiply",
              next: null,
              parent: "ez",
              inputs: { NUM1: [3, "eB", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eB: {
              opcode: "operator_round",
              next: null,
              parent: "eA",
              inputs: { NUM: [3, "eC", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eC: {
              opcode: "operator_divide",
              next: null,
              parent: "eB",
              inputs: { NUM1: [3, "gA", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gA: {
              opcode: "operator_subtract",
              next: null,
              parent: "eC",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gz: {
              opcode: "data_setvariableto",
              next: null,
              parent: "aV",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            aT: {
              opcode: "control_if",
              next: null,
              parent: "u",
              inputs: { CONDITION: [2, "a!"], SUBSTACK: [2, "a#"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a!": {
              opcode: "operator_or",
              next: null,
              parent: "aT",
              inputs: { OPERAND1: [2, "eD"], OPERAND2: [2, "eE"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eD: {
              opcode: "operator_gt",
              next: null,
              parent: "a!",
              inputs: {
                OPERAND1: [3, "a%", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a%": {
              opcode: "operator_letter_of",
              next: null,
              parent: "eD",
              inputs: {
                STRING: [3, "eF", [10, ""]],
                LETTER: [3, "eG", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eF: {
              opcode: "data_itemoflist",
              next: null,
              parent: "a%",
              inputs: { INDEX: [3, "a(", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "a(": {
              opcode: "operator_add",
              next: null,
              parent: "eF",
              inputs: { NUM1: [3, "eH", [4, ""]], NUM2: [3, "eI", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eH: {
              opcode: "operator_round",
              next: null,
              parent: "a(",
              inputs: { NUM: [3, "gB", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gB: {
              opcode: "operator_divide",
              next: null,
              parent: "eH",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eG: {
              opcode: "operator_add",
              next: null,
              parent: "a%",
              inputs: { NUM1: [3, "eJ", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eJ: {
              opcode: "operator_round",
              next: null,
              parent: "eG",
              inputs: { NUM: [3, "gC", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gC: {
              opcode: "operator_divide",
              next: null,
              parent: "eJ",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eE: {
              opcode: "operator_gt",
              next: null,
              parent: "a!",
              inputs: {
                OPERAND1: [3, "a)", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a)": {
              opcode: "operator_letter_of",
              next: null,
              parent: "eE",
              inputs: {
                STRING: [3, "eK", [10, ""]],
                LETTER: [3, "eL", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eK: {
              opcode: "data_itemoflist",
              next: null,
              parent: "a)",
              inputs: { INDEX: [3, "a*", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "a*": {
              opcode: "operator_add",
              next: null,
              parent: "eK",
              inputs: { NUM1: [3, "eM", [4, ""]], NUM2: [3, "eN", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eM: {
              opcode: "operator_round",
              next: null,
              parent: "a*",
              inputs: { NUM: [3, "gD", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gD: {
              opcode: "operator_divide",
              next: null,
              parent: "eM",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eL: {
              opcode: "operator_add",
              next: null,
              parent: "a)",
              inputs: { NUM1: [3, "eO", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eO: {
              opcode: "operator_round",
              next: null,
              parent: "eL",
              inputs: { NUM: [3, "gE", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gE: {
              opcode: "operator_divide",
              next: null,
              parent: "eO",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a#": {
              opcode: "data_setvariableto",
              next: "gF",
              parent: "aT",
              inputs: { VALUE: [3, "eP", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            eP: {
              opcode: "operator_add",
              next: null,
              parent: "a#",
              inputs: { NUM1: [3, "eQ", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eQ: {
              opcode: "operator_multiply",
              next: null,
              parent: "eP",
              inputs: { NUM1: [3, "eR", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eR: {
              opcode: "operator_round",
              next: null,
              parent: "eQ",
              inputs: { NUM: [3, "eS", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eS: {
              opcode: "operator_divide",
              next: null,
              parent: "eR",
              inputs: { NUM1: [3, "gG", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gG: {
              opcode: "operator_subtract",
              next: null,
              parent: "eS",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gF: {
              opcode: "data_setvariableto",
              next: null,
              parent: "a#",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            fZ: {
              opcode: "data_setvariableto",
              next: null,
              parent: "cT",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            "f*": {
              opcode: "data_setvariableto",
              next: null,
              parent: "c/",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            a: {
              opcode: "control_if_else",
              next: "eT",
              parent: "bf",
              inputs: {
                CONDITION: [2, "eU"],
                SUBSTACK: [2, "a+"],
                SUBSTACK2: [2, "gH"],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eU: {
              opcode: "sensing_keypressed",
              next: null,
              parent: "a",
              inputs: { KEY_OPTION: [1, "gI"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gI: {
              opcode: "sensing_keyoptions",
              next: null,
              parent: "eU",
              inputs: {},
              fields: { KEY_OPTION: ["up arrow", null] },
              shadow: true,
              topLevel: false,
            },
            gJ: {
              opcode: "operator_lt",
              next: null,
              parent: "a+",
              inputs: {
                OPERAND1: [
                  3,
                  [12, "jump level", "{WG8L;z]k}]DSIo]@Uk@"],
                  [10, ""],
                ],
                OPERAND2: [1, [10, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a,": {
              opcode: "data_setvariableto",
              next: "gK",
              parent: "a+",
              inputs: { VALUE: [3, "gL", [10, ""]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            gK: {
              opcode: "data_changevariableby",
              next: null,
              parent: "a,",
              inputs: { VALUE: [1, [4, "1"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            eT: {
              opcode: "procedures_call",
              next: "v",
              parent: "a",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
              mutation: {
                tagName: "mutation",
                children: [],
                proccode: "当たり判定y",
                argumentids: "[]",
                warp: "true",
              },
            },
            v: {
              opcode: "control_if",
              next: "w",
              parent: "eT",
              inputs: { CONDITION: [2, "eV"], SUBSTACK: [2, "gM"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eV: {
              opcode: "sensing_keypressed",
              next: null,
              parent: "v",
              inputs: { KEY_OPTION: [1, "gN"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gN: {
              opcode: "sensing_keyoptions",
              next: null,
              parent: "eV",
              inputs: {},
              fields: { KEY_OPTION: ["right arrow", null] },
              shadow: true,
              topLevel: false,
            },
            gM: {
              opcode: "data_changevariableby",
              next: null,
              parent: "v",
              inputs: { VALUE: [1, [4, "4"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            w: {
              opcode: "control_if",
              next: "a-",
              parent: "v",
              inputs: { CONDITION: [2, "eW"], SUBSTACK: [2, "gO"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eW: {
              opcode: "sensing_keypressed",
              next: null,
              parent: "w",
              inputs: { KEY_OPTION: [1, "gP"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gP: {
              opcode: "sensing_keyoptions",
              next: null,
              parent: "eW",
              inputs: {},
              fields: { KEY_OPTION: ["left arrow", null] },
              shadow: true,
              topLevel: false,
            },
            gO: {
              opcode: "data_changevariableby",
              next: null,
              parent: "w",
              inputs: { VALUE: [1, [4, "-4"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            "a-": {
              opcode: "data_setvariableto",
              next: "eX",
              parent: "w",
              inputs: { VALUE: [3, "gQ", [10, ""]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            gQ: {
              opcode: "operator_multiply",
              next: null,
              parent: "a-",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "0.8"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eX: {
              opcode: "procedures_call",
              next: "a.",
              parent: "a-",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
              mutation: {
                tagName: "mutation",
                children: [],
                proccode: "当たり判定x",
                argumentids: "[]",
                warp: "true",
              },
            },
            "a.": {
              opcode: "motion_gotoxy",
              next: null,
              parent: "eX",
              inputs: { X: [3, "gR", [4, ""]], Y: [3, "gS", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gR: {
              opcode: "operator_subtract",
              next: null,
              parent: "a.",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gS: {
              opcode: "operator_subtract",
              next: null,
              parent: "a.",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a+": {
              opcode: "control_if",
              next: null,
              parent: "a",
              inputs: { SUBSTACK: [2, "a,"], CONDITION: [2, "gJ"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gH: {
              opcode: "data_setvariableto",
              next: null,
              parent: "a",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            gL: {
              opcode: "operator_subtract",
              next: null,
              parent: "a,",
              inputs: {
                NUM1: [1, [4, "16"]],
                NUM2: [3, [12, "jump level", "{WG8L;z]k}]DSIo]@Uk@"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bd: {
              opcode: "data_setvariableto",
              next: "be",
              parent: "bc",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            "f]": {
              opcode: "data_setvariableto",
              next: null,
              parent: "ds",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            fn: {
              opcode: "data_setvariableto",
              next: null,
              parent: "bJ",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            bl: {
              opcode: "operator_subtract",
              next: null,
              parent: "F",
              inputs: { NUM1: [3, "gT", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gT: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "bl",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bC: {
              opcode: "operator_subtract",
              next: null,
              parent: "M",
              inputs: { NUM1: [3, "gU", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gU: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "bC",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "c`": {
              opcode: "operator_subtract",
              next: null,
              parent: "aj",
              inputs: { NUM1: [3, "gV", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gV: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "c`",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dl: {
              opcode: "operator_subtract",
              next: null,
              parent: "ap",
              inputs: { NUM1: [3, "gW", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gW: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "dl",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cg: {
              opcode: "operator_subtract",
              next: null,
              parent: "-",
              inputs: { NUM1: [3, "gX", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gX: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "cg",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cw: {
              opcode: "operator_subtract",
              next: null,
              parent: "?",
              inputs: { NUM1: [3, "gY", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gY: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "cw",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cM: {
              opcode: "operator_subtract",
              next: null,
              parent: "{",
              inputs: { NUM1: [3, "gZ", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gZ: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "cM",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "c(": {
              opcode: "operator_subtract",
              next: null,
              parent: "ac",
              inputs: { NUM1: [3, "g!", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g!": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "c(",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bU: {
              opcode: "operator_subtract",
              next: null,
              parent: "T",
              inputs: { NUM1: [3, "g#", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g#": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "bU",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "b/": {
              opcode: "operator_subtract",
              next: null,
              parent: "Z",
              inputs: { NUM1: [3, "g%", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g%": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "b/",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dD: {
              opcode: "operator_subtract",
              next: null,
              parent: "aw",
              inputs: { NUM1: [3, "g(", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g(": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "dD",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dT: {
              opcode: "operator_subtract",
              next: null,
              parent: "aC",
              inputs: { NUM1: [3, "g)", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g)": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "dT",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "d:": {
              opcode: "operator_subtract",
              next: null,
              parent: "aK",
              inputs: { NUM1: [3, "g*", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g*": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "d:",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ec: {
              opcode: "operator_subtract",
              next: null,
              parent: "aQ",
              inputs: { NUM1: [3, "g+", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g+": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "ec",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            es: {
              opcode: "operator_subtract",
              next: null,
              parent: "aX",
              inputs: { NUM1: [3, "g,", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g,": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "es",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            eI: {
              opcode: "operator_subtract",
              next: null,
              parent: "a(",
              inputs: { NUM1: [3, "g-", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g-": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "eI",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            eN: {
              opcode: "operator_subtract",
              next: null,
              parent: "a*",
              inputs: { NUM1: [3, "g.", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g.": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "eN",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ex: {
              opcode: "operator_subtract",
              next: null,
              parent: "aZ",
              inputs: { NUM1: [3, "g/", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g/": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "ex",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            eh: {
              opcode: "operator_subtract",
              next: null,
              parent: "aS",
              inputs: { NUM1: [3, "g:", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g:": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "eh",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "d[": {
              opcode: "operator_subtract",
              next: null,
              parent: "aM",
              inputs: { NUM1: [3, "g;", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g;": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "d[",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dY: {
              opcode: "operator_subtract",
              next: null,
              parent: "aE",
              inputs: { NUM1: [3, "g=", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g=": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "dY",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dI: {
              opcode: "operator_subtract",
              next: null,
              parent: "ay",
              inputs: { NUM1: [3, "g?", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g?": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "dI",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "b@": {
              opcode: "operator_subtract",
              next: null,
              parent: "#",
              inputs: { NUM1: [3, "g@", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g@": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "b@",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bZ: {
              opcode: "operator_subtract",
              next: null,
              parent: "V",
              inputs: { NUM1: [3, "g[", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g[": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "bZ",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "c-": {
              opcode: "operator_subtract",
              next: null,
              parent: "ae",
              inputs: { NUM1: [3, "g]", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g]": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "c-",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cR: {
              opcode: "operator_subtract",
              next: null,
              parent: "}",
              inputs: { NUM1: [3, "g^", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g^": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "cR",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cB: {
              opcode: "operator_subtract",
              next: null,
              parent: "[",
              inputs: { NUM1: [3, "g_", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            g_: {
              opcode: "data_lengthoflist",
              next: null,
              parent: "cB",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cl: {
              opcode: "operator_subtract",
              next: null,
              parent: "/",
              inputs: { NUM1: [3, "g`", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g`": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "cl",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dq: {
              opcode: "operator_subtract",
              next: null,
              parent: "ar",
              inputs: { NUM1: [3, "g{", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g{": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "dq",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            da: {
              opcode: "operator_subtract",
              next: null,
              parent: "al",
              inputs: { NUM1: [3, "g|", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g|": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "da",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bH: {
              opcode: "operator_subtract",
              next: null,
              parent: "O",
              inputs: { NUM1: [3, "g}", [4, ""]], NUM2: [1, [4, "8"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g}": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "bH",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bv: {
              opcode: "operator_subtract",
              next: null,
              parent: "I",
              inputs: { NUM1: [3, "g~", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "g~": {
              opcode: "data_lengthoflist",
              next: null,
              parent: "bv",
              inputs: {},
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
          },
          comments: {},
          currentCostume: 0,
          costumes: [
            {
              name: "player",
              bitmapResolution: 1,
              dataFormat: "svg",
              assetId: "768c5818dfacffccc2ee51945135ad38",
              md5ext: "768c5818dfacffccc2ee51945135ad38.svg",
              rotationCenterX: 10,
              rotationCenterY: 10,
            },
          ],
          sounds: [],
          volume: 100,
          layerOrder: 2,
          visible: true,
          x: 0,
          y: 0,
          size: 100,
          direction: 90,
          draggable: false,
          rotationStyle: "all around",
        },
        {
          isStage: false,
          name: "camera",
          variables: {
            "59Jm42TFU,imn(S8E!Xe": ["clone y", 0],
            "we*Ku8C`5!oJ^my*|e!i": ["clone x", 0],
          },
          lists: {},
          broadcasts: {},
          blocks: {
            ha: {
              opcode: "event_whenflagclicked",
              next: "eY",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 129,
              y: 361,
            },
            eY: {
              opcode: "data_setvariableto",
              next: "eZ",
              parent: "ha",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["scroll x", "Dvurghk]!y~Bh$7[2zA5"] },
              shadow: false,
              topLevel: false,
            },
            eZ: {
              opcode: "data_setvariableto",
              next: "e!",
              parent: "eY",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["scroll y", "2h8YgD*M18jG|aW4!Axy"] },
              shadow: false,
              topLevel: false,
            },
            "e!": {
              opcode: "control_forever",
              next: null,
              parent: "eZ",
              inputs: { SUBSTACK: [2, "b"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            b: {
              opcode: "control_if_else",
              next: "e#",
              parent: "e!",
              inputs: {
                CONDITION: [2, "hb"],
                SUBSTACK: [2, "e%"],
                SUBSTACK2: [2, "e("],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            hb: {
              opcode: "operator_lt",
              next: null,
              parent: "b",
              inputs: {
                OPERAND1: [
                  3,
                  [12, "player x", "S+8p+@wQM(qi-*DG2PC]"],
                  [10, ""],
                ],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e(": {
              opcode: "data_changevariableby",
              next: null,
              parent: "b",
              inputs: { VALUE: [3, "e)", [4, ""]] },
              fields: { VARIABLE: ["scroll x", "Dvurghk]!y~Bh$7[2zA5"] },
              shadow: false,
              topLevel: false,
            },
            "e)": {
              opcode: "operator_multiply",
              next: null,
              parent: "e(",
              inputs: { NUM1: [3, "hc", [4, ""]], NUM2: [1, [4, "0.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            hc: {
              opcode: "operator_subtract",
              next: null,
              parent: "e)",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e#": {
              opcode: "data_changevariableby",
              next: null,
              parent: "b",
              inputs: { VALUE: [3, "e*", [4, ""]] },
              fields: { VARIABLE: ["scroll y", "2h8YgD*M18jG|aW4!Axy"] },
              shadow: false,
              topLevel: false,
            },
            "e*": {
              opcode: "operator_multiply",
              next: null,
              parent: "e#",
              inputs: { NUM1: [3, "hd", [4, ""]], NUM2: [1, [4, "0.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            hd: {
              opcode: "operator_subtract",
              next: null,
              parent: "e*",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e%": {
              opcode: "data_changevariableby",
              next: null,
              parent: "b",
              inputs: { VALUE: [3, "he", [4, ""]] },
              fields: { VARIABLE: ["scroll x", "Dvurghk]!y~Bh$7[2zA5"] },
              shadow: false,
              topLevel: false,
            },
            he: {
              opcode: "operator_multiply",
              next: null,
              parent: "e%",
              inputs: {
                NUM1: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
                NUM2: [1, [4, "-0.1"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
          },
          comments: {},
          currentCostume: 0,
          costumes: [
            {
              name: "camera",
              bitmapResolution: 1,
              dataFormat: "svg",
              assetId: "3339a2953a3bf62bb80e54ff575dbced",
              md5ext: "3339a2953a3bf62bb80e54ff575dbced.svg",
              rotationCenterX: 0,
              rotationCenterY: 0,
            },
          ],
          sounds: [],
          volume: 100,
          layerOrder: 3,
          visible: false,
          x: 0,
          y: 0,
          size: 100,
          direction: 90,
          draggable: false,
          rotationStyle: "all around",
        },
      ],
      monitors: [
        {
          id: "BT=:.t$2qx+Hy0zw8B4:",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "clone x" },
          spriteName: "スプライト1",
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 5,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "M.l*44|7F!B7eZ?a.)C=",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "clone y" },
          spriteName: "スプライト1",
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 35,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "Dvurghk]!y~Bh$7[2zA5",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "scroll x" },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 5,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "2h8YgD*M18jG|aW4!Axy",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "scroll y" },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 31,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "Hv91qM{{A!%6e9!gs^{w",
          mode: "list",
          opcode: "data_listcontents",
          params: { LIST: "data" },
          spriteName: null,
          value: [],
          width: 473,
          height: 250,
          x: 7,
          y: 108,
          visible: false,
        },
        {
          id: "*;me:g-HOyhqXS4?0h6l",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "speed x" },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 211,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "lm|A+e~e,o@Dvm{Jb(m:",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "speed y" },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 237,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "S+8p+@wQM(qi-*DG2PC]",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "player x" },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 5,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "EcO;L;k5IAWZlA-s`0CR",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "player y" },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 31,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
        {
          id: "{WG8L;z]k}]DSIo]@Uk@",
          mode: "default",
          opcode: "data_variable",
          params: { VARIABLE: "jump level" },
          spriteName: null,
          value: 0,
          width: 0,
          height: 0,
          x: 5,
          y: 5,
          visible: false,
          sliderMin: 0,
          sliderMax: 100,
          isDiscrete: true,
        },
      ],
      extensions: ["pen"],
      meta: {
        semver: "3.0.0",
        vm: "0.2.0",
        agent: "",
        platform: { name: "TurboWarp", url: "https://turbowarp.org/" },
      },
    };

    const zip = new JSZip();

    for (let w = 0; w < Math.ceil(x / 480); w++) {
      for (let h = 0; h < Math.ceil(y / 360); h++) {
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">`;
        for (let i = w * 24; i < w * 24 + 24; i++) {
          for (let j = h * 18; j < h * 18 + 18; j++) {
            if (worldData.length > j) {
              if (worldData[j].length > i) {
                if (worldData[j][i] === "1") {
                  svg += `<rect x="${i * 20 - w * 480}" y="${
                    j * 20 - h * 360
                  }" width="20" height="20" fill="white"/>`;
                }
              }
            }
          }
        }
        svg += `</svg>`;
        let md5Data = md5Hash();
        zip.file(`${md5Data}.svg`, svg);
        data.targets[1].costumes.push({
          name: `${w * 480},${h * -360}`,
          bitmapResolution: 1,
          dataFormat: "svg",
          assetId: `${md5Data}`,
          md5ext: `${md5Data}.svg`,
          rotationCenterX: 240,
          rotationCenterY: 180,
        });
      }
    }

    let splite_list = [];
    polygon_data.forEach((splite) => {
      let time_list = [];
      let l_time = 0;
      splite.forEach((polygon) => {
        polygon.d.forEach((point) => {
          if (point[point.length - 1].t >= l_time) {
            l_time = point[point.length - 1].t;
          }
        });
      });
      for (let Time = 0; Time <= l_time; Time++) {
        let svg_list = `<svg xmlns="http://www.w3.org/2000/svg" width="480px" height="360px">`;
        splite.forEach((polygon) => {
          let svg_e = "";
          if (polygon.close) {
            svg_e = "z";
          }
          let polygon_list = `<path fill="${polygon.f_color}" stroke="${polygon.s_color}" d="`;
          polygon.d.forEach((point, index) => {
            timeline = point.length - 1;
            point.some((point_d, index_3) => {
              if (point_d.t > Time) {
                timeline = index_3 - 1;
                return true;
              }
            });
            if (point.length > timeline + 1) {
              point_X =
                point[timeline].x +
                ((point[timeline + 1].x - point[timeline].x) *
                  (Time - point[timeline].t)) /
                  (point[timeline + 1].t - point[timeline].t);
              point_Y =
                point[timeline].y +
                ((point[timeline + 1].y - point[timeline].y) *
                  (Time - point[timeline].t)) /
                  (point[timeline + 1].t - point[timeline].t);
            } else {
              point_X = point[timeline].x;
              point_Y = point[timeline].y;
            }
            if (index === 0) {
              polygon_list = `${polygon_list}M ${point_X}, ${point_Y} `;
            } else {
              if (point[timeline].k === "l") {
                polygon_list = `${polygon_list}L ${point_X}, ${point_Y} `;
              } else {
                polygon_list = `${polygon_list}Q ${point[timeline].cpx} ${point[timeline].cpy} ${point_X}, ${point_Y} `;
              }
            }
          });
          polygon_list = `${polygon_list}${svg_e}"/>`;
          svg_list = `${svg_list}${polygon_list}`;
        });
        svg_list = `${svg_list}</svg>`;
        time_list.push(svg_list);
      }
      splite_list.push(time_list);
    });

    let layer = 4;

    splite_list.forEach((time_e, index) => {
      let md5 = md5Hash();
      zip.file(
        `${md5}.svg`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="405">
      <rect width="540" height="405" />
      </svg>`
      );
      let splite_d = {
        isStage: false,
        name: `animation - ${index}`,
        variables: {},
        lists: {},
        broadcasts: {},
        blocks: {},
        comments: {},
        currentCostume: 0,
        costumes: [
          {
            name: "move",
            bitmapResolution: 1,
            dataFormat: "svg",
            assetId: `${md5}`,
            md5ext: `${md5}.svg`,
            rotationCenterX: 270.5,
            rotationCenterY: 202.5,
          },
        ],
        sounds: [],
        volume: 100,
        layerOrder: layer,
        visible: true,
        x: 0,
        y: 0,
        size: 100,
        direction: 90,
        draggable: false,
        rotationStyle: "all around",
      };
      let data_n = [];
      Anime_data.forEach((data) => {
        if (data.number === index) {
          data_n.push(data.x, data.y);
        }
      });
      data.targets[0].lists[md5Hash()] = [`data${index}`, data_n];
      let md5HashData = [];
      let index_2 = 0;
      while (index_2 < 32) {
        index_2++;
        md5HashData.push(String(md5Hash()));
      }
      let code_data = [
        {
          opcode: "event_whenflagclicked",
          next: md5HashData[2],
          parent: null,
          inputs: {},
          fields: {},
          shadow: false,
          topLevel: true,
          x: 48,
          y: 64,
        },
        {
          opcode: "procedures_call",
          next: null,
          parent: md5HashData[2],
          inputs: {},
          fields: {},
          shadow: false,
          topLevel: false,
          mutation: {
            tagName: "mutation",
            children: [],
            proccode: "clone create",
            argumentids: "[]",
            warp: "true",
          },
        },
        {
          opcode: "looks_hide",
          next: md5HashData[1],
          parent: md5HashData[0],
          inputs: {},
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "procedures_definition",
          next: md5HashData[5],
          parent: null,
          inputs: {
            custom_block: [1, md5HashData[4]],
          },
          fields: {},
          shadow: false,
          topLevel: true,
          x: 48,
          y: 288,
        },
        {
          opcode: "procedures_prototype",
          next: null,
          parent: md5HashData[5],
          inputs: {},
          fields: {},
          shadow: true,
          topLevel: false,
          mutation: {
            tagName: "mutation",
            children: [],
            proccode: "clone create",
            argumentids: "[]",
            argumentnames: "[]",
            argumentdefaults: "[]",
            warp: "true",
          },
        },
        {
          opcode: "data_setvariableto",
          next: md5HashData[6],
          parent: md5HashData[3],
          inputs: {
            VALUE: [1, [10, "0"]],
          },
          fields: {
            VARIABLE: ["index", "K@2#jx|!Thcp]Pyu:bUe"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "control_repeat",
          next: null,
          parent: md5HashData[5],
          inputs: {
            TIMES: [3, md5HashData[7], [6, ""]],
            SUBSTACK: [2, md5HashData[9]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "operator_divide",
          next: null,
          parent: md5HashData[6],
          inputs: {
            NUM1: [3, md5HashData[8], [4, ""]],
            NUM2: [1, [4, "2"]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_lengthoflist",
          next: null,
          parent: md5HashData[7],
          inputs: {},
          fields: {
            LIST: [`data${index}`, "k5Y7q^xZrQ*AP:^ZD6q?"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_changevariableby",
          next: md5HashData[10],
          parent: md5HashData[6],
          inputs: {
            VALUE: [1, [4, "2"]],
          },
          fields: {
            VARIABLE: ["index", "K@2#jx|!Thcp]Pyu:bUe"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_setvariableto",
          next: md5HashData[13],
          parent: md5HashData[9],
          inputs: {
            VALUE: [3, md5HashData[11], [10, ""]],
          },
          fields: {
            VARIABLE: ["clone x", "|[+;@:v9=yuz)uz2p2HY"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_itemoflist",
          next: null,
          parent: md5HashData[10],
          inputs: {
            INDEX: [3, md5HashData[12], [7, ""]],
          },
          fields: {
            LIST: [`data${index}`, "k5Y7q^xZrQ*AP:^ZD6q?"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "operator_subtract",
          next: null,
          parent: md5HashData[11],
          inputs: {
            NUM1: [3, [12, "index", "K@2#jx|!Thcp]Pyu:bUe"], [4, ""]],
            NUM2: [1, [4, "1"]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_setvariableto",
          next: md5HashData[15],
          parent: md5HashData[10],
          inputs: {
            VALUE: [3, md5HashData[14], [10, ""]],
          },
          fields: {
            VARIABLE: ["clone y", "/iKA37hK4TQl|U?spqr5"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_itemoflist",
          next: null,
          parent: md5HashData[13],
          inputs: {
            INDEX: [3, [12, "index", "K@2#jx|!Thcp]Pyu:bUe"], [7, ""]],
          },
          fields: {
            LIST: [`data${index}`, , "k5Y7q^xZrQ*AP:^ZD6q?"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "control_create_clone_of",
          next: null,
          parent: md5HashData[13],
          inputs: {
            CLONE_OPTION: [1, md5HashData[16]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "control_create_clone_of_menu",
          next: null,
          parent: md5HashData[15],
          inputs: {},
          fields: {
            CLONE_OPTION: ["_myself_", null],
          },
          shadow: true,
          topLevel: false,
        },
        {
          opcode: "control_start_as_clone",
          next: md5HashData[18],
          parent: null,
          inputs: {},
          fields: {},
          shadow: false,
          topLevel: true,
          x: 48,
          y: 784,
        },
        {
          opcode: "looks_show",
          next: md5HashData[19],
          parent: md5HashData[17],
          inputs: {},
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_setvariableto",
          next: md5HashData[20],
          parent: md5HashData[18],
          inputs: {
            VALUE: [1, [10, "2"]],
          },
          fields: {
            VARIABLE: ["clone costume", "pKC{H1pn6IH`QFJp%)D3"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "control_forever",
          next: null,
          parent: md5HashData[19],
          inputs: {
            SUBSTACK: [2, md5HashData[21]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_changevariableby",
          next: md5HashData[29],
          parent: md5HashData[20],
          inputs: {
            VALUE: [1, [4, "1"]],
          },
          fields: {
            VARIABLE: ["clone costume", "pKC{H1pn6IH`QFJp%)D3"],
          },
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "motion_gotoxy",
          next: md5HashData[25],
          parent: md5HashData[27],
          inputs: {
            X: [3, md5HashData[23], [4, ""]],
            Y: [3, md5HashData[24], [4, ""]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "operator_subtract",
          next: null,
          parent: md5HashData[22],
          inputs: {
            NUM1: [3, [12, "clone x", "|[+;@:v9=yuz)uz2p2HY"], [4, ""]],
            NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "operator_subtract",
          next: null,
          parent: md5HashData[22],
          inputs: {
            NUM1: [3, [12, "clone y", "/iKA37hK4TQl|U?spqr5"], [4, ""]],
            NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "looks_switchcostumeto",
          next: null,
          parent: md5HashData[22],
          inputs: {
            COSTUME: [
              3,
              [12, "clone costume", "pKC{H1pn6IH`QFJp%)D3"],
              md5HashData[26],
            ],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "looks_costume",
          next: null,
          parent: md5HashData[25],
          inputs: {},
          fields: {
            COSTUME: ["move", null],
          },
          shadow: true,
          topLevel: false,
        },
        {
          opcode: "looks_switchcostumeto",
          next: md5HashData[22],
          parent: md5HashData[29],
          inputs: {
            COSTUME: [1, md5HashData[28]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "looks_costume",
          next: null,
          parent: md5HashData[27],
          inputs: {},
          fields: {
            COSTUME: ["move", null],
          },
          shadow: true,
          topLevel: false,
        },
        {
          opcode: "control_if",
          next: md5HashData[27],
          parent: md5HashData[21],
          inputs: {
            SUBSTACK: [2, md5HashData[31]],
            CONDITION: [2, md5HashData[30]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "operator_gt",
          next: null,
          parent: md5HashData[29],
          inputs: {
            OPERAND1: [
              3,
              [12, "clone costume", "pKC{H1pn6IH`QFJp%)D3"],
              [10, ""],
            ],
            OPERAND2: [1, [10, String(time_e.length + 1)]],
          },
          fields: {},
          shadow: false,
          topLevel: false,
        },
        {
          opcode: "data_setvariableto",
          next: null,
          parent: md5HashData[29],
          inputs: {
            VALUE: [1, [10, "2"]],
          },
          fields: {
            VARIABLE: ["clone costume", "pKC{H1pn6IH`QFJp%)D3"],
          },
          shadow: false,
          topLevel: false,
        },
      ];
      code_data.forEach((code, c_index) => {
        splite_d.blocks[md5HashData[c_index]] = code;
      });
      time_e.forEach((svg_e, index_2) => {
        let md5_2 = md5Hash();
        zip.file(`${md5_2}.svg`, svg_e);
        splite_d.costumes.push({
          name: `${index}_${index_2}`,
          bitmapResolution: 1,
          dataFormat: "svg",
          assetId: md5_2,
          md5ext: `${md5_2}.svg`,
          rotationCenterX: 240,
          rotationCenterY: 180,
        });
      });
      data.targets.push(splite_d);
      layer++;
    });
    const jsonData = JSON.stringify(data, null, 2);
    zip.file("project.json", jsonData);
    svg_data.forEach((data) => {
      zip.file(data[0], data[1]);
    });

    zip
      .generateAsync({
        type: "blob",
      })
      .then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = "project.sb3";
        a.click();
        URL.revokeObjectURL(url);
      });
  });
  gameLoop();
});
