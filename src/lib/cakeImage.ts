import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import {
  BOX_CAKE,
  BOX_CAKE_SIZES,
  BOX_STAMP_FRAME,
  BOX_STAMPS,
  CAKE_BOX,
  CAKE_BOX_IMAGE,
} from "@/data/result";
import { cakeLayers } from "@/lib/cake";

// 휴대폰 화면에서도 선명하도록 상자를 두 배로 그린다.
const PIXEL_RATIO = 2;
const STAMP_FONT = 'bold 19.088px "PF Stardust"';
const STAMP_COLOR = "#5b4a43";
// 상자 그림은 별 무늬 안쪽이 비어 있다. 사진첩에서 그 자리가 검게 보이지 않도록 화면 바탕색을 먼저 깐다.
const BACKGROUND = "#ffeff3";
const DEGREE = Math.PI / 180;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`그림을 불러오지 못했다: ${src}`));
    image.src = src;
  });
}

interface CakeBoxImageInput {
  cake: CakeConfig;
  date: string;
  orderNumber: string;
}

// 화면의 CakeBox와 같은 배치로 상자, 날짜와 순번, 케이크를 한 장의 그림으로 그린다.
export async function drawCakeBoxImage({
  cake,
  date,
  orderNumber,
}: CakeBoxImageInput): Promise<Blob> {
  const layers = cakeLayers(cake);
  const [box, parts] = await Promise.all([
    loadImage(CAKE_BOX_IMAGE),
    Promise.all(layers.map((layer) => loadImage(layer.src))),
    document.fonts.load(STAMP_FONT),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CAKE_BOX.width * PIXEL_RATIO;
  canvas.height = CAKE_BOX.height * PIXEL_RATIO;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("캔버스를 쓸 수 없다");
  context.scale(PIXEL_RATIO, PIXEL_RATIO);
  context.fillStyle = BACKGROUND;
  context.fillRect(0, 0, CAKE_BOX.width, CAKE_BOX.height);
  context.drawImage(box, 0, 0, CAKE_BOX.width, CAKE_BOX.height);

  // 날짜와 순번. 화면을 오른쪽으로 눕힌 좌표계를 세운 뒤, 그 안에서 글자를 돌리고 누르고 비튼다.
  context.fillStyle = STAMP_COLOR;
  context.font = STAMP_FONT;
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const [text, stamp] of [
    [date, BOX_STAMPS.date],
    [orderNumber, BOX_STAMPS.orderNumber],
  ] as const) {
    context.save();
    context.translate(BOX_STAMP_FRAME.left, BOX_STAMP_FRAME.top + 1920);
    context.rotate(-90 * DEGREE);
    context.translate(stamp.centerX, stamp.top + stamp.height / 2);
    context.rotate(75 * DEGREE);
    context.scale(1, 0.97);
    context.transform(1, 0, Math.tan(-15 * DEGREE), 1, 0, 0);
    context.fillText(text, 0, 0);
    context.restore();
  }

  // 케이크. 판의 아래쪽 가운데를 기준으로 상자용 배율만큼 줄인다.
  const scale = BOX_CAKE.scale * BOX_CAKE_SIZES[cake.size];
  const pivotX = CAKE_BOARD.width / 2;
  const pivotY = CAKE_BOARD.height;
  context.save();
  context.translate(BOX_CAKE.centerX, BOX_CAKE.bottom);
  context.scale(scale, scale);
  context.translate(-pivotX, -pivotY);
  layers.forEach((layer, order) => {
    context.save();
    context.translate(
      layer.left + layer.width / 2,
      layer.top + layer.height / 2,
    );
    if (layer.rotate) context.rotate(layer.rotate * DEGREE);
    if (layer.flip) context.scale(1, -1);
    context.drawImage(
      parts[order],
      -layer.width / 2,
      -layer.height / 2,
      layer.width,
      layer.height,
    );
    context.restore();
  });
  context.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("그림을 만들지 못했다")),
      "image/png",
    );
  });
}

// 휴대폰에서는 공유 창을 띄워 사진첩에 저장하거나 보낼 수 있게 하고, 그게 안 되면 파일로 내려받는다.
export async function saveImage(blob: Blob, fileName: string): Promise<void> {
  const file = new File([blob], fileName, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (error) {
      // 관람객이 공유 창을 닫은 경우는 내려받기로 넘어가지 않는다.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
