export type FlavorId = "rich" | "sweet" | "allergy" | "fruit" | "anything";

export interface Flavor {
  id: FlavorId;
  // 카드에 그려진 문구. 카드는 그림이라, 여기 값은 화면을 읽어 주는 도구가 쓴다.
  label: string;
  image: string;
  // 이 카드가 강조됐을 때 겹쳐 보여 주는 그림.
  activeImage: string;
  // 이 카드를 골랐을 때 목록이 놓이는 세로 위치.
  listY: number;
}

// 카드 한 장의 크기와 카드가 놓이는 간격.
export const FLAVOR_CARD_WIDTH = 944;
export const FLAVOR_CARD_HEIGHT = 435.1;
export const FLAVOR_CARD_PITCH = 493.1;
// 카드 그림은 카드 간격 단위로 잘라 두어 위아래로 이어 붙이면 된다.
// 그림자 여백이 붙어 있어 카드보다 왼쪽 위로 이만큼 크게 놓인다.
export const FLAVOR_TILE = { x: -35.6, y: -27.7, width: 1023.1 };

// 목록이 보이는 칸. 칸의 세로 가운데에 가장 가까운 카드가 걸린다.
export const FLAVOR_VIEW = { top: 488, height: 1272 };
// 칸 안에서 첫 카드가 놓이는 높이.
export const FLAVOR_LIST_TOP = 59;

const IDS: FlavorId[] = ["rich", "sweet", "allergy", "fruit", "anything"];

// 카드를 칸 가운데로 가져오는 목록 위치. 첫 카드는 맨 위에, 마지막 카드는 그림자까지 칸 안에 들어오는 데서 멈춘다.
const listY = (index: number) => {
  const centered =
    FLAVOR_LIST_TOP +
    index * FLAVOR_CARD_PITCH +
    FLAVOR_CARD_HEIGHT / 2 -
    FLAVOR_VIEW.height / 2;
  const end =
    FLAVOR_LIST_TOP +
    (IDS.length - 1) * FLAVOR_CARD_PITCH +
    FLAVOR_CARD_HEIGHT -
    FLAVOR_TILE.y -
    FLAVOR_VIEW.height;
  return 0 - Math.min(Math.max(centered, 0), end);
};

const flavor = (id: FlavorId, label: string): Flavor => ({
  id,
  label,
  image: `/assets/flavor/card-${id}.webp`,
  activeImage: `/assets/flavor/card-${id}-on.webp`,
  listY: listY(IDS.indexOf(id)),
});

// 목록에 위에서부터 놓이는 순서다.
export const FLAVORS: Flavor[] = [
  flavor("rich", "초코나 치즈같이 느끼하고 무거운 건 별로야"),
  flavor("sweet", "너무 단 건 극혐! 덜 달아야 해"),
  flavor("allergy", "견과류나 특정 알레르기 성분은 빼줘"),
  flavor("fruit", "크림 듬뿍 보다는 무조건 제철 과일 듬뿍이 좋아"),
  flavor("anything", "특이사항 없음! 가리는 거 없이 다 잘 먹어"),
];

// 앞 화면에서 미리 받아 둘 이미지.
export const FLAVOR_IMAGES = FLAVORS.flatMap((item) => [
  item.image,
  item.activeImage,
]);

// 목록의 세로 위치에서 가장 가까이 걸리는 카드를 찾는다.
export function nearestFlavor(listY: number): number {
  let nearest = 0;
  for (const [index, item] of FLAVORS.entries()) {
    if (
      Math.abs(item.listY - listY) < Math.abs(FLAVORS[nearest].listY - listY)
    ) {
      nearest = index;
    }
  }
  return nearest;
}
