import type { SceneBox } from "./opening";
import {
  GLOW_IMAGES,
  type Glow,
  type KeywordSlot,
  RESULT_KEYWORD_TAGS,
} from "./result";

const { mint: MINT, blush: BLUSH, pink: PINK, gray: GRAY } = GLOW_IMAGES;

export const FINAL_TEXT = "손님의 의견이 반영된 최종 케이크가 완성되었어요!";
export const FINAL_FLAVOR_SUFFIX = " 함께 완성했어요!";
export const FINAL_CHOICES = { home: "처음으로", qr: "QR 다운로드" };

// 최종 완성 화면의 상자와 키워드는 결과 화면보다 조금 아래에 놓인다. 맛 태그는 끝이 조금 더 오른쪽이다.
export const FINAL_BOX_POSITION = { left: 55, top: 507.88 };
export const FINAL_KEYWORD_TAGS: KeywordSlot[] = RESULT_KEYWORD_TAGS.map(
  (slot) =>
    slot.answer === "flavor"
      ? { ...slot, top: slot.top + 7.88, rightEdge: 1037.21 }
      : { ...slot, top: slot.top + 7.88 },
);

export const QR_TEXT =
  "스마트폰 카메라로 큐알코드를 촬영하면\n내가 만든 케이크를 저장할 수 있어요!";
export const QR_HINT = "40초 후 자동으로 사라져요!";
export const QR_TIP =
  "케이크를 저장하고 소중한 상대에게도 전달해보면 어떨까요?";
export const QR_HOME = "처음으로";
// QR 화면은 누르든 말든 이 시간이 지나면 처음 화면으로 돌아간다.
export const QR_TIMEOUT_MS = 40_000;

export const QR_FRAME = { left: 173, top: 604, size: 720 };
export const QR_CODE = { left: 237, top: 667, size: 593 };

export const TIP_BUBBLE_IMAGE = "/assets/ui/bubble/pill.svg";
export const TIP_BUBBLE: SceneBox = {
  left: 224.63,
  top: 1361.35,
  width: 630.705,
  height: 120.672,
};
// 말풍선 꼬리를 뺀 몸통의 가운데에 글자를 둔다.
export const TIP_TEXT_CENTER = { x: 540, y: 1400.2 };

// 화면 왼쪽 밖에서 고개를 내미는 캐릭터. 기울인 채로 화면 끝에 반쯤 걸친다.
export const PEEK_BAKER = {
  src: "/assets/characters/baker-content.png",
  box: { left: -116.41, top: 1334.49, width: 310.33, height: 331.22 },
  rotate: 33.83,
};

// 휴대폰에서 QR 코드로 여는 공유 페이지.
export const SAVE_CHOICE = "케이크 저장하기";
export const SAVE_FILE_NAME = "hwipp-bakery-cake.png";
export const SHARE_BROKEN_TEXT =
  "케이크 정보를 불러오지 못했어요.\n키오스크의 QR 코드를 다시 찍어 주세요.";

export const BYE_MESSAGE = "감사합니다! 다음에 또 오세요 ♥";
export const BYE_CHOICES = { stay: "아직 안 가요", leave: "네 ^^" };

export const FINAL_GLOWS: Glow[] = [
  { src: MINT, left: -546, top: 429, size: 1384 },
  { src: PINK, left: 259, top: 503, size: 1150 },
  { src: GRAY, left: 236, top: 775, size: 1150 },
];

export const QR_GLOWS: Glow[] = [
  { src: MINT, left: -447, top: -165, size: 1384 },
  { src: BLUSH, left: -453, top: 883, size: 1384 },
  { src: PINK, left: 259, top: 503, size: 1150 },
  { src: GRAY, left: 236, top: 775, size: 1150 },
];

export const SHARE_IMAGES = [BLUSH, TIP_BUBBLE_IMAGE, PEEK_BAKER.src];
