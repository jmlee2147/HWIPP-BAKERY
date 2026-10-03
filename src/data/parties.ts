export type PartyId = "birthday" | "event" | "comfort" | "daily" | "wedding";

export interface Party {
  id: PartyId;
  name: string;
  // 카드에 그려진 문구. 카드는 그림 한 장이라, 여기 값은 화면을 읽어 주는 도구가 쓴다.
  description: string;
  image: string;
  // 캘린더 그리드에서 카드가 놓인 칸.
  col: number;
  row: number;
}

const party = (
  id: PartyId,
  name: string,
  description: string,
  col: number,
  row: number,
): Party => ({
  id,
  name,
  description,
  image: `/assets/cards/party-${id}.webp`,
  col,
  row,
});

// 좌우로 넘기는 순서다. 마지막 카드 다음은 다시 첫 카드다.
export const PARTIES: Party[] = [
  party("birthday", "생일/기념일", "it's Happy Birth Day!", 0, 0),
  party("event", "이벤트/촬영", "사진과 비주얼이 중요한 날!", 2, 1),
  party("comfort", "위로/응원", "소박하지만 진심을 가득 담은 따뜻함", 1, 2),
  party("daily", "일상", "특별한 날은 아니지만 오늘을 기념하고 싶어!", -1, 3),
  party("wedding", "웨딩/약혼", "Wedding Engagement", 2, 3),
];

export const PARTY_PAPER = "/assets/backgrounds/paper.webp";

// 앞 화면에서 미리 받아 둘 이미지.
export const PARTY_IMAGES = [PARTY_PAPER, ...PARTIES.map((item) => item.image)];

// 그리드 한 칸의 크기. 카드 한 장이 한 칸을 채운다.
export const CELL_WIDTH = 745.74;
export const CELL_HEIGHT = 893.92;
// 그리드 판 전체가 기울어진 각도. 음수는 시계 반대 방향이다.
export const BOARD_TILT_DEG = -14.18;

export interface BoardView {
  x: number;
  y: number;
  scale: number;
}

// 카드 한 장을 크게 볼 때 그 카드의 왼쪽 위 모서리가 놓이는 화면 위치.
const FOCUS_ANCHOR = { x: 65.23, y: 751.03 };

// 그리드가 보이도록 축소했을 때의 배율.
export const OVERVIEW_SCALE = 0.3137;

// 판 위의 점이 기울어진 뒤 화면에서 얼마나 옮겨지는지 구한다.
function tilt(x: number, y: number) {
  const angle = (BOARD_TILT_DEG * Math.PI) / 180;
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
  };
}

// 고른 칸의 카드가 화면 가운데에 오도록 판을 옮긴 상태.
// 배율이 1이면 카드가 크게 보이고, 작으면 같은 카드를 가운데에 둔 채 주변 그리드까지 보인다.
export function focusView(col: number, row: number, scale = 1): BoardView {
  // 카드 한가운데가 화면의 같은 자리에 머물도록, 배율에 맞춰 판의 위치를 구한다.
  const center = tilt(CELL_WIDTH / 2, CELL_HEIGHT / 2);
  const card = tilt(
    (col * CELL_WIDTH + CELL_WIDTH / 2) * scale,
    (row * CELL_HEIGHT + CELL_HEIGHT / 2) * scale,
  );
  return {
    x: FOCUS_ANCHOR.x + center.x - card.x,
    y: FOCUS_ANCHOR.y + center.y - card.y,
    scale,
  };
}
