export type RelationId = "couple" | "family" | "friend" | "colleague" | "idol";

export interface Relation {
  id: RelationId;
  label: string;
  // 카드 뒷면에 적힌 한 줄 설명. 뒷면 이미지에 그려져 있고, 여기 값은 화면을 읽어 주는 도구가 쓴다.
  description: string;
  front: string;
  back: string;
  // 카드를 뒤집었을 때 화면 전체에 깔리는 사진. 미리 흐리게 만들어 둔 것이다.
  background: string;
}

const relation = (
  id: RelationId,
  label: string,
  description: string,
): Relation => ({
  id,
  label,
  description,
  front: `/assets/cards/${id}-front.webp`,
  back: `/assets/cards/${id}-back.webp`,
  background: `/assets/backgrounds/relation-${id}.webp`,
});

// 카드가 좌우로 놓이는 순서다. 마지막 카드 다음은 다시 첫 카드다.
export const RELATIONS: Relation[] = [
  relation("couple", "연인", "사랑하는 연인"),
  relation("family", "가족", "세상에서 가장 소중한 가족"),
  relation("friend", "친구", "함께하면 웃음이 끊이질 않는 친구"),
  relation("colleague", "동료", "열일메이트, 든든한 동료"),
  relation("idol", "최애", "늘 응원하는 빛나는 나의 최애"),
];

export const RELATION_IMAGES = RELATIONS.flatMap((item) => [
  item.front,
  item.back,
  item.background,
]);

export interface CardSlot {
  x: number;
  y: number;
  scale: number;
  zIndex: number;
}

// 가운데 카드를 기준으로 한 자리별 이동량과 배율. 가운데에서 멀수록 작아지고 뒤로 간다.
export const CARD_SLOTS: Record<number, CardSlot> = {
  [-2]: { x: -345, y: 13, scale: 0.6386, zIndex: 1 },
  [-1]: { x: -190, y: 8, scale: 0.748, zIndex: 2 },
  0: { x: 0, y: 0, scale: 1, zIndex: 3 },
  1: { x: 190, y: 8, scale: 0.748, zIndex: 2 },
  2: { x: 345, y: 13, scale: 0.6386, zIndex: 1 },
};

// 가운데 카드에서 몇 칸 떨어져 있는지. 가까운 쪽으로 돌아서 -2부터 2까지 나온다.
export function slotOffset(index: number, active: number): number {
  const count = RELATIONS.length;
  const half = Math.floor(count / 2);
  return ((((index - active + half) % count) + count) % count) - half;
}
