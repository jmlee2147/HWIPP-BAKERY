import {
  CAKE_BOARD,
  CAKE_COLORS,
  CAKE_DECORATIONS,
  CAKE_LAYERS,
  CAKE_SHAPES,
  CAKE_SIZES,
  CAKE_SPOTS,
  type CakeBox,
  type CakeConfig,
  type CakeDecoration,
  type CakeLayerId,
  cakeBaseImage,
  DEFAULT_CAKE,
} from "@/data/cake";

export interface CakeLayer extends CakeBox {
  key: string;
  src: string;
  rotate?: number;
  flip?: boolean;
}

// 바깥에서 들어온 값은 목록에 없는 id일 수 있다. 그런 값은 기본 케이크의 값으로 바꾼다.
function pick<T extends { id: string }>(
  items: readonly T[],
  id: string,
  fallback: string,
): T {
  return (
    items.find((item) => item.id === id) ??
    items.find((item) => item.id === fallback) ??
    items[0]
  );
}

export function cakeScale(size: string): number {
  return pick(CAKE_SIZES, size, DEFAULT_CAKE.size).scale;
}

// 케이크 구성을 아래에서 위로 겹칠 그림 목록으로 바꾼다.
// 바탕이 맨 아래다. 자리가 정해진 장식끼리는 층 순서를 지키고, 위치를 직접 준 윗면 장식은 목록에 적힌 순서 그대로
// 그 사이에 낀다. 그래서 코팅보다 먼저 적힌 별은 코팅 아래에 깔린다. 빈 자리에 놓이는 장식은 맨 위에, 뒤쪽 자리부터 겹친다.
export function cakeLayers(
  cake: Pick<CakeConfig, "shape" | "color" | "decorations">,
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): CakeLayer[] {
  const shape = pick(CAKE_SHAPES, cake.shape, DEFAULT_CAKE.shape);
  const color = pick(CAKE_COLORS, cake.color, DEFAULT_CAKE.color);

  const base: CakeLayer = {
    key: "base",
    src: cakeBaseImage(shape.id, color.id),
    left: (CAKE_BOARD.width - shape.width) / 2 + shape.offsetX,
    top:
      CAKE_BOARD.headroom +
      (CAKE_BOARD.height - CAKE_BOARD.headroom - shape.height) / 2 +
      shape.offsetY,
    width: shape.width,
    height: shape.height,
  };

  const fixed = new Map<CakeLayerId, CakeLayer>();
  const inSpots: (CakeLayer & { spotY: number })[] = [];
  // 목록에 적힌 순서. 자리가 정해진 장식이 들어갈 칸은 null로 비워 두었다가 층 순서대로 채운다.
  const sequence: (CakeLayer | null)[] = [];
  const spots = CAKE_SPOTS[shape.id];
  const seen = new Set<string>();

  cake.decorations.forEach((chosen, index) => {
    const item = decorations.find((decoration) => decoration.id === chosen.id);
    if (!item) return;

    const scale = chosen.scale ?? 1;
    const hasPosition = chosen.x !== undefined && chosen.y !== undefined;
    // 위치를 직접 준 장식은 같은 것을 여러 번 놓을 수 있다. 위치가 없는 장식은 한 번만 놓는다.
    if (!hasPosition) {
      if (seen.has(item.id)) return;
      seen.add(item.id);
    }
    const key = `${item.id}-${index}`;
    const turn = {
      rotate: chosen.rotate || undefined,
      flip: chosen.flip || undefined,
    };
    const around = (width: number, height: number): CakeBox => ({
      left: (chosen.x ?? 0) - (width * scale) / 2,
      top: (chosen.y ?? 0) - (height * scale) / 2,
      width: width * scale,
      height: height * scale,
    });

    if (item.placement === "fixed") {
      const part = item.shapes[shape.id];
      // 같은 층에는 먼저 고른 것 하나만 놓는다. 코팅 두 가지를 한꺼번에 얹을 수는 없다.
      if (!part || fixed.has(item.layer)) return;
      const box = hasPosition ? around(part.width, part.height) : part;
      fixed.set(item.layer, { key, src: part.src, ...turn, ...box });
      sequence.push(null);
      return;
    }

    if (hasPosition) {
      sequence.push({
        key,
        src: item.src,
        ...turn,
        ...around(item.width, item.height),
      });
      return;
    }

    const spot = spots[inSpots.length];
    if (!spot) return;
    const width = item.width * scale;
    const height = item.height * scale;
    inSpots.push({
      key,
      src: item.src,
      ...turn,
      left: spot.x - width / 2,
      top: spot.y - (item.anchor === "bottom" ? height : height / 2),
      width,
      height,
      spotY: spot.y,
    });
  });

  inSpots.sort((a, b) => a.spotY - b.spotY);

  const fixedInOrder = CAKE_LAYERS.flatMap((layer) => fixed.get(layer) ?? []);
  const ordered = sequence.flatMap(
    (layer) => layer ?? fixedInOrder.shift() ?? [],
  );

  return [
    base,
    ...ordered,
    ...inSpots.map(({ spotY: _spotY, ...layer }) => layer),
  ];
}
