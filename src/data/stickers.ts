interface Placement {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotate: number;
}

export type Sticker =
  | ({ kind: "image"; src: string } & Placement)
  | ({ kind: "star"; color: "yellow" | "cocoa" } & Placement);

const CAKE = {
  strawberryShortcake: "/assets/cakes/strawberry-shortcake.png",
  cherryChoco: "/assets/cakes/cherry-choco.png",
  heartChoco: "/assets/cakes/heart-choco.png",
  kiwiMango: "/assets/cakes/kiwi-mango.png",
  angelRoll: "/assets/cakes/angel-roll.png",
  chocoBerry: "/assets/cakes/choco-berry.png",
};

const image = (
  src: string,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  rotate: number,
): Sticker => ({ kind: "image", src, centerX, centerY, width, height, rotate });

const star = (
  color: "yellow" | "cocoa",
  centerX: number,
  centerY: number,
  size: number,
  rotate: number,
): Sticker => ({
  kind: "star",
  color,
  centerX,
  centerY,
  width: size,
  height: size,
  rotate,
});

// 타이틀 화면. 겹침 순서대로 나열한다.
export const TITLE_STICKERS = {
  strawberryShortcake: [
    image(CAKE.strawberryShortcake, 249.86, 571.85, 345.8, 335.83, -13.75),
    star("yellow", 336, 548.65, 39.11, -14.62),
    star("cocoa", 425.18, 467.59, 74.27, 13.36),
    star("yellow", 294.19, 560.07, 39.11, -14.62),
  ],
  cherryChoco: [image(CAKE.cherryChoco, 531.76, 651.11, 369.79, 314.87, -0.57)],
  heartChoco: [image(CAKE.heartChoco, 233.93, 1464.54, 312.35, 324.12, -8.68)],
  kiwiMango: [
    image(CAKE.kiwiMango, 836.05, 1433.84, 348.71, 329.47, -8.4),
    star("yellow", 878.26, 1416.15, 26.01, -8.96),
    star("yellow", 906.77, 1411.94, 26.01, -8.96),
    star("yellow", 935.28, 1407.74, 26.01, -8.96),
  ],
  angelRoll: [image(CAKE.angelRoll, 547.7, 1499.88, 328.06, 306.03, 5.6)],
  chocoBerry: [image(CAKE.chocoBerry, 863.25, 566.86, 351.72, 327.94, 12.71)],
};

// 소개 장면 두 개가 같은 배치를 쓴다. 장면이 바뀌어도 케이크는 제자리에 있다.
export const INTRO_STICKERS: Sticker[] = [
  image(CAKE.strawberryShortcake, 186.51, 1468.13, 284.77, 276.57, 12.2),
  star("yellow", 258.65, 1481.99, 32.21, 11.34),
  star("cocoa", 353.91, 1454.12, 61.16, 39.32),
  star("yellow", 223.58, 1475.38, 32.21, 11.34),
  image(CAKE.cherryChoco, 214.47, 1120.63, 347.83, 296.17, -21.03),
  image(CAKE.heartChoco, 610.64, 579.4, 292.48, 303.5, 24.23),
  image(CAKE.kiwiMango, 212.26, 621.56, 328.44, 310.33, -8.4),
  star("yellow", 112.06, 624.89, 29.84, -8.96),
  star("yellow", 144.78, 620.06, 29.84, -8.96),
  image(CAKE.angelRoll, 800.68, 779.04, 262.39, 244.77, -18.07),
  image(CAKE.chocoBerry, 456.59, 849.69, 309.31, 288.4, 12.71),
];
