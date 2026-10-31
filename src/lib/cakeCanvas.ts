import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import { cakeLayers, cakeScale } from "@/lib/cake";

// 케이크를 캔버스 한 장에 그린다. 부품마다 img를 두면 예시 서른 개에 그림이 육백 장을 넘어
// 휴대폰이 그 화면을 그리다 페이지를 닫는다. 메뉴판처럼 여러 개를 늘어놓는 곳에서 쓴다.

// 판의 아래쪽 가운데. 케이크는 이 점을 기준으로 줄어든다.
const BOARD_ANCHOR = { x: CAKE_BOARD.width / 2, y: CAKE_BOARD.height };

// 같은 부품이 여러 케이크에 쓰이므로 받아 둔 그림을 함께 쓴다.
const images = new Map<string, Promise<HTMLImageElement | null>>();

const loadImage = (src: string) => {
  const known = images.get(src);
  if (known) return known;
  const loading = new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
  images.set(src, loading);
  return loading;
};

// 그리기를 마친 뒤 붙잡고 있던 부품 그림을 놓는다.
export function releaseCakeImages() {
  images.clear();
}

export interface CakeCanvasPlacement {
  // 캔버스 안에서 케이크 바탕의 가운데가 놓일 자리.
  centerX: number;
  centerY: number;
  // 바탕을 그릴 너비. 모양마다 바탕 그림의 너비가 달라 이 값으로 맞춘다.
  scale: number;
  // 판에서 바탕의 가운데.
  baseCenterX: number;
  baseCenterY: number;
}

// 케이크를 캔버스에 그린다. 그림을 모두 받은 뒤에 그리므로 조각이 차례로 뜨지 않는다.
// 그리기를 마치면 true, 도중에 취소되었으면 false를 돌려준다.
export async function drawCake(
  canvas: HTMLCanvasElement,
  cake: CakeConfig,
  place: CakeCanvasPlacement,
  // 그리는 사이에 화면이 바뀌면 그만둔다.
  alive: () => boolean,
): Promise<boolean> {
  const context = canvas.getContext("2d");
  if (!context) return false;

  const layers = cakeLayers(cake);
  const loaded = await Promise.all(layers.map((layer) => loadImage(layer.src)));
  if (!alive()) return false;

  const ratio = canvas.width / canvas.clientWidth || 1;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.scale(ratio, ratio);
  // 케이크 판을 칸 안의 제자리에 놓는다.
  context.translate(
    place.centerX - place.baseCenterX * place.scale,
    place.centerY - place.baseCenterY * place.scale,
  );
  context.scale(place.scale, place.scale);
  // 크기에 따라 판의 아래쪽 가운데를 기준으로 줄어든다.
  const shrink = cakeScale(cake.size);
  context.translate(BOARD_ANCHOR.x, BOARD_ANCHOR.y);
  context.scale(shrink, shrink);
  context.translate(-BOARD_ANCHOR.x, -BOARD_ANCHOR.y);

  layers.forEach((layer, index) => {
    const image = loaded[index];
    if (!image) return;
    const centerX = layer.left + layer.width / 2;
    const centerY = layer.top + layer.height / 2;
    context.save();
    context.translate(centerX, centerY);
    if (layer.rotate) context.rotate((layer.rotate * Math.PI) / 180);
    if (layer.flip) context.scale(1, -1);
    context.drawImage(
      image,
      -layer.width / 2,
      -layer.height / 2,
      layer.width,
      layer.height,
    );
    context.restore();
  });

  context.restore();
  return true;
}
