export type FlavorId = "rich" | "sweet" | "allergy" | "fruit" | "anything";

export interface Flavor {
  id: FlavorId;
  // 카드에 그려진 문구. 카드는 그림이라, 여기 값은 화면을 읽어 주는 도구가 쓴다.
  label: string;
  // 이 카드가 강조됐을 때 겹쳐 보여 주는 그림.
  activeImage: string;
  // 이 카드를 골랐을 때 목록이 놓이는 세로 위치.
  listY: number;
  // 이 카드를 골랐을 때 스크롤 막대가 놓이는 세로 위치.
  thumbY: number;
}

const flavor = (
  id: FlavorId,
  label: string,
  listY: number,
  thumbY: number,
): Flavor => ({
  id,
  label,
  activeImage: `/assets/flavor/card-${id}-on.webp`,
  listY,
  thumbY,
});

// 목록에 위에서부터 놓이는 순서다.
export const FLAVORS: Flavor[] = [
  flavor("rich", "초코나 치즈같이 느끼하고 무거운 건 별로야", 37, 37),
  flavor("sweet", "너무 단 건 극혐! 덜 달아야 해", -217, 144),
  flavor("allergy", "견과류나 특정 알레르기 성분은 빼줘", -422, 254),
  flavor("fruit", "크림 듬뿍 보다는 무조건 제철 과일 듬뿍이 좋아", -671, 505),
  flavor("anything", "특이사항 없음! 가리는 거 없이 다 잘 먹어", -843, 688),
];

export const FLAVOR_WINDOW = "/assets/flavor/window.webp";
export const FLAVOR_LIST = "/assets/flavor/list.webp";

// 앞 화면에서 미리 받아 둘 이미지.
export const FLAVOR_IMAGES = [
  FLAVOR_WINDOW,
  FLAVOR_LIST,
  ...FLAVORS.map((item) => item.activeImage),
];

// 카드 한 장의 높이와, 카드가 놓이는 간격.
export const FLAVOR_CARD_HEIGHT = 330;
export const FLAVOR_CARD_PITCH = 374;

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
