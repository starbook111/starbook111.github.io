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

  let Mouse_Angle = 0;
  let f_Mouse_Angle = false;

  let Checkbox = false;

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

  const orbitData = [{ x: 240, y: 180, t: 0 }];

  let ret = 0;

  const point_data = [];

  const image = new Image();
  image.src = "./icon/background-3.svg";

  let edit = 0;

  let color_b = "rgb(230, 230, 230)";
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

  let caret = document.getElementById("caret-right");
  let Settings_screen = document.getElementById("Settings_screen");
  let tab = document.getElementById("tab");

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
            scrollX += (player_x - scrollX - 375) * 0.1;
            scrollY += (player_y - scrollY - 207.5) * 0.1;
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
          let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="${y}">`;
          worldData.forEach((data, index) => {
            for (let i = 0; i < data.length - 1; i++) {
              if (data[i] === "0") {
                svg += `<rect x="${i * 20}" y="${
                  index * 20
                }" width="20" height="20" fill="${color_b}"/>`;
              }
              if (data[i] === "1") {
                svg += `<rect x="${i * 20}" y="${
                  index * 20
                }" width="20" height="20" fill="azure"/>`;
              }
            }
          });
          svg += "</svg>";
          let blob = new Blob([svg], { type: "image/svg+xml" });
          let url = URL.createObjectURL(blob);
          img = new Image();
          img.src = url;
          img.onload = () => {
            drawimg = img;
          };
          change = false;
        }

        ctx.drawImage(drawimg, 0 - scrollX, 0 - scrollY, x, y);

        if (flag) {
          ctx.fillStyle = "white";
          ctx.fillRect(player_x - scrollX, player_y - scrollY, 20, 20);
        }
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
      div_5.style.display = "none";
      choice.style.left = `${choice_x}px`;
      choice.style.top = `${choice_y}px`;
    } else {
      ctx.clearRect(0, 0, 1280, 720);
      if (start && tick % 2 == 0) {
        time++;
        slider_value.innerHTML = time;
        handle.style.left = `${time + 20}px`;
      }
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
                  ctx.quadraticCurveTo(10, 10, point_X, point_Y);
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
                ctx.quadraticCurveTo(10, 10, point_X, point_Y);
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
    isMouseDown = false;
    isMousepush = false;
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
        event.pageX - rect.left + scrollX - 10 <= x &&
        event.pageY - rect.top + scrollY < y &&
        event.pageX - rect.left + scrollX - 10 >= 0 &&
        event.pageY - rect.top + scrollY >= 0
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
        event.pageX - rect.left + scrollX - 10 <= x &&
        event.pageY - rect.top + scrollY < y &&
        event.pageX - rect.left + scrollX - 10 >= 0 &&
        event.pageY - rect.top + scrollY >= 0
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
    click_e.push(
      icon_e.addEventListener("click", () => {
        const elements = document.querySelectorAll(".select");
        elements.forEach((data) => {
          data.classList.remove("select");
        });
        frame_n = id;
        icon_e.classList.add("select");
      })
    );
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
    polygon_data[frame_n][select[0]].d[select[1]][select[2]].k = "q";
  });

  document.getElementById("Linear-in").addEventListener("click", () => {
    custom_menu.style.display = "none";
  });

  document.getElementById("Bezier").addEventListener("click", () => {
    custom_menu.style.display = "none";
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
      "d194469a39c9e946364b1f5909d0463b.svg",
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
          },
          lists: { "Hv91qM{{A!%6e9!gs^{w": ["data", world_data_1] },
          broadcasts: {},
          blocks: {},
          comments: {
            gs: {
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
            "BT=:.t$2qx+Hy0zw8B4:": ["clone x", 960],
            "M.l*44|7F!B7eZ?a.)C=": ["clone y", -1440],
          },
          lists: {},
          broadcasts: {},
          blocks: {
            eA: {
              opcode: "event_whenflagclicked",
              next: "aE",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 64,
            },
            aE: {
              opcode: "looks_hide",
              next: "aF",
              parent: "eA",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aF: {
              opcode: "procedures_call",
              next: "aG",
              parent: "aE",
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
            aG: {
              opcode: "control_forever",
              next: null,
              parent: "aF",
              inputs: { SUBSTACK: [2, "eB"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eB: {
              opcode: "pen_clear",
              next: null,
              parent: "aG",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eC: {
              opcode: "control_start_as_clone",
              next: "aH",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 416,
            },
            aH: {
              opcode: "looks_show",
              next: "aI",
              parent: "eC",
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aI: {
              opcode: "control_forever",
              next: null,
              parent: "aH",
              inputs: { SUBSTACK: [2, "c"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            c: {
              opcode: "control_if",
              next: "d",
              parent: "aI",
              inputs: { CONDITION: [2, "aJ"], SUBSTACK: [2, "eD"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aJ: {
              opcode: "operator_gt",
              next: null,
              parent: "c",
              inputs: {
                OPERAND1: [3, "eE", [10, ""]],
                OPERAND2: [1, [10, "479"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eE: {
              opcode: "operator_subtract",
              next: null,
              parent: "aJ",
              inputs: {
                NUM1: [3, [12, "clone x", "BT=:.t$2qx+Hy0zw8B4:"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eD: {
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
              inputs: { CONDITION: [2, "aK"], SUBSTACK: [2, "eF"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aK: {
              opcode: "operator_lt",
              next: null,
              parent: "d",
              inputs: {
                OPERAND1: [3, "eG", [10, ""]],
                OPERAND2: [1, [10, "-479"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eG: {
              opcode: "operator_subtract",
              next: null,
              parent: "aK",
              inputs: {
                NUM1: [3, [12, "clone x", "BT=:.t$2qx+Hy0zw8B4:"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eF: {
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
              inputs: { CONDITION: [2, "aL"], SUBSTACK: [2, "eH"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aL: {
              opcode: "operator_gt",
              next: null,
              parent: "e",
              inputs: {
                OPERAND1: [3, "eI", [10, ""]],
                OPERAND2: [1, [10, "359"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eI: {
              opcode: "operator_subtract",
              next: null,
              parent: "aL",
              inputs: {
                NUM1: [3, [12, "clone y", "M.l*44|7F!B7eZ?a.)C="], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eH: {
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
              inputs: { CONDITION: [2, "aM"], SUBSTACK: [2, "eJ"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aM: {
              opcode: "operator_lt",
              next: null,
              parent: "f",
              inputs: {
                OPERAND1: [3, "eK", [10, ""]],
                OPERAND2: [1, [10, "-359"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eK: {
              opcode: "operator_subtract",
              next: null,
              parent: "aM",
              inputs: {
                NUM1: [3, [12, "clone y", "M.l*44|7F!B7eZ?a.)C="], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eJ: {
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
              inputs: { COSTUME: [1, "eL"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eL: {
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
              inputs: { X: [3, "eM", [4, ""]], Y: [3, "eN", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eM: {
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
            eN: {
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
              inputs: { COSTUME: [3, "aN", "eO"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aN: {
              opcode: "operator_join",
              next: null,
              parent: "y",
              inputs: {
                STRING1: [3, "eP", [10, ""]],
                STRING2: [3, [12, "clone y", "M.l*44|7F!B7eZ?a.)C="], [10, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eP: {
              opcode: "operator_join",
              next: null,
              parent: "aN",
              inputs: {
                STRING1: [3, [12, "clone x", "BT=:.t$2qx+Hy0zw8B4:"], [10, ""]],
                STRING2: [1, [10, ","]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eO: {
              opcode: "looks_costume",
              next: null,
              parent: "y",
              inputs: {},
              fields: { COSTUME: ["0,0", null] },
              shadow: true,
              topLevel: false,
            },
            aO: {
              opcode: "procedures_definition",
              next: "aP",
              parent: null,
              inputs: { custom_block: [1, "eQ"] },
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 1408,
            },
            eQ: {
              opcode: "procedures_prototype",
              next: null,
              parent: "aO",
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
            aP: {
              opcode: "data_setvariableto",
              next: "aQ",
              parent: "aO",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["clone x", "BT=:.t$2qx+Hy0zw8B4:"] },
              shadow: false,
              topLevel: false,
            },
            aQ: {
              opcode: "data_setvariableto",
              next: "aR",
              parent: "aP",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["clone y", "M.l*44|7F!B7eZ?a.)C="] },
              shadow: false,
              topLevel: false,
            },
            aR: {
              opcode: "control_repeat",
              next: null,
              parent: "aQ",
              inputs: { TIMES: [1, [6, "2"]], SUBSTACK: [2, "z"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            z: {
              opcode: "control_repeat",
              next: "eR",
              parent: "aR",
              inputs: { TIMES: [1, [6, "2"]], SUBSTACK: [2, "A"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            A: {
              opcode: "control_create_clone_of",
              next: "eS",
              parent: "z",
              inputs: { CLONE_OPTION: [1, "eT"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eT: {
              opcode: "control_create_clone_of_menu",
              next: null,
              parent: "A",
              inputs: {},
              fields: { CLONE_OPTION: ["_myself_", null] },
              shadow: true,
              topLevel: false,
            },
            eS: {
              opcode: "data_changevariableby",
              next: null,
              parent: "A",
              inputs: { VALUE: [1, [4, "-360"]] },
              fields: { VARIABLE: ["clone y", "M.l*44|7F!B7eZ?a.)C="] },
              shadow: false,
              topLevel: false,
            },
            eR: {
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
          currentCostume: 0,
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
              assetId: "d194469a39c9e946364b1f5909d0463b",
              md5ext: "d194469a39c9e946364b1f5909d0463b.svg",
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
            eU: {
              opcode: "event_whenflagclicked",
              next: "aS",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 48,
              y: 64,
            },
            aS: {
              opcode: "data_setvariableto",
              next: "aT",
              parent: "eU",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            aT: {
              opcode: "data_setvariableto",
              next: "aU",
              parent: "aS",
              inputs: { VALUE: [1, [10, "240"]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            aU: {
              opcode: "data_setvariableto",
              next: "aV",
              parent: "aT",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            aV: {
              opcode: "data_setvariableto",
              next: "aW",
              parent: "aU",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            aX: {
              opcode: "control_forever",
              next: null,
              parent: "aW",
              inputs: { SUBSTACK: [2, "aY"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aY: {
              opcode: "data_changevariableby",
              next: "a",
              parent: "aX",
              inputs: { VALUE: [1, [4, "-2"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            h: {
              opcode: "control_if",
              next: "B",
              parent: "aZ",
              inputs: { CONDITION: [2, "C"], SUBSTACK: [2, "D"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a!": {
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
              parent: "a!",
              inputs: {
                STRING: [3, "a#", [10, ""]],
                LETTER: [3, "a%", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a#": {
              opcode: "data_itemoflist",
              next: null,
              parent: "E",
              inputs: { INDEX: [3, "a(", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "a(": {
              opcode: "operator_add",
              next: null,
              parent: "a#",
              inputs: { NUM1: [3, "a)", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a)": {
              opcode: "operator_round",
              next: null,
              parent: "a(",
              inputs: { NUM: [3, "eV", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eV: {
              opcode: "operator_divide",
              next: null,
              parent: "a)",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a%": {
              opcode: "operator_add",
              next: null,
              parent: "E",
              inputs: { NUM1: [3, "a*", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a*": {
              opcode: "operator_round",
              next: null,
              parent: "a%",
              inputs: { NUM: [3, "eW", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eW: {
              opcode: "operator_divide",
              next: null,
              parent: "a*",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eX: {
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
              next: "eX",
              parent: "h",
              inputs: { VALUE: [3, "a+", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            "a+": {
              opcode: "operator_add",
              next: null,
              parent: "D",
              inputs: { NUM1: [3, "a,", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a,": {
              opcode: "operator_multiply",
              next: null,
              parent: "a+",
              inputs: { NUM1: [3, "a-", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a-": {
              opcode: "operator_round",
              next: null,
              parent: "a,",
              inputs: { NUM: [3, "a.", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a.": {
              opcode: "operator_divide",
              next: null,
              parent: "a-",
              inputs: { NUM1: [3, "eY", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eY: {
              opcode: "operator_subtract",
              next: null,
              parent: "a.",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            F: {
              opcode: "data_changevariableby",
              next: "j",
              parent: "i",
              inputs: { VALUE: [3, "eZ", [4, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            C: {
              opcode: "operator_or",
              next: null,
              parent: "h",
              inputs: { OPERAND2: [2, "a/"], OPERAND1: [2, "a!"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a/": {
              opcode: "operator_gt",
              next: null,
              parent: "C",
              inputs: {
                OPERAND1: [3, "G", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            G: {
              opcode: "operator_letter_of",
              next: null,
              parent: "a/",
              inputs: {
                STRING: [3, "a:", [10, ""]],
                LETTER: [3, "a;", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a:": {
              opcode: "data_itemoflist",
              next: null,
              parent: "G",
              inputs: { INDEX: [3, "a=", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "a=": {
              opcode: "operator_add",
              next: null,
              parent: "a:",
              inputs: { NUM1: [3, "a?", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a?": {
              opcode: "operator_round",
              next: null,
              parent: "a=",
              inputs: { NUM: [3, "e!", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e!": {
              opcode: "operator_divide",
              next: null,
              parent: "a?",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a;": {
              opcode: "operator_add",
              next: null,
              parent: "G",
              inputs: { NUM1: [3, "a@", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a@": {
              opcode: "operator_round",
              next: null,
              parent: "a;",
              inputs: { NUM: [3, "e#", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e#": {
              opcode: "operator_divide",
              next: null,
              parent: "a@",
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
              inputs: { CONDITION: [2, "H"], SUBSTACK: [2, "I"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            H: {
              opcode: "operator_or",
              next: null,
              parent: "B",
              inputs: { OPERAND1: [2, "a["], OPERAND2: [2, "a]"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a[": {
              opcode: "operator_gt",
              next: null,
              parent: "H",
              inputs: {
                OPERAND1: [3, "J", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            J: {
              opcode: "operator_letter_of",
              next: null,
              parent: "a[",
              inputs: {
                STRING: [3, "a^", [10, ""]],
                LETTER: [3, "a_", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a^": {
              opcode: "data_itemoflist",
              next: null,
              parent: "J",
              inputs: { INDEX: [3, "a`", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "a`": {
              opcode: "operator_add",
              next: null,
              parent: "a^",
              inputs: { NUM1: [3, "a{", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a{": {
              opcode: "operator_round",
              next: null,
              parent: "a`",
              inputs: { NUM: [3, "e%", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e%": {
              opcode: "operator_divide",
              next: null,
              parent: "a{",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            a_: {
              opcode: "operator_add",
              next: null,
              parent: "J",
              inputs: { NUM1: [3, "a|", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a|": {
              opcode: "operator_round",
              next: null,
              parent: "a_",
              inputs: { NUM: [3, "e(", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e(": {
              opcode: "operator_divide",
              next: null,
              parent: "a|",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a]": {
              opcode: "operator_gt",
              next: null,
              parent: "H",
              inputs: {
                OPERAND1: [3, "K", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            K: {
              opcode: "operator_letter_of",
              next: null,
              parent: "a]",
              inputs: {
                STRING: [3, "a}", [10, ""]],
                LETTER: [3, "a~", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a}": {
              opcode: "data_itemoflist",
              next: null,
              parent: "K",
              inputs: { INDEX: [3, "ba", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ba: {
              opcode: "operator_add",
              next: null,
              parent: "a}",
              inputs: { NUM1: [3, "bb", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bb: {
              opcode: "operator_round",
              next: null,
              parent: "ba",
              inputs: { NUM: [3, "e)", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e)": {
              opcode: "operator_divide",
              next: null,
              parent: "bb",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "a~": {
              opcode: "operator_add",
              next: null,
              parent: "K",
              inputs: { NUM1: [3, "bc", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bc: {
              opcode: "operator_round",
              next: null,
              parent: "a~",
              inputs: { NUM: [3, "e*", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e*": {
              opcode: "operator_divide",
              next: null,
              parent: "bc",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bd: {
              opcode: "data_setvariableto",
              next: "e+",
              parent: "I",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            I: {
              opcode: "data_setvariableto",
              next: "bd",
              parent: "B",
              inputs: { VALUE: [3, "be", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            be: {
              opcode: "operator_add",
              next: null,
              parent: "I",
              inputs: { NUM1: [3, "bf", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bf: {
              opcode: "operator_multiply",
              next: null,
              parent: "be",
              inputs: { NUM1: [3, "bg", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bg: {
              opcode: "operator_round",
              next: null,
              parent: "bf",
              inputs: { NUM: [3, "bh", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bh: {
              opcode: "operator_divide",
              next: null,
              parent: "bg",
              inputs: { NUM1: [3, "e,", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e,": {
              opcode: "operator_subtract",
              next: null,
              parent: "bh",
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
              next: "L",
              parent: "bi",
              inputs: { CONDITION: [2, "M"], SUBSTACK: [2, "N"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            M: {
              opcode: "operator_or",
              next: null,
              parent: "k",
              inputs: { OPERAND1: [2, "bj"], OPERAND2: [2, "bk"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bj: {
              opcode: "operator_gt",
              next: null,
              parent: "M",
              inputs: {
                OPERAND1: [3, "O", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            O: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bj",
              inputs: {
                STRING: [3, "bl", [10, ""]],
                LETTER: [3, "bm", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bl: {
              opcode: "data_itemoflist",
              next: null,
              parent: "O",
              inputs: { INDEX: [3, "bn", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bn: {
              opcode: "operator_add",
              next: null,
              parent: "bl",
              inputs: { NUM1: [3, "bo", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bo: {
              opcode: "operator_round",
              next: null,
              parent: "bn",
              inputs: { NUM: [3, "e-", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e-": {
              opcode: "operator_divide",
              next: null,
              parent: "bo",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bm: {
              opcode: "operator_add",
              next: null,
              parent: "O",
              inputs: { NUM1: [3, "bp", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bp: {
              opcode: "operator_round",
              next: null,
              parent: "bm",
              inputs: { NUM: [3, "e.", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e.": {
              opcode: "operator_divide",
              next: null,
              parent: "bp",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bk: {
              opcode: "operator_gt",
              next: null,
              parent: "M",
              inputs: {
                OPERAND1: [3, "P", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            P: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bk",
              inputs: {
                STRING: [3, "bq", [10, ""]],
                LETTER: [3, "br", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bq: {
              opcode: "data_itemoflist",
              next: null,
              parent: "P",
              inputs: { INDEX: [3, "bs", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bs: {
              opcode: "operator_add",
              next: null,
              parent: "bq",
              inputs: { NUM1: [3, "bt", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bt: {
              opcode: "operator_round",
              next: null,
              parent: "bs",
              inputs: { NUM: [3, "e/", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e/": {
              opcode: "operator_divide",
              next: null,
              parent: "bt",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            br: {
              opcode: "operator_add",
              next: null,
              parent: "P",
              inputs: { NUM1: [3, "bu", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bu: {
              opcode: "operator_round",
              next: null,
              parent: "br",
              inputs: { NUM: [3, "e:", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e:": {
              opcode: "operator_divide",
              next: null,
              parent: "bu",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e;": {
              opcode: "data_setvariableto",
              next: null,
              parent: "N",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            N: {
              opcode: "data_setvariableto",
              next: "e;",
              parent: "k",
              inputs: { VALUE: [3, "bv", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            bv: {
              opcode: "operator_add",
              next: null,
              parent: "N",
              inputs: { NUM1: [3, "bw", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bw: {
              opcode: "operator_multiply",
              next: null,
              parent: "bv",
              inputs: { NUM1: [3, "bx", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bx: {
              opcode: "operator_round",
              next: null,
              parent: "bw",
              inputs: { NUM: [3, "by", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            by: {
              opcode: "operator_divide",
              next: null,
              parent: "bx",
              inputs: { NUM1: [3, "e=", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e=": {
              opcode: "operator_subtract",
              next: null,
              parent: "by",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            L: {
              opcode: "control_if",
              next: null,
              parent: "k",
              inputs: { CONDITION: [2, "Q"], SUBSTACK: [2, "R"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            Q: {
              opcode: "operator_or",
              next: null,
              parent: "L",
              inputs: { OPERAND1: [2, "bz"], OPERAND2: [2, "bA"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bz: {
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
              parent: "bz",
              inputs: {
                STRING: [3, "bB", [10, ""]],
                LETTER: [3, "bC", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bB: {
              opcode: "data_itemoflist",
              next: null,
              parent: "S",
              inputs: { INDEX: [3, "bD", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bD: {
              opcode: "operator_add",
              next: null,
              parent: "bB",
              inputs: { NUM1: [3, "bE", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bE: {
              opcode: "operator_round",
              next: null,
              parent: "bD",
              inputs: { NUM: [3, "e?", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e?": {
              opcode: "operator_divide",
              next: null,
              parent: "bE",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bC: {
              opcode: "operator_add",
              next: null,
              parent: "S",
              inputs: { NUM1: [3, "bF", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bF: {
              opcode: "operator_round",
              next: null,
              parent: "bC",
              inputs: { NUM: [3, "e@", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e@": {
              opcode: "operator_divide",
              next: null,
              parent: "bF",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bA: {
              opcode: "operator_gt",
              next: null,
              parent: "Q",
              inputs: {
                OPERAND1: [3, "T", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            T: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bA",
              inputs: {
                STRING: [3, "bG", [10, ""]],
                LETTER: [3, "bH", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bG: {
              opcode: "data_itemoflist",
              next: null,
              parent: "T",
              inputs: { INDEX: [3, "bI", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bI: {
              opcode: "operator_add",
              next: null,
              parent: "bG",
              inputs: { NUM1: [3, "bJ", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bJ: {
              opcode: "operator_round",
              next: null,
              parent: "bI",
              inputs: { NUM: [3, "e[", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e[": {
              opcode: "operator_divide",
              next: null,
              parent: "bJ",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bH: {
              opcode: "operator_add",
              next: null,
              parent: "T",
              inputs: { NUM1: [3, "bK", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bK: {
              opcode: "operator_round",
              next: null,
              parent: "bH",
              inputs: { NUM: [3, "e]", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e]": {
              opcode: "operator_divide",
              next: null,
              parent: "bK",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e^": {
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
              next: "e^",
              parent: "L",
              inputs: { VALUE: [3, "bL", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            bL: {
              opcode: "operator_add",
              next: null,
              parent: "R",
              inputs: { NUM1: [3, "bM", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bM: {
              opcode: "operator_multiply",
              next: null,
              parent: "bL",
              inputs: { NUM1: [3, "bN", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bN: {
              opcode: "operator_round",
              next: null,
              parent: "bM",
              inputs: { NUM: [3, "bO", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bO: {
              opcode: "operator_divide",
              next: null,
              parent: "bN",
              inputs: { NUM1: [3, "e_", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            e_: {
              opcode: "operator_subtract",
              next: null,
              parent: "bO",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bP: {
              opcode: "procedures_definition",
              next: "l",
              parent: null,
              inputs: { custom_block: [1, "e`"] },
              fields: {},
              shadow: false,
              topLevel: true,
              x: 750,
              y: 64,
            },
            "e`": {
              opcode: "procedures_prototype",
              next: null,
              parent: "bP",
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
            bQ: {
              opcode: "procedures_definition",
              next: "m",
              parent: null,
              inputs: { custom_block: [1, "e{"] },
              fields: {},
              shadow: false,
              topLevel: true,
              x: 750,
              y: 3096,
            },
            "e{": {
              opcode: "procedures_prototype",
              next: null,
              parent: "bQ",
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
              next: "U",
              parent: "l",
              inputs: { TIMES: [3, "bR", [6, ""]], SUBSTACK: [2, "aZ"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e|": {
              opcode: "operator_divide",
              next: null,
              parent: "bR",
              inputs: {
                NUM1: [3, [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bR: {
              opcode: "operator_mathop",
              next: null,
              parent: "n",
              inputs: { NUM: [3, "e|", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            aZ: {
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
              parent: "bP",
              inputs: {
                SUBSTACK: [2, "n"],
                CONDITION: [2, "e}"],
                SUBSTACK2: [2, "o"],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "e}": {
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
              next: "V",
              parent: "l",
              inputs: { TIMES: [3, "bS", [6, ""]], SUBSTACK: [2, "bT"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bS: {
              opcode: "operator_mathop",
              next: null,
              parent: "o",
              inputs: { NUM: [3, "e~", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            "e~": {
              opcode: "operator_divide",
              next: null,
              parent: "bS",
              inputs: {
                NUM1: [3, [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"], [4, ""]],
                NUM2: [1, [4, "-10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bT: {
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
              next: "W",
              parent: "bT",
              inputs: { CONDITION: [2, "X"], SUBSTACK: [2, "Y"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            X: {
              opcode: "operator_or",
              next: null,
              parent: "p",
              inputs: { OPERAND1: [2, "bU"], OPERAND2: [2, "bV"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bU: {
              opcode: "operator_gt",
              next: null,
              parent: "X",
              inputs: {
                OPERAND1: [3, "Z", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            Z: {
              opcode: "operator_letter_of",
              next: null,
              parent: "bU",
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
              parent: "Z",
              inputs: { INDEX: [3, "bY", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            bY: {
              opcode: "operator_add",
              next: null,
              parent: "bW",
              inputs: { NUM1: [3, "bZ", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bZ: {
              opcode: "operator_round",
              next: null,
              parent: "bY",
              inputs: { NUM: [3, "fa", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fa: {
              opcode: "operator_divide",
              next: null,
              parent: "bZ",
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
              parent: "Z",
              inputs: { NUM1: [3, "b!", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b!": {
              opcode: "operator_round",
              next: null,
              parent: "bX",
              inputs: { NUM: [3, "fb", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fb: {
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
            bV: {
              opcode: "operator_gt",
              next: null,
              parent: "X",
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
              parent: "bV",
              inputs: {
                STRING: [3, "b#", [10, ""]],
                LETTER: [3, "b%", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b#": {
              opcode: "data_itemoflist",
              next: null,
              parent: "!",
              inputs: { INDEX: [3, "b(", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "b(": {
              opcode: "operator_add",
              next: null,
              parent: "b#",
              inputs: { NUM1: [3, "b)", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b)": {
              opcode: "operator_round",
              next: null,
              parent: "b(",
              inputs: { NUM: [3, "fc", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fc: {
              opcode: "operator_divide",
              next: null,
              parent: "b)",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b%": {
              opcode: "operator_add",
              next: null,
              parent: "!",
              inputs: { NUM1: [3, "b*", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b*": {
              opcode: "operator_round",
              next: null,
              parent: "b%",
              inputs: { NUM: [3, "fd", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fd: {
              opcode: "operator_divide",
              next: null,
              parent: "b*",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            Y: {
              opcode: "data_setvariableto",
              next: "fe",
              parent: "p",
              inputs: { VALUE: [3, "b+", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            "b+": {
              opcode: "operator_add",
              next: null,
              parent: "Y",
              inputs: { NUM1: [3, "b,", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b,": {
              opcode: "operator_multiply",
              next: null,
              parent: "b+",
              inputs: { NUM1: [3, "b-", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b-": {
              opcode: "operator_round",
              next: null,
              parent: "b,",
              inputs: { NUM: [3, "b.", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b.": {
              opcode: "operator_divide",
              next: null,
              parent: "b-",
              inputs: { NUM1: [3, "ff", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ff: {
              opcode: "operator_subtract",
              next: null,
              parent: "b.",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fe: {
              opcode: "data_setvariableto",
              next: null,
              parent: "Y",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            W: {
              opcode: "control_if",
              next: null,
              parent: "p",
              inputs: { CONDITION: [2, "#"], SUBSTACK: [2, "%"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "#": {
              opcode: "operator_or",
              next: null,
              parent: "W",
              inputs: { OPERAND1: [2, "b/"], OPERAND2: [2, "b:"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b/": {
              opcode: "operator_gt",
              next: null,
              parent: "#",
              inputs: {
                OPERAND1: [3, "(", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "(": {
              opcode: "operator_letter_of",
              next: null,
              parent: "b/",
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
              parent: "(",
              inputs: { INDEX: [3, "b?", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "b?": {
              opcode: "operator_add",
              next: null,
              parent: "b;",
              inputs: { NUM1: [3, "b@", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b@": {
              opcode: "operator_round",
              next: null,
              parent: "b?",
              inputs: { NUM: [3, "fg", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fg: {
              opcode: "operator_divide",
              next: null,
              parent: "b@",
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
              parent: "(",
              inputs: { NUM1: [3, "b[", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b[": {
              opcode: "operator_round",
              next: null,
              parent: "b=",
              inputs: { NUM: [3, "fh", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fh: {
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
            "b:": {
              opcode: "operator_gt",
              next: null,
              parent: "#",
              inputs: {
                OPERAND1: [3, ")", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ")": {
              opcode: "operator_letter_of",
              next: null,
              parent: "b:",
              inputs: {
                STRING: [3, "b]", [10, ""]],
                LETTER: [3, "b^", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b]": {
              opcode: "data_itemoflist",
              next: null,
              parent: ")",
              inputs: { INDEX: [3, "b_", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            b_: {
              opcode: "operator_add",
              next: null,
              parent: "b]",
              inputs: { NUM1: [3, "b`", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b`": {
              opcode: "operator_round",
              next: null,
              parent: "b_",
              inputs: { NUM: [3, "fi", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fi: {
              opcode: "operator_divide",
              next: null,
              parent: "b`",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b^": {
              opcode: "operator_add",
              next: null,
              parent: ")",
              inputs: { NUM1: [3, "b{", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b{": {
              opcode: "operator_round",
              next: null,
              parent: "b^",
              inputs: { NUM: [3, "fj", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fj: {
              opcode: "operator_divide",
              next: null,
              parent: "b{",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "%": {
              opcode: "data_setvariableto",
              next: "fk",
              parent: "W",
              inputs: { VALUE: [3, "b|", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            "b|": {
              opcode: "operator_add",
              next: null,
              parent: "%",
              inputs: { NUM1: [3, "b}", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b}": {
              opcode: "operator_multiply",
              next: null,
              parent: "b|",
              inputs: { NUM1: [3, "b~", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "b~": {
              opcode: "operator_round",
              next: null,
              parent: "b}",
              inputs: { NUM: [3, "ca", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ca: {
              opcode: "operator_divide",
              next: null,
              parent: "b~",
              inputs: { NUM1: [3, "fl", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fl: {
              opcode: "operator_subtract",
              next: null,
              parent: "ca",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fk: {
              opcode: "data_setvariableto",
              next: null,
              parent: "%",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            V: {
              opcode: "data_changevariableby",
              next: "q",
              parent: "o",
              inputs: { VALUE: [3, "fm", [4, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            fm: {
              opcode: "operator_mod",
              next: null,
              parent: "V",
              inputs: {
                NUM1: [3, [12, "speed y", "lm|A+e~e,o@Dvm{Jb(m:"], [4, ""]],
                NUM2: [1, [4, "-10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            U: {
              opcode: "data_changevariableby",
              next: "r",
              parent: "n",
              inputs: { VALUE: [3, "fn", [4, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            fn: {
              opcode: "operator_mod",
              next: null,
              parent: "U",
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
              next: "*",
              parent: "V",
              inputs: { CONDITION: [2, "+"], SUBSTACK: [2, ","] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "+": {
              opcode: "operator_or",
              next: null,
              parent: "q",
              inputs: { OPERAND1: [2, "cb"], OPERAND2: [2, "cc"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cb: {
              opcode: "operator_gt",
              next: null,
              parent: "+",
              inputs: {
                OPERAND1: [3, "-", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "-": {
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
              parent: "-",
              inputs: { INDEX: [3, "cf", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cf: {
              opcode: "operator_add",
              next: null,
              parent: "cd",
              inputs: { NUM1: [3, "cg", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cg: {
              opcode: "operator_round",
              next: null,
              parent: "cf",
              inputs: { NUM: [3, "fo", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fo: {
              opcode: "operator_divide",
              next: null,
              parent: "cg",
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
              parent: "-",
              inputs: { NUM1: [3, "ch", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ch: {
              opcode: "operator_round",
              next: null,
              parent: "ce",
              inputs: { NUM: [3, "fp", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fp: {
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
              parent: "+",
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
              inputs: { INDEX: [3, "ck", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            ck: {
              opcode: "operator_add",
              next: null,
              parent: "ci",
              inputs: { NUM1: [3, "cl", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cl: {
              opcode: "operator_round",
              next: null,
              parent: "ck",
              inputs: { NUM: [3, "fq", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fq: {
              opcode: "operator_divide",
              next: null,
              parent: "cl",
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
              inputs: { NUM: [3, "fr", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fr: {
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
            ",": {
              opcode: "data_setvariableto",
              next: "cn",
              parent: "q",
              inputs: { VALUE: [3, "co", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            co: {
              opcode: "operator_add",
              next: null,
              parent: ",",
              inputs: { NUM1: [3, "cp", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cp: {
              opcode: "operator_multiply",
              next: null,
              parent: "co",
              inputs: { NUM1: [3, "cq", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cq: {
              opcode: "operator_round",
              next: null,
              parent: "cp",
              inputs: { NUM: [3, "cr", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cr: {
              opcode: "operator_divide",
              next: null,
              parent: "cq",
              inputs: { NUM1: [3, "fs", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fs: {
              opcode: "operator_subtract",
              next: null,
              parent: "cr",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cn: {
              opcode: "data_setvariableto",
              next: "ft",
              parent: ",",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            "*": {
              opcode: "control_if",
              next: null,
              parent: "q",
              inputs: { CONDITION: [2, "/"], SUBSTACK: [2, ":"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "/": {
              opcode: "operator_or",
              next: null,
              parent: "*",
              inputs: { OPERAND1: [2, "cs"], OPERAND2: [2, "ct"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cs: {
              opcode: "operator_gt",
              next: null,
              parent: "/",
              inputs: {
                OPERAND1: [3, ";", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ";": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cs",
              inputs: {
                STRING: [3, "cu", [10, ""]],
                LETTER: [3, "cv", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cu: {
              opcode: "data_itemoflist",
              next: null,
              parent: ";",
              inputs: { INDEX: [3, "cw", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cw: {
              opcode: "operator_add",
              next: null,
              parent: "cu",
              inputs: { NUM1: [3, "cx", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cx: {
              opcode: "operator_round",
              next: null,
              parent: "cw",
              inputs: { NUM: [3, "fu", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fu: {
              opcode: "operator_divide",
              next: null,
              parent: "cx",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cv: {
              opcode: "operator_add",
              next: null,
              parent: ";",
              inputs: { NUM1: [3, "cy", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cy: {
              opcode: "operator_round",
              next: null,
              parent: "cv",
              inputs: { NUM: [3, "fv", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fv: {
              opcode: "operator_divide",
              next: null,
              parent: "cy",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ct: {
              opcode: "operator_gt",
              next: null,
              parent: "/",
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
              parent: "ct",
              inputs: {
                STRING: [3, "cz", [10, ""]],
                LETTER: [3, "cA", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cz: {
              opcode: "data_itemoflist",
              next: null,
              parent: "=",
              inputs: { INDEX: [3, "cB", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cB: {
              opcode: "operator_add",
              next: null,
              parent: "cz",
              inputs: { NUM1: [3, "cC", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cC: {
              opcode: "operator_round",
              next: null,
              parent: "cB",
              inputs: { NUM: [3, "fw", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fw: {
              opcode: "operator_divide",
              next: null,
              parent: "cC",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cA: {
              opcode: "operator_add",
              next: null,
              parent: "=",
              inputs: { NUM1: [3, "cD", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cD: {
              opcode: "operator_round",
              next: null,
              parent: "cA",
              inputs: { NUM: [3, "fx", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fx: {
              opcode: "operator_divide",
              next: null,
              parent: "cD",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ":": {
              opcode: "data_setvariableto",
              next: "cE",
              parent: "*",
              inputs: { VALUE: [3, "cF", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            cF: {
              opcode: "operator_add",
              next: null,
              parent: ":",
              inputs: { NUM1: [3, "cG", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cG: {
              opcode: "operator_multiply",
              next: null,
              parent: "cF",
              inputs: { NUM1: [3, "cH", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cH: {
              opcode: "operator_round",
              next: null,
              parent: "cG",
              inputs: { NUM: [3, "cI", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cI: {
              opcode: "operator_divide",
              next: null,
              parent: "cH",
              inputs: { NUM1: [3, "fy", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fy: {
              opcode: "operator_subtract",
              next: null,
              parent: "cI",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cE: {
              opcode: "data_setvariableto",
              next: "fz",
              parent: ":",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            r: {
              opcode: "control_if",
              next: "?",
              parent: "U",
              inputs: { CONDITION: [2, "@"], SUBSTACK: [2, "["] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "@": {
              opcode: "operator_or",
              next: null,
              parent: "r",
              inputs: { OPERAND1: [2, "cJ"], OPERAND2: [2, "cK"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cJ: {
              opcode: "operator_gt",
              next: null,
              parent: "@",
              inputs: {
                OPERAND1: [3, "]", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "]": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cJ",
              inputs: {
                STRING: [3, "cL", [10, ""]],
                LETTER: [3, "cM", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cL: {
              opcode: "data_itemoflist",
              next: null,
              parent: "]",
              inputs: { INDEX: [3, "cN", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cN: {
              opcode: "operator_add",
              next: null,
              parent: "cL",
              inputs: { NUM1: [3, "cO", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cO: {
              opcode: "operator_round",
              next: null,
              parent: "cN",
              inputs: { NUM: [3, "fA", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fA: {
              opcode: "operator_divide",
              next: null,
              parent: "cO",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cM: {
              opcode: "operator_add",
              next: null,
              parent: "]",
              inputs: { NUM1: [3, "cP", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cP: {
              opcode: "operator_round",
              next: null,
              parent: "cM",
              inputs: { NUM: [3, "fB", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fB: {
              opcode: "operator_divide",
              next: null,
              parent: "cP",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cK: {
              opcode: "operator_gt",
              next: null,
              parent: "@",
              inputs: {
                OPERAND1: [3, "^", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "^": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cK",
              inputs: {
                STRING: [3, "cQ", [10, ""]],
                LETTER: [3, "cR", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cQ: {
              opcode: "data_itemoflist",
              next: null,
              parent: "^",
              inputs: { INDEX: [3, "cS", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            cS: {
              opcode: "operator_add",
              next: null,
              parent: "cQ",
              inputs: { NUM1: [3, "cT", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cT: {
              opcode: "operator_round",
              next: null,
              parent: "cS",
              inputs: { NUM: [3, "fC", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fC: {
              opcode: "operator_divide",
              next: null,
              parent: "cT",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cR: {
              opcode: "operator_add",
              next: null,
              parent: "^",
              inputs: { NUM1: [3, "cU", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cU: {
              opcode: "operator_round",
              next: null,
              parent: "cR",
              inputs: { NUM: [3, "fD", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fD: {
              opcode: "operator_divide",
              next: null,
              parent: "cU",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "[": {
              opcode: "data_setvariableto",
              next: "fE",
              parent: "r",
              inputs: { VALUE: [3, "cV", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            cV: {
              opcode: "operator_add",
              next: null,
              parent: "[",
              inputs: { NUM1: [3, "cW", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cW: {
              opcode: "operator_multiply",
              next: null,
              parent: "cV",
              inputs: { NUM1: [3, "cX", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cX: {
              opcode: "operator_round",
              next: null,
              parent: "cW",
              inputs: { NUM: [3, "cY", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cY: {
              opcode: "operator_divide",
              next: null,
              parent: "cX",
              inputs: { NUM1: [3, "fF", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fF: {
              opcode: "operator_subtract",
              next: null,
              parent: "cY",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fE: {
              opcode: "data_setvariableto",
              next: null,
              parent: "[",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            "?": {
              opcode: "control_if",
              next: null,
              parent: "r",
              inputs: { CONDITION: [2, "_"], SUBSTACK: [2, "`"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            _: {
              opcode: "operator_or",
              next: null,
              parent: "?",
              inputs: { OPERAND1: [2, "cZ"], OPERAND2: [2, "c!"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            cZ: {
              opcode: "operator_gt",
              next: null,
              parent: "_",
              inputs: {
                OPERAND1: [3, "{", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "{": {
              opcode: "operator_letter_of",
              next: null,
              parent: "cZ",
              inputs: {
                STRING: [3, "c#", [10, ""]],
                LETTER: [3, "c%", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c#": {
              opcode: "data_itemoflist",
              next: null,
              parent: "{",
              inputs: { INDEX: [3, "c(", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "c(": {
              opcode: "operator_add",
              next: null,
              parent: "c#",
              inputs: { NUM1: [3, "c)", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c)": {
              opcode: "operator_round",
              next: null,
              parent: "c(",
              inputs: { NUM: [3, "fG", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fG: {
              opcode: "operator_divide",
              next: null,
              parent: "c)",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c%": {
              opcode: "operator_add",
              next: null,
              parent: "{",
              inputs: { NUM1: [3, "c*", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c*": {
              opcode: "operator_round",
              next: null,
              parent: "c%",
              inputs: { NUM: [3, "fH", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fH: {
              opcode: "operator_divide",
              next: null,
              parent: "c*",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c!": {
              opcode: "operator_gt",
              next: null,
              parent: "_",
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
              parent: "c!",
              inputs: {
                STRING: [3, "c+", [10, ""]],
                LETTER: [3, "c,", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c+": {
              opcode: "data_itemoflist",
              next: null,
              parent: "|",
              inputs: { INDEX: [3, "c-", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "c-": {
              opcode: "operator_add",
              next: null,
              parent: "c+",
              inputs: { NUM1: [3, "c.", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c.": {
              opcode: "operator_round",
              next: null,
              parent: "c-",
              inputs: { NUM: [3, "fI", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fI: {
              opcode: "operator_divide",
              next: null,
              parent: "c.",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c,": {
              opcode: "operator_add",
              next: null,
              parent: "|",
              inputs: { NUM1: [3, "c/", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c/": {
              opcode: "operator_round",
              next: null,
              parent: "c,",
              inputs: { NUM: [3, "fJ", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fJ: {
              opcode: "operator_divide",
              next: null,
              parent: "c/",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "`": {
              opcode: "data_setvariableto",
              next: "c:",
              parent: "?",
              inputs: { VALUE: [3, "c;", [10, ""]] },
              fields: { VARIABLE: ["player y", "EcO;L;k5IAWZlA-s`0CR"] },
              shadow: false,
              topLevel: false,
            },
            "c;": {
              opcode: "operator_add",
              next: null,
              parent: "`",
              inputs: { NUM1: [3, "c=", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c=": {
              opcode: "operator_multiply",
              next: null,
              parent: "c;",
              inputs: { NUM1: [3, "c?", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c?": {
              opcode: "operator_round",
              next: null,
              parent: "c=",
              inputs: { NUM: [3, "c@", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c@": {
              opcode: "operator_divide",
              next: null,
              parent: "c?",
              inputs: { NUM1: [3, "fK", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fK: {
              opcode: "operator_subtract",
              next: null,
              parent: "c@",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c:": {
              opcode: "data_setvariableto",
              next: "fL",
              parent: "`",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            i: {
              opcode: "control_repeat",
              next: "F",
              parent: "m",
              inputs: { TIMES: [3, "c[", [6, ""]], SUBSTACK: [2, "bi"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fM: {
              opcode: "operator_divide",
              next: null,
              parent: "c[",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            bi: {
              opcode: "data_changevariableby",
              next: "k",
              parent: "i",
              inputs: { VALUE: [1, [4, "10"]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "c[": {
              opcode: "operator_mathop",
              next: null,
              parent: "i",
              inputs: { NUM: [3, "fM", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            eZ: {
              opcode: "operator_mod",
              next: null,
              parent: "F",
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
              next: "}",
              parent: "F",
              inputs: { CONDITION: [2, "~"], SUBSTACK: [2, "aa"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "~": {
              opcode: "operator_or",
              next: null,
              parent: "j",
              inputs: { OPERAND1: [2, "c]"], OPERAND2: [2, "c^"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c]": {
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
              parent: "c]",
              inputs: {
                STRING: [3, "c_", [10, ""]],
                LETTER: [3, "c`", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            c_: {
              opcode: "data_itemoflist",
              next: null,
              parent: "ab",
              inputs: { INDEX: [3, "c{", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "c{": {
              opcode: "operator_add",
              next: null,
              parent: "c_",
              inputs: { NUM1: [3, "c|", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c|": {
              opcode: "operator_round",
              next: null,
              parent: "c{",
              inputs: { NUM: [3, "fN", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fN: {
              opcode: "operator_divide",
              next: null,
              parent: "c|",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c`": {
              opcode: "operator_add",
              next: null,
              parent: "ab",
              inputs: { NUM1: [3, "c}", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c}": {
              opcode: "operator_round",
              next: null,
              parent: "c`",
              inputs: { NUM: [3, "fO", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fO: {
              opcode: "operator_divide",
              next: null,
              parent: "c}",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c^": {
              opcode: "operator_gt",
              next: null,
              parent: "~",
              inputs: {
                OPERAND1: [3, "ac", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ac: {
              opcode: "operator_letter_of",
              next: null,
              parent: "c^",
              inputs: {
                STRING: [3, "c~", [10, ""]],
                LETTER: [3, "da", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "c~": {
              opcode: "data_itemoflist",
              next: null,
              parent: "ac",
              inputs: { INDEX: [3, "db", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            db: {
              opcode: "operator_add",
              next: null,
              parent: "c~",
              inputs: { NUM1: [3, "dc", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dc: {
              opcode: "operator_round",
              next: null,
              parent: "db",
              inputs: { NUM: [3, "fP", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fP: {
              opcode: "operator_divide",
              next: null,
              parent: "dc",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            da: {
              opcode: "operator_add",
              next: null,
              parent: "ac",
              inputs: { NUM1: [3, "dd", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dd: {
              opcode: "operator_round",
              next: null,
              parent: "da",
              inputs: { NUM: [3, "fQ", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fQ: {
              opcode: "operator_divide",
              next: null,
              parent: "dd",
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
              next: "fR",
              parent: "j",
              inputs: { VALUE: [3, "de", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            de: {
              opcode: "operator_add",
              next: null,
              parent: "aa",
              inputs: { NUM1: [3, "df", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            df: {
              opcode: "operator_multiply",
              next: null,
              parent: "de",
              inputs: { NUM1: [3, "dg", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dg: {
              opcode: "operator_round",
              next: null,
              parent: "df",
              inputs: { NUM: [3, "dh", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dh: {
              opcode: "operator_divide",
              next: null,
              parent: "dg",
              inputs: { NUM1: [3, "fS", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fS: {
              opcode: "operator_subtract",
              next: null,
              parent: "dh",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fR: {
              opcode: "data_setvariableto",
              next: null,
              parent: "aa",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            "}": {
              opcode: "control_if",
              next: null,
              parent: "j",
              inputs: { CONDITION: [2, "ad"], SUBSTACK: [2, "ae"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ad: {
              opcode: "operator_or",
              next: null,
              parent: "}",
              inputs: { OPERAND1: [2, "di"], OPERAND2: [2, "dj"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            di: {
              opcode: "operator_gt",
              next: null,
              parent: "ad",
              inputs: {
                OPERAND1: [3, "af", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            af: {
              opcode: "operator_letter_of",
              next: null,
              parent: "di",
              inputs: {
                STRING: [3, "dk", [10, ""]],
                LETTER: [3, "dl", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dk: {
              opcode: "data_itemoflist",
              next: null,
              parent: "af",
              inputs: { INDEX: [3, "dm", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dm: {
              opcode: "operator_add",
              next: null,
              parent: "dk",
              inputs: { NUM1: [3, "dn", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dn: {
              opcode: "operator_round",
              next: null,
              parent: "dm",
              inputs: { NUM: [3, "fT", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fT: {
              opcode: "operator_divide",
              next: null,
              parent: "dn",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dl: {
              opcode: "operator_add",
              next: null,
              parent: "af",
              inputs: { NUM1: [3, "do", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            do: {
              opcode: "operator_round",
              next: null,
              parent: "dl",
              inputs: { NUM: [3, "fU", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fU: {
              opcode: "operator_divide",
              next: null,
              parent: "do",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dj: {
              opcode: "operator_gt",
              next: null,
              parent: "ad",
              inputs: {
                OPERAND1: [3, "ag", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ag: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dj",
              inputs: {
                STRING: [3, "dp", [10, ""]],
                LETTER: [3, "dq", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dp: {
              opcode: "data_itemoflist",
              next: null,
              parent: "ag",
              inputs: { INDEX: [3, "dr", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dr: {
              opcode: "operator_add",
              next: null,
              parent: "dp",
              inputs: { NUM1: [3, "ds", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ds: {
              opcode: "operator_round",
              next: null,
              parent: "dr",
              inputs: { NUM: [3, "fV", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fV: {
              opcode: "operator_divide",
              next: null,
              parent: "ds",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dq: {
              opcode: "operator_add",
              next: null,
              parent: "ag",
              inputs: { NUM1: [3, "dt", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dt: {
              opcode: "operator_round",
              next: null,
              parent: "dq",
              inputs: { NUM: [3, "fW", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fW: {
              opcode: "operator_divide",
              next: null,
              parent: "dt",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ae: {
              opcode: "data_setvariableto",
              next: "fX",
              parent: "}",
              inputs: { VALUE: [3, "du", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            du: {
              opcode: "operator_add",
              next: null,
              parent: "ae",
              inputs: { NUM1: [3, "dv", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dv: {
              opcode: "operator_multiply",
              next: null,
              parent: "du",
              inputs: { NUM1: [3, "dw", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dw: {
              opcode: "operator_round",
              next: null,
              parent: "dv",
              inputs: { NUM: [3, "dx", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dx: {
              opcode: "operator_divide",
              next: null,
              parent: "dw",
              inputs: { NUM1: [3, "fY", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fY: {
              opcode: "operator_subtract",
              next: null,
              parent: "dx",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fX: {
              opcode: "data_setvariableto",
              next: null,
              parent: "ae",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            m: {
              opcode: "control_if_else",
              next: null,
              parent: "bQ",
              inputs: {
                SUBSTACK: [2, "i"],
                CONDITION: [2, "fZ"],
                SUBSTACK2: [2, "s"],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            fZ: {
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
              next: "ah",
              parent: "m",
              inputs: { TIMES: [3, "dy", [6, ""]], SUBSTACK: [2, "dz"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dy: {
              opcode: "operator_mathop",
              next: null,
              parent: "s",
              inputs: { NUM: [3, "f!", [4, ""]] },
              fields: { OPERATOR: ["floor", null] },
              shadow: false,
              topLevel: false,
            },
            "f!": {
              opcode: "operator_divide",
              next: null,
              parent: "dy",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "-10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dz: {
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
              next: "ai",
              parent: "dz",
              inputs: { CONDITION: [2, "aj"], SUBSTACK: [2, "ak"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aj: {
              opcode: "operator_or",
              next: null,
              parent: "t",
              inputs: { OPERAND1: [2, "dA"], OPERAND2: [2, "dB"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dA: {
              opcode: "operator_gt",
              next: null,
              parent: "aj",
              inputs: {
                OPERAND1: [3, "al", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            al: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dA",
              inputs: {
                STRING: [3, "dC", [10, ""]],
                LETTER: [3, "dD", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dC: {
              opcode: "data_itemoflist",
              next: null,
              parent: "al",
              inputs: { INDEX: [3, "dE", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dE: {
              opcode: "operator_add",
              next: null,
              parent: "dC",
              inputs: { NUM1: [3, "dF", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dF: {
              opcode: "operator_round",
              next: null,
              parent: "dE",
              inputs: { NUM: [3, "f#", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f#": {
              opcode: "operator_divide",
              next: null,
              parent: "dF",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dD: {
              opcode: "operator_add",
              next: null,
              parent: "al",
              inputs: { NUM1: [3, "dG", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dG: {
              opcode: "operator_round",
              next: null,
              parent: "dD",
              inputs: { NUM: [3, "f%", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f%": {
              opcode: "operator_divide",
              next: null,
              parent: "dG",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dB: {
              opcode: "operator_gt",
              next: null,
              parent: "aj",
              inputs: {
                OPERAND1: [3, "am", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            am: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dB",
              inputs: {
                STRING: [3, "dH", [10, ""]],
                LETTER: [3, "dI", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dH: {
              opcode: "data_itemoflist",
              next: null,
              parent: "am",
              inputs: { INDEX: [3, "dJ", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dJ: {
              opcode: "operator_add",
              next: null,
              parent: "dH",
              inputs: { NUM1: [3, "dK", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dK: {
              opcode: "operator_round",
              next: null,
              parent: "dJ",
              inputs: { NUM: [3, "f(", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f(": {
              opcode: "operator_divide",
              next: null,
              parent: "dK",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dI: {
              opcode: "operator_add",
              next: null,
              parent: "am",
              inputs: { NUM1: [3, "dL", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dL: {
              opcode: "operator_round",
              next: null,
              parent: "dI",
              inputs: { NUM: [3, "f)", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f)": {
              opcode: "operator_divide",
              next: null,
              parent: "dL",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ak: {
              opcode: "data_setvariableto",
              next: "f*",
              parent: "t",
              inputs: { VALUE: [3, "dM", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            dM: {
              opcode: "operator_add",
              next: null,
              parent: "ak",
              inputs: { NUM1: [3, "dN", [4, ""]], NUM2: [1, [4, "9.9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dN: {
              opcode: "operator_multiply",
              next: null,
              parent: "dM",
              inputs: { NUM1: [3, "dO", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dO: {
              opcode: "operator_round",
              next: null,
              parent: "dN",
              inputs: { NUM: [3, "dP", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dP: {
              opcode: "operator_divide",
              next: null,
              parent: "dO",
              inputs: { NUM1: [3, "f+", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f+": {
              opcode: "operator_subtract",
              next: null,
              parent: "dP",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f*": {
              opcode: "data_setvariableto",
              next: null,
              parent: "ak",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            ai: {
              opcode: "control_if",
              next: null,
              parent: "t",
              inputs: { CONDITION: [2, "an"], SUBSTACK: [2, "ao"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            an: {
              opcode: "operator_or",
              next: null,
              parent: "ai",
              inputs: { OPERAND1: [2, "dQ"], OPERAND2: [2, "dR"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dQ: {
              opcode: "operator_gt",
              next: null,
              parent: "an",
              inputs: {
                OPERAND1: [3, "ap", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ap: {
              opcode: "operator_letter_of",
              next: null,
              parent: "dQ",
              inputs: {
                STRING: [3, "dS", [10, ""]],
                LETTER: [3, "dT", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dS: {
              opcode: "data_itemoflist",
              next: null,
              parent: "ap",
              inputs: { INDEX: [3, "dU", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dU: {
              opcode: "operator_add",
              next: null,
              parent: "dS",
              inputs: { NUM1: [3, "dV", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dV: {
              opcode: "operator_round",
              next: null,
              parent: "dU",
              inputs: { NUM: [3, "f,", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f,": {
              opcode: "operator_divide",
              next: null,
              parent: "dV",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dT: {
              opcode: "operator_add",
              next: null,
              parent: "ap",
              inputs: { NUM1: [3, "dW", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dW: {
              opcode: "operator_round",
              next: null,
              parent: "dT",
              inputs: { NUM: [3, "f-", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f-": {
              opcode: "operator_divide",
              next: null,
              parent: "dW",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dR: {
              opcode: "operator_gt",
              next: null,
              parent: "an",
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
              parent: "dR",
              inputs: {
                STRING: [3, "dX", [10, ""]],
                LETTER: [3, "dY", [6, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dX: {
              opcode: "data_itemoflist",
              next: null,
              parent: "aq",
              inputs: { INDEX: [3, "dZ", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            dZ: {
              opcode: "operator_add",
              next: null,
              parent: "dX",
              inputs: { NUM1: [3, "d!", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d!": {
              opcode: "operator_round",
              next: null,
              parent: "dZ",
              inputs: { NUM: [3, "f.", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f.": {
              opcode: "operator_divide",
              next: null,
              parent: "d!",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            dY: {
              opcode: "operator_add",
              next: null,
              parent: "aq",
              inputs: { NUM1: [3, "d#", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d#": {
              opcode: "operator_round",
              next: null,
              parent: "dY",
              inputs: { NUM: [3, "f/", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f/": {
              opcode: "operator_divide",
              next: null,
              parent: "d#",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "20"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ao: {
              opcode: "data_setvariableto",
              next: "f:",
              parent: "ai",
              inputs: { VALUE: [3, "d%", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "d%": {
              opcode: "operator_add",
              next: null,
              parent: "ao",
              inputs: { NUM1: [3, "d(", [4, ""]], NUM2: [1, [4, "10.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d(": {
              opcode: "operator_multiply",
              next: null,
              parent: "d%",
              inputs: { NUM1: [3, "d)", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d)": {
              opcode: "operator_round",
              next: null,
              parent: "d(",
              inputs: { NUM: [3, "d*", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d*": {
              opcode: "operator_divide",
              next: null,
              parent: "d)",
              inputs: { NUM1: [3, "f;", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f;": {
              opcode: "operator_subtract",
              next: null,
              parent: "d*",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [1, [4, "10"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f:": {
              opcode: "data_setvariableto",
              next: null,
              parent: "ao",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            ah: {
              opcode: "data_changevariableby",
              next: "u",
              parent: "s",
              inputs: { VALUE: [3, "f=", [4, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "f=": {
              opcode: "operator_mod",
              next: null,
              parent: "ah",
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
              next: "ar",
              parent: "ah",
              inputs: { CONDITION: [2, "as"], SUBSTACK: [2, "at"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            as: {
              opcode: "operator_or",
              next: null,
              parent: "u",
              inputs: { OPERAND1: [2, "d+"], OPERAND2: [2, "d,"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d+": {
              opcode: "operator_gt",
              next: null,
              parent: "as",
              inputs: {
                OPERAND1: [3, "au", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            au: {
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
              parent: "au",
              inputs: { INDEX: [3, "d/", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "d/": {
              opcode: "operator_add",
              next: null,
              parent: "d-",
              inputs: { NUM1: [3, "d:", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d:": {
              opcode: "operator_round",
              next: null,
              parent: "d/",
              inputs: { NUM: [3, "f?", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f?": {
              opcode: "operator_divide",
              next: null,
              parent: "d:",
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
              parent: "au",
              inputs: { NUM1: [3, "d;", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d;": {
              opcode: "operator_round",
              next: null,
              parent: "d.",
              inputs: { NUM: [3, "f@", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f@": {
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
              parent: "as",
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
              parent: "av",
              inputs: { INDEX: [3, "d@", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            "d@": {
              opcode: "operator_add",
              next: null,
              parent: "d=",
              inputs: { NUM1: [3, "d[", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d[": {
              opcode: "operator_round",
              next: null,
              parent: "d@",
              inputs: { NUM: [3, "f[", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f[": {
              opcode: "operator_divide",
              next: null,
              parent: "d[",
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
              parent: "av",
              inputs: { NUM1: [3, "d]", [4, ""]], NUM2: [1, [4, "13"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d]": {
              opcode: "operator_round",
              next: null,
              parent: "d?",
              inputs: { NUM: [3, "f]", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f]": {
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
            at: {
              opcode: "data_setvariableto",
              next: "f^",
              parent: "u",
              inputs: { VALUE: [3, "d^", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            "d^": {
              opcode: "operator_add",
              next: null,
              parent: "at",
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
              inputs: { NUM1: [3, "f_", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            f_: {
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
            "f^": {
              opcode: "data_setvariableto",
              next: null,
              parent: "at",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            ar: {
              opcode: "control_if",
              next: null,
              parent: "u",
              inputs: { CONDITION: [2, "aw"], SUBSTACK: [2, "ax"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aw: {
              opcode: "operator_or",
              next: null,
              parent: "ar",
              inputs: { OPERAND1: [2, "d|"], OPERAND2: [2, "d}"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "d|": {
              opcode: "operator_gt",
              next: null,
              parent: "aw",
              inputs: {
                OPERAND1: [3, "ay", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ay: {
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
              parent: "ay",
              inputs: { INDEX: [3, "eb", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            eb: {
              opcode: "operator_add",
              next: null,
              parent: "d~",
              inputs: { NUM1: [3, "ec", [4, ""]], NUM2: [1, [4, "10"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ec: {
              opcode: "operator_round",
              next: null,
              parent: "eb",
              inputs: { NUM: [3, "f`", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f`": {
              opcode: "operator_divide",
              next: null,
              parent: "ec",
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
              parent: "ay",
              inputs: { NUM1: [3, "ed", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ed: {
              opcode: "operator_round",
              next: null,
              parent: "ea",
              inputs: { NUM: [3, "f{", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f{": {
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
              parent: "aw",
              inputs: {
                OPERAND1: [3, "az", [10, ""]],
                OPERAND2: [1, [10, "0"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            az: {
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
              parent: "az",
              inputs: { INDEX: [3, "eg", [7, ""]] },
              fields: { LIST: ["data", "Hv91qM{{A!%6e9!gs^{w"] },
              shadow: false,
              topLevel: false,
            },
            eg: {
              opcode: "operator_add",
              next: null,
              parent: "ee",
              inputs: { NUM1: [3, "eh", [4, ""]], NUM2: [1, [4, "9"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eh: {
              opcode: "operator_round",
              next: null,
              parent: "eg",
              inputs: { NUM: [3, "f|", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f|": {
              opcode: "operator_divide",
              next: null,
              parent: "eh",
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
              parent: "az",
              inputs: { NUM1: [3, "ei", [4, ""]], NUM2: [1, [4, "12"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ei: {
              opcode: "operator_round",
              next: null,
              parent: "ef",
              inputs: { NUM: [3, "f}", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            "f}": {
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
            ax: {
              opcode: "data_setvariableto",
              next: "f~",
              parent: "ar",
              inputs: { VALUE: [3, "ej", [10, ""]] },
              fields: { VARIABLE: ["player x", "S+8p+@wQM(qi-*DG2PC]"] },
              shadow: false,
              topLevel: false,
            },
            ej: {
              opcode: "operator_add",
              next: null,
              parent: "ax",
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
              inputs: { NUM1: [3, "ga", [4, ""]], NUM2: [1, [4, "20"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ga: {
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
            "f~": {
              opcode: "data_setvariableto",
              next: null,
              parent: "ax",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            ft: {
              opcode: "data_setvariableto",
              next: null,
              parent: "cn",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            fz: {
              opcode: "data_setvariableto",
              next: null,
              parent: "cE",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            a: {
              opcode: "control_if_else",
              next: "en",
              parent: "aY",
              inputs: {
                CONDITION: [2, "eo"],
                SUBSTACK: [2, "aA"],
                SUBSTACK2: [2, "gb"],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eo: {
              opcode: "sensing_keypressed",
              next: null,
              parent: "a",
              inputs: { KEY_OPTION: [1, "gc"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gc: {
              opcode: "sensing_keyoptions",
              next: null,
              parent: "eo",
              inputs: {},
              fields: { KEY_OPTION: ["up arrow", null] },
              shadow: true,
              topLevel: false,
            },
            gd: {
              opcode: "operator_lt",
              next: null,
              parent: "aA",
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
            aB: {
              opcode: "data_setvariableto",
              next: "ge",
              parent: "aA",
              inputs: { VALUE: [3, "gf", [10, ""]] },
              fields: { VARIABLE: ["speed y", "lm|A+e~e,o@Dvm{Jb(m:"] },
              shadow: false,
              topLevel: false,
            },
            ge: {
              opcode: "data_changevariableby",
              next: null,
              parent: "aB",
              inputs: { VALUE: [1, [4, "1"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            en: {
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
              parent: "en",
              inputs: { CONDITION: [2, "ep"], SUBSTACK: [2, "gg"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ep: {
              opcode: "sensing_keypressed",
              next: null,
              parent: "v",
              inputs: { KEY_OPTION: [1, "gh"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gh: {
              opcode: "sensing_keyoptions",
              next: null,
              parent: "ep",
              inputs: {},
              fields: { KEY_OPTION: ["right arrow", null] },
              shadow: true,
              topLevel: false,
            },
            gg: {
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
              next: "aC",
              parent: "v",
              inputs: { CONDITION: [2, "eq"], SUBSTACK: [2, "gi"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            eq: {
              opcode: "sensing_keypressed",
              next: null,
              parent: "w",
              inputs: { KEY_OPTION: [1, "gj"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gj: {
              opcode: "sensing_keyoptions",
              next: null,
              parent: "eq",
              inputs: {},
              fields: { KEY_OPTION: ["left arrow", null] },
              shadow: true,
              topLevel: false,
            },
            gi: {
              opcode: "data_changevariableby",
              next: null,
              parent: "w",
              inputs: { VALUE: [1, [4, "-4"]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            aC: {
              opcode: "data_setvariableto",
              next: "er",
              parent: "w",
              inputs: { VALUE: [3, "gk", [10, ""]] },
              fields: { VARIABLE: ["speed x", "*;me:g-HOyhqXS4?0h6l"] },
              shadow: false,
              topLevel: false,
            },
            gk: {
              opcode: "operator_multiply",
              next: null,
              parent: "aC",
              inputs: {
                NUM1: [3, [12, "speed x", "*;me:g-HOyhqXS4?0h6l"], [4, ""]],
                NUM2: [1, [4, "0.8"]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            er: {
              opcode: "procedures_call",
              next: "aD",
              parent: "aC",
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
            aD: {
              opcode: "motion_gotoxy",
              next: null,
              parent: "er",
              inputs: { X: [3, "gl", [4, ""]], Y: [3, "gm", [4, ""]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gl: {
              opcode: "operator_subtract",
              next: null,
              parent: "aD",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gm: {
              opcode: "operator_subtract",
              next: null,
              parent: "aD",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aA: {
              opcode: "control_if",
              next: null,
              parent: "a",
              inputs: { SUBSTACK: [2, "aB"], CONDITION: [2, "gd"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gb: {
              opcode: "data_setvariableto",
              next: null,
              parent: "a",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            gf: {
              opcode: "operator_subtract",
              next: null,
              parent: "aB",
              inputs: {
                NUM1: [1, [4, "16"]],
                NUM2: [3, [12, "jump level", "{WG8L;z]k}]DSIo]@Uk@"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            aW: {
              opcode: "data_setvariableto",
              next: "aX",
              parent: "aV",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            fL: {
              opcode: "data_setvariableto",
              next: null,
              parent: "c:",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
              shadow: false,
              topLevel: false,
            },
            "e+": {
              opcode: "data_setvariableto",
              next: null,
              parent: "bd",
              inputs: { VALUE: [1, [10, "10"]] },
              fields: { VARIABLE: ["jump level", "{WG8L;z]k}]DSIo]@Uk@"] },
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
              assetId: "757061eae980f49194cd8cabc54f8b41",
              md5ext: "757061eae980f49194cd8cabc54f8b41.svg",
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
            gn: {
              opcode: "event_whenflagclicked",
              next: "es",
              parent: null,
              inputs: {},
              fields: {},
              shadow: false,
              topLevel: true,
              x: 129,
              y: 361,
            },
            es: {
              opcode: "data_setvariableto",
              next: "et",
              parent: "gn",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["scroll x", "Dvurghk]!y~Bh$7[2zA5"] },
              shadow: false,
              topLevel: false,
            },
            et: {
              opcode: "data_setvariableto",
              next: "eu",
              parent: "es",
              inputs: { VALUE: [1, [10, "0"]] },
              fields: { VARIABLE: ["scroll y", "2h8YgD*M18jG|aW4!Axy"] },
              shadow: false,
              topLevel: false,
            },
            eu: {
              opcode: "control_forever",
              next: null,
              parent: "et",
              inputs: { SUBSTACK: [2, "b"] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            b: {
              opcode: "control_if_else",
              next: "ev",
              parent: "eu",
              inputs: {
                CONDITION: [2, "go"],
                SUBSTACK: [2, "ew"],
                SUBSTACK2: [2, "ex"],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            go: {
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
            ex: {
              opcode: "data_changevariableby",
              next: null,
              parent: "b",
              inputs: { VALUE: [3, "ey", [4, ""]] },
              fields: { VARIABLE: ["scroll x", "Dvurghk]!y~Bh$7[2zA5"] },
              shadow: false,
              topLevel: false,
            },
            ey: {
              opcode: "operator_multiply",
              next: null,
              parent: "ex",
              inputs: { NUM1: [3, "gp", [4, ""]], NUM2: [1, [4, "0.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gp: {
              opcode: "operator_subtract",
              next: null,
              parent: "ey",
              inputs: {
                NUM1: [3, [12, "player x", "S+8p+@wQM(qi-*DG2PC]"], [4, ""]],
                NUM2: [3, [12, "scroll x", "Dvurghk]!y~Bh$7[2zA5"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ev: {
              opcode: "data_changevariableby",
              next: null,
              parent: "b",
              inputs: { VALUE: [3, "ez", [4, ""]] },
              fields: { VARIABLE: ["scroll y", "2h8YgD*M18jG|aW4!Axy"] },
              shadow: false,
              topLevel: false,
            },
            ez: {
              opcode: "operator_multiply",
              next: null,
              parent: "ev",
              inputs: { NUM1: [3, "gq", [4, ""]], NUM2: [1, [4, "0.1"]] },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            gq: {
              opcode: "operator_subtract",
              next: null,
              parent: "ez",
              inputs: {
                NUM1: [3, [12, "player y", "EcO;L;k5IAWZlA-s`0CR"], [4, ""]],
                NUM2: [3, [12, "scroll y", "2h8YgD*M18jG|aW4!Axy"], [4, ""]],
              },
              fields: {},
              shadow: false,
              topLevel: false,
            },
            ew: {
              opcode: "data_changevariableby",
              next: null,
              parent: "b",
              inputs: { VALUE: [3, "gr", [4, ""]] },
              fields: { VARIABLE: ["scroll x", "Dvurghk]!y~Bh$7[2zA5"] },
              shadow: false,
              topLevel: false,
            },
            gr: {
              opcode: "operator_multiply",
              next: null,
              parent: "ew",
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
          x: 2,
          y: 87,
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

    for (let w = 0; w < Math.floor(x / 480); w++) {
      for (let h = 0; h < Math.floor(y / 360); h++) {
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">`;
        for (let i = w * 24; i < w * 24 + 24; i++) {
          for (let j = h * 18; j < h * 18 + 18; j++) {
            if (worldData[j][i] === "1") {
              svg += `<rect x="${i * 20}" y="${
                j * 20
              }" width="20" height="20" fill="white"/>`;
            }
          }
        }
        svg += `</svg>`;
        let md5Data = md5Hash();
        zip.file(`${md5Data}.svg`, svg);
        data.targets[1].costumes.push({
          name: `${w},${h}`,
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
          let svg_e = "polyline";
          if (polygon.close) {
            svg_e = "polygon";
          }
          let polygon_list = `<${svg_e} fill="${polygon.f_color}" stroke="${polygon.s_color}" points="`;
          polygon.d.forEach((point) => {
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
            polygon_list = `${polygon_list}${point_X}, ${point_Y} `;
          });
          polygon_list = `${polygon_list}"/>`;
          svg_list = `${svg_list}${polygon_list}`;
        });
        svg_list = `${svg_list}</svg>`;
        time_list.push(svg_list);
      }
      splite_list.push(time_list);
    });

    let layer = 4;

    splite_list.forEach((time_e, index) => {
      let splite_d = {
        isStage: false,
        name: `animation - ${index}`,
        variables: {},
        lists: {},
        broadcasts: {},
        blocks: {},
        comments: {},
        currentCostume: 0,
        costumes: [],
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
      time_e.forEach((svg_e, index_2) => {
        let md5 = md5Hash();
        zip.file(`${md5}.svg`, svg_e);
        splite_d.costumes.push({
          name: `${index}_${index_2}`,
          bitmapResolution: 1,
          dataFormat: "svg",
          assetId: md5,
          md5ext: `${md5}.svg`,
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
