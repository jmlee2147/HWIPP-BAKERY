import {
  type BakerFrame,
  COUNTER,
  COUNTER_SPOT,
  type DialogSceneData,
  type SceneBox,
} from "./opening";

const BAKER = {
  cheer: "/assets/characters/baker-cheer.png",
  wave: "/assets/characters/baker-wave.png",
  whisk1: "/assets/characters/baker-whisk-1.png",
  whisk2: "/assets/characters/baker-whisk-2.png",
};

export const CONFIRM: DialogSceneData = {
  background: COUNTER,
  text: "와! 드디어 재료 준비가 모두 끝났어요!\n알려주신 이야기들로 세상에 하나뿐인 케이크를 구워볼까요?",
  stickers: [],
  baker: [
    { src: BAKER.cheer, ...COUNTER_SPOT },
    { src: BAKER.wave, ...COUNTER_SPOT },
  ],
};

export const CONFIRM_CHOICE = "응 ! 당장 구워 줘 !";

export const LOADING_TEXT =
  "레시피를 열심히 분석하고 반죽하는 중이에요\n조금만 기다려주세요... ";

export const KITCHEN_IMAGE = "/assets/backgrounds/kitchen.webp";
export const KITCHEN: SceneBox = {
  left: -3,
  top: 0,
  width: 1100,
  height: 1964,
};

// 두 포즈는 거품기와 그릇이 몸 밖으로 나가는 만큼 넓힌 같은 크기의 판에 발 위치를 맞춰 잘라 두었다.
const WHISK_SPOT: SceneBox = {
  left: 176.4,
  top: 1223.3,
  width: 711.7,
  height: 619.6,
};

export const LOADING_BAKER: BakerFrame[] = [
  { src: BAKER.whisk1, ...WHISK_SPOT },
  { src: BAKER.whisk2, ...WHISK_SPOT },
];

export const CAKE_IMAGE = "/assets/analysis/cake.webp";

const SLICE_COUNT = 6;
const SLICE_ANGLE = 360 / SLICE_COUNT;
// 이웃한 조각 사이에 실금이 보이지 않도록 조각을 조금씩 겹친다.
const SLICE_OVERLAP = 0.5;
// 조각을 자르는 다각형이 원 바깥을 지나도록 반지름(50%)보다 크게 잡는다.
const SLICE_REACH = 60;

// 케이크 그림 한 장에서 조각 하나만 남기는 clip-path. 가운데 각도는 3시 방향이 0도, 시계 방향이 양수다.
function sliceClipPath(centerAngle: number): string {
  const half = SLICE_ANGLE / 2 + SLICE_OVERLAP;
  const points = [-half, -half / 2, 0, half / 2, half].map((offset) => {
    const radian = ((centerAngle + offset) * Math.PI) / 180;
    const x = 50 + SLICE_REACH * Math.cos(radian);
    const y = 50 + SLICE_REACH * Math.sin(radian);
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  });
  return `polygon(50% 50%, ${points.join(", ")})`;
}

// 사라지는 순서대로 놓는다. 오른쪽 위 조각부터 시계 반대 방향으로 돈다.
export const CAKE_SLICES = Array.from({ length: SLICE_COUNT }, (_, index) =>
  sliceClipPath(-SLICE_ANGLE - index * SLICE_ANGLE),
);

export const ANALYSIS_IMAGES = [
  KITCHEN_IMAGE,
  CAKE_IMAGE,
  BAKER.cheer,
  BAKER.wave,
  BAKER.whisk1,
  BAKER.whisk2,
];
