import { INTRO_STICKERS, type Sticker } from "./stickers";

export interface SceneBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type BakerFrame = { src: string } & SceneBox;

export interface DialogSceneData {
  // 같은 가게 사진을 장면마다 다른 크기와 위치로 쓴다.
  background: SceneBox;
  text: string;
  stickers: Sticker[][];
  // true면 케이크가 하나씩 생겨난다.
  popIn?: boolean;
  // 두 장이면 일정한 간격으로 번갈아 보여 준다.
  baker: BakerFrame[];
}

export const COUNTER: SceneBox = {
  left: -359,
  top: -61,
  width: 1557,
  height: 1981,
};
const FLOOR: SceneBox = { left: -255, top: -518, width: 2122, height: 2701 };

const BAKER = {
  curious: "/assets/characters/baker-curious.png",
  wave: "/assets/characters/baker-wave.png",
  smile: "/assets/characters/baker-smile.png",
};

// 포즈 이미지는 모두 같은 크기로 잘라 두었다. 같은 자리에 놓으면 포즈만 바뀐다.
export const COUNTER_SPOT: SceneBox = {
  left: 264.1,
  top: 987.4,
  width: 570.8,
  height: 609.2,
};

export const GREETING: DialogSceneData = {
  background: COUNTER,
  text: "어서 오세요! “ HWIPP BAKERY ” 입니다 ♥\n예약하신 분이신가요?",
  stickers: [],
  baker: [
    { src: BAKER.curious, ...COUNTER_SPOT },
    { src: BAKER.smile, ...COUNTER_SPOT },
  ],
};

const FLOOR_SPOT: SceneBox = {
  left: 380.4,
  top: 1028.7,
  width: 653.9,
  height: 697.9,
};

export const INTRO_1: DialogSceneData = {
  background: FLOOR,
  text: "아하! 저희는 세상에 단 하나뿐인\n특별한 맞춤 케이크를 구워드리는 곳이에요!",
  stickers: INTRO_STICKERS,
  popIn: true,
  baker: [
    { src: BAKER.wave, ...FLOOR_SPOT },
    { src: BAKER.curious, ...FLOOR_SPOT },
  ],
};

export const INTRO_2: DialogSceneData = {
  background: FLOOR,
  text: "두 사람의 이야기와 추억을 들려주시면,\n제가, 딱 맞는 디자인과 맛을 레시피로 만들어 드려요!",
  stickers: INTRO_STICKERS,
  baker: [
    { src: BAKER.smile, ...FLOOR_SPOT },
    { src: BAKER.curious, ...FLOOR_SPOT },
  ],
};

export const QUESTION: DialogSceneData = {
  background: COUNTER,
  text: "자, 그럼 바로 시작해 볼까요?\n오늘 어떤 분을 위한 케이크를 구워드릴까요?",
  stickers: [],
  baker: [
    { src: BAKER.curious, ...COUNTER_SPOT },
    { src: BAKER.smile, ...COUNTER_SPOT },
  ],
};
