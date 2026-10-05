import type { CakeShapeId } from "./cake";

export interface DropSpot {
  id: string;
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}

// 케이크 윗면과 옆면에 흩어 놓는 검은 물방울의 자리. 모양마다 디자이너가 놓은 배치가 다르다.
// 완성 케이크 예시와 수정 화면의 물방울 묶음이 함께 쓴다.
export const BLACK_DROPS: Record<CakeShapeId, DropSpot[]> = {
  round: [
    { id: "drop-black-oval", x: 129.2, y: 534.8, rotate: 3.7 },
    { id: "drop-black-oval", x: 330.1, y: 603.6, rotate: -33.6 },
    { id: "drop-black-oval", x: 529, y: 528.8, rotate: -65.5 },
    { id: "drop-black-oval", x: 202.3, y: 670.4, rotate: -13.5 },
    { id: "drop-black-oval", x: 486.5, y: 657.3, rotate: -56.6 },
    { id: "drop-black-round", x: 144.7, y: 256.6 },
    { id: "drop-black-round", x: 211.6, y: 425.5 },
    { id: "drop-black-round", x: 429.1, y: 206.6 },
    { id: "drop-black-round", x: 514, y: 353.2 },
  ],
  heart: [
    { id: "drop-black-oval", x: 140.3, y: 552.2, scale: 0.9, rotate: 11.2 },
    { id: "drop-black-oval", x: 242.4, y: 647.5, scale: 0.9, rotate: -4.4 },
    { id: "drop-black-oval", x: 391.4, y: 646.5, scale: 0.9, rotate: -29 },
    { id: "drop-black-oval", x: 525, y: 592.2, scale: 0.85, rotate: -93 },
    { id: "drop-black-round", x: 367.2, y: 391.1, scale: 0.91 },
    { id: "drop-black-round", x: 310, y: 506.5, scale: 0.91 },
    { id: "drop-black-round", x: 187.2, y: 375.1, scale: 0.91 },
    { id: "drop-black-round", x: 460.1, y: 273.8, scale: 0.91 },
    { id: "drop-black-round", x: 507.4, y: 420.2, scale: 0.92 },
  ],
  square: [
    { id: "drop-black-round", x: 322.1, y: 336.1 },
    { id: "drop-black-round", x: 225.8, y: 245 },
    { id: "drop-black-round", x: 504.7, y: 304.3 },
    { id: "drop-black-round", x: 142.5, y: 382.4 },
    { id: "drop-black-round", x: 421.4, y: 450.3 },
    { id: "drop-black-oval", x: 96.9, y: 596.6, scale: 0.98, rotate: -4.4 },
    { id: "drop-black-oval", x: 237.1, y: 569.6, scale: 0.98, rotate: -13.2 },
    { id: "drop-black-oval", x: 383.1, y: 659.3, scale: 0.98, rotate: -13.2 },
    { id: "drop-black-oval", x: 531.2, y: 594.6, scale: 0.92, rotate: -94 },
    { id: "drop-black-oval", x: 595.4, y: 442.7, scale: 0.91, rotate: -94 },
  ],
};

const white = (spots: DropSpot[]): DropSpot[] =>
  spots.map((spot) => ({ ...spot, id: spot.id.replace("black", "white") }));

// 흰 물방울은 받은 배치가 하트뿐이다. 원형과 네모는 검은 물방울의 자리를 쓴다.
export const WHITE_DROPS: Record<CakeShapeId, DropSpot[]> = {
  round: white(BLACK_DROPS.round),
  heart: [
    { id: "drop-white-oval", x: 247.2, y: 643.1, rotate: -6.8 },
    { id: "drop-white-oval", x: 405.2, y: 637.9, rotate: -19.5 },
    { id: "drop-white-oval", x: 530.4, y: 584.6, scale: 0.86, rotate: -94.3 },
    { id: "drop-white-oval", x: 152.9, y: 544.1, rotate: 7.1 },
    { id: "drop-white-round", x: 195.8, y: 377.2 },
    { id: "drop-white-round", x: 368.7, y: 378.6 },
    { id: "drop-white-round", x: 309.2, y: 498.9 },
    { id: "drop-white-round", x: 507.8, y: 438 },
    { id: "drop-white-round", x: 459.1, y: 271.8 },
  ],
  square: white(BLACK_DROPS.square),
};
