import { worldData, ColorVariations } from "./main.js";
import projectJson from "./projectJson.js";

const getRandomMD5 = () => {
  // ランダムな文字列を生成（ランダムな部分と現在時刻を組み合わせる）
  const randomInput = Math.random().toString(36).substring(2) + Date.now();
  // MD5ハッシュを計算して16進数の文字列に変換
  return CryptoJS.MD5(randomInput).toString();
};

const fileExport = () => {
  document.getElementById("file").addEventListener("click", async () => {
    const zip = new JSZip();

    const playerResponse = await fetch(
      "./scratch costume/521f4579817269a02344283d7a201fd5.svg"
    );
    const playerBlob = playerResponse.blob();
    zip.file("521f4579817269a02344283d7a201fd5.svg", playerBlob);

    const backgroundImage = await fetch(
      "./scratch costume/8366d3f8863b6589493be6afe22408e2.svg"
    );
    const backgroundBlob = backgroundImage.blob();
    zip.file("8366d3f8863b6589493be6afe22408e2.svg", backgroundBlob);

    const nothingImage = await fetch(
      "./scratch costume/cd21514d0531fdffb22204e0ec5ed84a.svg"
    );
    const nothingBlob = nothingImage.blob();
    zip.file("cd21514d0531fdffb22204e0ec5ed84a.svg", nothingBlob);

    // 1チャンクのサイズを取得（すべてのチャンクは同サイズである前提）
    const chunkHeight = worldData[0].data.length;
    const chunkWidth = worldData[0].data[0].length;

    // 各チャンクの最小・最大の座標を計算
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    worldData.forEach((chunk) => {
      if (chunk.x < minX) minX = chunk.x;
      if (chunk.y < minY) minY = chunk.y;
      if (chunk.x > maxX) maxX = chunk.x;
      if (chunk.y > maxY) maxY = chunk.y;
    });

    // グリッド全体のサイズを計算（チャンク単位の範囲 × チャンク内のサイズ）
    const worldWidth = (maxX - minX + 1) * chunkWidth;
    const worldHeight = (maxY - minY + 1) * chunkHeight;

    // 空の2次元配列（world）を作成：すべて "0" で埋める
    const world = [];
    for (let row = 0; row < worldHeight; row++) {
      world[row] = new Array(worldWidth).fill("0");
    }

    // 各チャンクのデータをグリッド上に配置（チャンクの座標を補正して配置）
    worldData.forEach((chunk) => {
      const offsetX = (chunk.x - minX) * chunkWidth;
      const offsetY = (chunk.y - minY) * chunkHeight;
      for (let y = 0; y < chunk.data.length; y++) {
        for (let x = 0; x < chunk.data[y].length; x++) {
          world[offsetY + y][offsetX + x] = chunk.data[y][x];
        }
      }
    });

    // 2次元配列 world を各行連結した文字列の配列に変換し、上下反転
    const worldStringArray = world.map((row) => row.join("")).reverse();

    worldData.forEach((chunk) => {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">`;
      chunk.data.forEach((rowData, rowIndex) => {
        rowData.forEach((StringData, stringIndex) => {
          if (StringData != 0) {
            svg += `<rect x="${stringIndex * 20}" y="${
              rowIndex * 20
            }" width="20" height="20" fill="${ColorVariations[StringData]}"/>`;
          }
        });
      });
      svg += "</svg>";
      const md5 = getRandomMD5();
      zip.file(`${md5}.svg`, svg);
      projectJson.targets[2].costumes.push({
        name: `${chunk.x * 480},${chunk.y * -360}`,
        bitmapResolution: 1,
        dataFormat: "svg",
        assetId: `${(md5)}`,
        md5ext: `${md5}.svg`,
        rotationCenterX: 240,
        rotationCenterY: 180,
      },);
    });

    const reversedWorldStringArray = worldStringArray;
    projectJson.targets[0].lists["/]:RR9WxA|~;a{XK,{rv"][1] =
      reversedWorldStringArray;

    zip.file("project.json", JSON.stringify(projectJson, null, 2));

    // ZIPを作成してダウンロード
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "project.sb3");
    });
  });
};

export default fileExport;