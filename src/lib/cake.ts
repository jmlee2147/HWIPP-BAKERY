import {
  CAKE_BOARD,
  CAKE_COLORS,
  CAKE_DECORATIONS,
  CAKE_LAYERS,
  CAKE_SHAPES,
  CAKE_SIZES,
  CAKE_SPOTS,
  CAKE_TOPS,
  type CakeBox,
  type CakeConfig,
  type CakeDecoration,
  type CakeLayerId,
  type CakeRing,
  type CakeShapeId,
  type CakeSpot,
  type CakeTop,
  cakeBaseImage,
  DEFAULT_CAKE,
  stickerOf,
} from "@/data/cake";

export interface CakeLayer extends CakeBox {
  key: string;
  src: string;
  rotate?: number;
  flip?: boolean;
  // 관람객이 직접 놓은 장식이면, 케이크 구성의 장식 목록에서의 차례.
  index?: number;
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

// 윗면의 가운데에서 주어진 방향으로 테두리까지의 거리.
function reach(top: CakeTop, dx: number, dy: number): number {
  const { center, outline } = top;
  let nearest = Number.POSITIVE_INFINITY;
  outline.forEach((from, index) => {
    const to = outline[(index + 1) % outline.length];
    const ex = to.x - from.x;
    const ey = to.y - from.y;
    const cross = dx * ey - dy * ex;
    if (cross === 0) return;
    const fx = from.x - center.x;
    const fy = from.y - center.y;
    const along = (fx * ey - fy * ex) / cross;
    const onEdge = (fx * dy - fy * dx) / cross;
    if (along > 0 && onEdge >= 0 && onEdge <= 1) {
      nearest = Math.min(nearest, along);
    }
  });
  return nearest;
}

// 윗면의 넓이.
function topArea(top: CakeTop): number {
  const { outline } = top;
  const doubled = outline.reduce((sum, from, index) => {
    const to = outline[(index + 1) % outline.length];
    return sum + from.x * to.y - to.x * from.y;
  }, 0);
  return Math.abs(doubled) / 2;
}

// 모양을 바꿨을 때 장식을 가장 많이 줄이는 비율.
const RESIZE_MIN = 1;

// 윗면이 좁아진 만큼 장식도 줄인다. 자리만 좁히고 크기를 두면 장식끼리 겹친다.
// 윗면이 넓어질 때는 키우지 않는다. 키우면 글자가 옆의 장식에 닿는다.
export function resizeForShape(from: CakeShapeId, to: CakeShapeId): number {
  if (from === to) return 1;
  const ratio = Math.sqrt(topArea(CAKE_TOPS[to]) / topArea(CAKE_TOPS[from]));
  return Math.min(1, Math.max(RESIZE_MIN, ratio));
}

// 윗면을 거의 덮는 큰 장식으로 보는 크기와, 가장 많이 줄이는 비율.
const WIDE_MIN = 400;
const WIDE_SHRINK_MIN = 0.8;

// 윗면을 거의 덮는 큰 장식(구름 모양 크림)은 윗면이 좁은 모양에서 그만큼 줄인다. 그대로 두면 윗면 밖으로 넘친다.
export function shrinkWide(from: CakeShapeId, to: CakeShapeId): number {
  if (from === to) return 1;
  const ratio = Math.sqrt(topArea(CAKE_TOPS[to]) / topArea(CAKE_TOPS[from]));
  return Math.min(1, Math.max(WIDE_SHRINK_MIN, ratio));
}

// 주어진 x에서 윗면의 앞쪽(아래쪽) 테두리의 y.
function frontEdge(top: CakeTop, x: number): number {
  const { outline } = top;
  const xs = outline.map((point) => point.x);
  const within = Math.min(Math.max(x, Math.min(...xs)), Math.max(...xs));
  let lowest = Number.NEGATIVE_INFINITY;
  outline.forEach((from, index) => {
    const to = outline[(index + 1) % outline.length];
    if (from.x === to.x) return;
    const along = (within - from.x) / (to.x - from.x);
    if (along < 0 || along > 1) return;
    lowest = Math.max(lowest, from.y + along * (to.y - from.y));
  });
  return lowest;
}

// 주어진 x에서 아래쪽 윤곽의 y.
function floorAt(floor: CakeSpot[], x: number): number {
  const index = Math.max(
    1,
    floor.findIndex((point) => point.x >= x),
  );
  const from = floor[index - 1];
  const to = floor[index] ?? from;
  if (to.x === from.x) return to.y;
  return from.y + ((x - from.x) / (to.x - from.x)) * (to.y - from.y);
}

function lengths(line: CakeSpot[]): number[] {
  return line
    .slice(1)
    .map((point, index) =>
      Math.hypot(point.x - line[index].x, point.y - line[index].y),
    );
}

// 선 위에서 주어진 점과 가장 가까운 자리. 선의 처음부터 그 자리까지의 길이와, 점까지의 거리를 함께 돌려준다.
function nearestOn(
  line: CakeSpot[],
  point: CakeSpot,
): { walked: number; spot: CakeSpot; distance: number } {
  let best = { distance: Number.POSITIVE_INFINITY, walked: 0, spot: line[0] };
  let walked = 0;
  lengths(line).forEach((part, index) => {
    const from = line[index];
    const to = line[index + 1];
    const t = Math.min(
      1,
      Math.max(
        0,
        ((point.x - from.x) * (to.x - from.x) +
          (point.y - from.y) * (to.y - from.y)) /
          (part * part),
      ),
    );
    const spot = {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
    const distance = Math.hypot(point.x - spot.x, point.y - spot.y);
    if (distance < best.distance) {
      best = { distance, walked: walked + part * t, spot };
    }
    walked += part;
  });
  return best;
}

// 선의 처음부터 주어진 길이만큼 간 자리.
function spotOn(line: CakeSpot[], walked: number): CakeSpot {
  const parts = lengths(line);
  let left = walked;
  for (let index = 0; index < parts.length; index++) {
    if (left <= parts[index] || index === parts.length - 1) {
      const t = parts[index] === 0 ? 0 : Math.min(1, left / parts[index]);
      const from = line[index];
      const to = line[index + 1];
      return {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      };
    }
    left -= parts[index];
  }
  return line[line.length - 1];
}

// 아래쪽 윤곽에서 바닥이 시작하고 끝나는 길이.
function floorEnds(floor: CakeSpot[]): { start: number; end: number } {
  const parts = lengths(floor);
  const total = parts.reduce((sum, part) => sum + part, 0);
  return { start: parts[0], end: total - parts[parts.length - 1] };
}

// 아래쪽 윤곽에서 이 거리 안에 있는 같은 장식이 이만큼 줄지어 있으면, 바닥을 따라 두른 장식으로 본다.
// 옆면 아래쪽에 한두 개 놓인 리본이나 별은 여기에 들지 않는다.
const NEAR_FLOOR = 40;
const FLOOR_CHAIN = 6;

// 아래쪽 윤곽 가까이에 있으면, 윤곽의 처음부터 그 자리까지의 길이와 윤곽 위의 가장 가까운 자리를 돌려준다.
// 윗면 위나 옆면 가운데의 장식이면 undefined다.
function alongFloor(
  point: CakeSpot,
  top: CakeTop,
): { walked: number; spot: CakeSpot } | undefined {
  const dx = point.x - top.center.x;
  const dy = point.y - top.center.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0 || distance <= reach(top, dx / distance, dy / distance)) {
    return undefined;
  }
  if (point.y < frontEdge(top, point.x)) return undefined;
  const near = nearestOn(top.floor, point);
  return near.distance <= NEAR_FLOOR ? near : undefined;
}

// 바닥을 따라 두른 장식 한 줄을 새 모양의 바닥에 다시 두른다.
// 원래 간격을 그대로 써서 새 바닥의 처음부터 끝까지 채운다. 바닥이 길어지면 개수가 늘고, 짧아지면 준다.
// 장식이 윤곽에서 벗어난 정도는 줄 전체에 같은 값을 써서, 줄이 울퉁불퉁해지지 않게 한다.
export function lineFloor(
  points: CakeSpot[],
  from: CakeShapeId,
  to: CakeShapeId,
  scale = 1,
): CakeSpot[] {
  const source = CAKE_TOPS[from];
  const found = points.flatMap((point) => {
    const near = alongFloor(point, source);
    return near ? [{ point, ...near }] : [];
  });
  if (found.length < 2) return [];

  const walked = found.map((one) => one.walked).sort((a, b) => a - b);
  const gaps = walked
    .slice(1)
    .map((value, index) => value - walked[index])
    .sort((a, b) => a - b);
  const spacing = gaps[Math.floor(gaps.length / 2)] * scale;
  // 옆면을 타고 올라가 있던 장식은 윤곽에서 벗어난 정도를 셀 때 뺀다.
  const bounds = floorEnds(source.floor);
  const settled = found.filter(
    (one) => one.walked >= bounds.start && one.walked <= bounds.end,
  );
  const mean = (pick: (one: (typeof found)[number]) => number) =>
    settled.length === 0
      ? 0
      : settled.reduce((sum, one) => sum + pick(one), 0) / settled.length;
  const lift = {
    x: mean((one) => one.point.x - one.spot.x),
    y: mean((one) => one.point.y - one.spot.y),
  };

  const target = CAKE_TOPS[to].floor;
  const { start, end } = floorEnds(target);
  const steps = Math.max(1, Math.round((end - start) / Math.max(1, spacing)));
  return Array.from({ length: steps + 1 }, (_, index) => {
    const spot = spotOn(target, start + ((end - start) * index) / steps);
    return { x: spot.x + lift.x * scale, y: spot.y + lift.y * scale };
  });
}

// 케이크의 가장 앞쪽에서 잰 옆면의 높이.
function wallHeight(top: CakeTop): number {
  const lowest = top.floor.reduce((best, point) =>
    point.y > best.y ? point : best,
  );
  return lowest.y - frontEdge(top, lowest.x);
}

// 바닥을 두른 장식을 가장 많이 줄이는 비율.
const FLOOR_SHRINK_MIN = 0.7;

// 옆면이 낮은 모양에서는 바닥을 두른 장식도 그만큼 줄인다. 그대로 두면 옆면을 다 가려 뚱뚱해 보인다.
export function shrinkForWall(from: CakeShapeId, to: CakeShapeId): number {
  const ratio = wallHeight(CAKE_TOPS[to]) / wallHeight(CAKE_TOPS[from]);
  return Math.min(1, Math.max(FLOOR_SHRINK_MIN, ratio));
}

// 옆면의 장식을 바닥의 양 끝에서 띄우는 거리.
const WALL_MARGIN = 14;
// 옆면의 장식을 두 면이 만나는 모서리에서 띄우는 거리.
const CORNER_CLEAR = 34;

// 한 모양에 맞춰 잡은 자리를 다른 모양의 같은 자리로 옮긴다.
// 윗면 안에서는 가운데에서 테두리까지의 비율을 지켜, 테두리를 따라 놓인 장식이 새 모양의 테두리를 따라가게 한다.
// 바닥을 따라 두른 장식은 이 함수로 옮기지 않고 lineFloor로 다시 두른다.
// 옆면에서는 앞쪽 테두리와 바닥 사이의 어디쯤인지를 지킨다.
// 그 밖(케이크 위나 옆의 빈 곳)에서는 테두리에서 떨어진 거리를 지킨다.
export function moveToShape(
  point: CakeSpot,
  from: CakeShapeId,
  to: CakeShapeId,
): CakeSpot {
  if (from === to) return point;
  const source = CAKE_TOPS[from];
  const target = CAKE_TOPS[to];
  const dx = point.x - source.center.x;
  const dy = point.y - source.center.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return target.center;

  const ux = dx / distance;
  const uy = dy / distance;
  const sourceReach = reach(source, ux, uy);
  const targetReach = reach(target, ux, uy);
  if (distance <= sourceReach) {
    const moved = (distance / sourceReach) * targetReach;
    return { x: target.center.x + ux * moved, y: target.center.y + uy * moved };
  }

  // 옆면의 장식은 어느 면의 어디쯤인지와, 테두리와 바닥 사이의 높이 비율을 지킨다.
  const fromFloor = source.floor.slice(1, -1);
  const within = Math.min(
    Math.max(point.x, fromFloor[0].x),
    fromFloor[fromFloor.length - 1].x,
  );
  const rim = frontEdge(source, within);
  if (point.y >= rim) {
    const depth =
      (point.y - rim) / Math.max(1, floorAt(source.floor, within) - rim);
    // 앞면의 장식은 앞면에, 오른쪽 면의 장식은 오른쪽 면에 놓는다. 각 면 안에서는 왼쪽에서 몇 할 지점인지를 지킨다.
    // 바닥을 따라 간 길이로 재면 하트처럼 왼쪽 끝이 가파른 모양에서 장식이 한쪽으로 밀린다.
    const ontoFloor = target.floor.slice(1, -1);
    const face = (floor: CakeSpot[], cornerX: number, front: boolean) =>
      front
        ? { from: floor[0].x, to: cornerX }
        : { from: cornerX, to: floor[floor.length - 1].x };
    const front = within <= source.cornerX;
    const here = face(fromFloor, source.cornerX, front);
    const there = face(ontoFloor, target.cornerX, front);
    const ratio = (within - here.from) / Math.max(1, here.to - here.from);
    // 양 끝에서는 조금 안쪽에 놓아 장식이 윤곽 밖으로 걸치지 않게 한다.
    const placed = Math.min(
      ontoFloor[ontoFloor.length - 1].x - WALL_MARGIN,
      Math.max(
        ontoFloor[0].x + WALL_MARGIN,
        there.from + ratio * (there.to - there.from),
      ),
    );
    // 두 면이 만나는 모서리 위에는 놓지 않는다. 장식이 속한 면 쪽으로 띄운다.
    const clear = Math.min(CORNER_CLEAR, (there.to - there.from) / 2);
    const x = front
      ? Math.min(placed, target.cornerX - clear)
      : Math.max(placed, target.cornerX + clear);
    const spot = { x, y: floorAt(target.floor, x) };
    const toRim = frontEdge(target, spot.x);
    return { x: spot.x, y: toRim + depth * (spot.y - toRim) };
  }

  const moved = targetReach + (distance - sourceReach);
  return { x: target.center.x + ux * moved, y: target.center.y + uy * moved };
}

// 윗면의 테두리를 따라 같은 장식이 이만큼 줄지어 있으면, 테두리를 두른 고리로 본다.
const RIM_CHAIN = 8;
// 고리는 가운데에서 테두리까지의 이 비율보다 바깥에 있고, 장식마다 그 비율이 이만큼 안에서 비슷해야 한다.
const RIM_NEAR = 0.6;
const RIM_SPREAD = 0.3;
// 옮긴 고리는 테두리에서 이만큼 안쪽에 놓는다.
const RIM_INSET = 0.8;
// 테두리 밖으로 이만큼까지 걸친 장식도 고리로 센다.
const RIM_OVER = 1.3;
// 평균이 이보다 바깥이면 테두리에 걸쳐 놓인 고리로 보고, 옮긴 뒤 이 자리에 둔다.
const RIM_ON_EDGE = 0.92;
const RIM_EDGE_INSET = 0.9;

// 윗면 위의 점이 가운데에서 테두리까지의 몇 할 지점인지와, 테두리를 한 바퀴 도는 길이의 몇 할 지점인지.
function onRim(
  point: CakeSpot,
  top: CakeTop,
): { depth: number; around: number } | undefined {
  const dx = point.x - top.center.x;
  const dy = point.y - top.center.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return undefined;
  const depth = distance / reach(top, dx / distance, dy / distance);
  if (depth > RIM_OVER) return undefined;
  const closed = [...top.outline, top.outline[0]];
  const total = lengths(closed).reduce((sum, length) => sum + length, 0);
  return { depth, around: nearestOn(closed, point).walked / total };
}

// 고리에서 가장 넓게 빈 자리가 평균 간격의 이 배수를 넘지 않으면, 한 바퀴를 다 두른 고리로 본다.
const RING_FULL = 1.8;

// 고리의 간격을 고르게 다시 나눈다. 원래 간격은 원래 모양의 원근에 맞춘 것이라 그대로 옮기면 한쪽으로 쏠린다.
// 한 바퀴를 다 두른 고리는 한 바퀴를 같은 간격으로 나누고, 일부만 두른 고리는 빈 자리를 지킨 채 두른 구간 안에서만 나눈다.
function evenly(arounds: number[]): number[] {
  const count = arounds.length;
  const order = arounds
    .map((around, index) => ({ around, index }))
    .sort((a, b) => a.around - b.around);
  const gapAfter = order.map(
    (one, rank) => (order[(rank + 1) % count].around - one.around + 1) % 1 || 1,
  );
  const widest = Math.max(...gapAfter);
  const result = [...arounds];
  const wrap = (value: number) => ((value % 1) + 1) % 1;

  if (widest > RING_FULL / count) {
    // 가장 넓게 빈 자리 다음부터 차례로 세어, 처음과 끝은 그대로 두고 그 사이를 고르게 나눈다.
    const first = (gapAfter.indexOf(widest) + 1) % count;
    const span = 1 - widest;
    for (let step = 0; step < count; step++) {
      const one = order[(first + step) % count];
      result[one.index] = wrap(
        order[first].around + (span * step) / (count - 1),
      );
    }
    return result;
  }

  // 전체를 가장 덜 움직이는 시작 자리를 고른다.
  const start = order[0].around;
  const drift =
    order.reduce((sum, one, rank) => {
      const off = one.around - rank / count - start;
      return sum + wrap(off + 0.5) - 0.5;
    }, 0) / count;
  order.forEach((one, rank) => {
    result[one.index] = wrap(start + drift + rank / count);
  });
  return result;
}

// 테두리를 두른 고리를 새 모양의 테두리 안쪽에 다시 두른다. 테두리를 따라 간 비율을 지켜 차례와 빈 자리를 그대로 둔다.
// 가운데에서의 거리는 고리 전체에 같은 값을 써서 고리가 울퉁불퉁해지지 않게 한다.
export function lineRim(
  points: CakeSpot[],
  from: CakeShapeId,
  to: CakeShapeId,
): CakeSpot[] | undefined {
  return rimPlan(points, from, to)?.line;
}

// 다시 두른 고리와, 고리의 빈 자리에 놓여 있던 다른 장식(딸기 고리의 빈 곳에 앉힌 푸딩)을 옮기는 방법.
interface RingPlan {
  line: CakeSpot[];
  // 고리의 빈 자리에 있던 장식이면 새 고리에서의 자리를, 아니면 undefined를 돌려준다.
  place: (point: CakeSpot) => CakeSpot | undefined;
}

// 고리에서 가장 넓게 빈 자리 안에 드는지. 자리는 한 바퀴에 대한 비율로 준다.
function inWidestGap(turns: number[], turn: number): boolean {
  const sorted = [...turns].sort((x, y) => x - y);
  let start = 0;
  let width = 0;
  sorted.forEach((one, rank) => {
    const gap = (sorted[(rank + 1) % sorted.length] - one + 1) % 1 || 1;
    if (gap > width) {
      width = gap;
      start = one;
    }
  });
  const into = (turn - start + 1) % 1;
  return into > 0 && into < width;
}

// 고리에서 가장 넓게 빈 자리의 한가운데.
function widestGapMiddle(turns: number[]): number {
  const sorted = [...turns].sort((x, y) => x - y);
  let start = 0;
  let width = 0;
  sorted.forEach((one, rank) => {
    const gap = (sorted[(rank + 1) % sorted.length] - one + 1) % 1 || 1;
    if (gap > width) {
      width = gap;
      start = one;
    }
  });
  return (start + width / 2) % 1;
}

// 빈 자리의 장식이 고리와 같은 굵기에 있다고 보는 차이.
const COMPANION_DEPTH = 0.35;

function rimPlan(
  points: CakeSpot[],
  from: CakeShapeId,
  to: CakeShapeId,
): RingPlan | undefined {
  const found = points.map((point) => onRim(point, CAKE_TOPS[from]));
  if (found.length < RIM_CHAIN || found.some((one) => !one)) return undefined;
  const depths = found.map((one) => one?.depth ?? 0);
  const mean = depths.reduce((sum, depth) => sum + depth, 0) / depths.length;
  if (mean < RIM_NEAR) return undefined;
  if (Math.max(...depths) - Math.min(...depths) > RIM_SPREAD) return undefined;

  const target = CAKE_TOPS[to];
  const closed = [...target.outline, target.outline[0]];
  const total = lengths(closed).reduce((sum, length) => sum + length, 0);
  // 테두리에 걸쳐 놓여 있던 고리는 새 모양에서도 테두리 가까이에 둔다.
  const inset = mean > RIM_ON_EDGE ? RIM_EDGE_INSET : Math.min(mean, RIM_INSET);
  const original = found.map((one) => one?.around ?? 0);
  const at = (around: number): CakeSpot => {
    const spot = spotOn(closed, total * around);
    return {
      x: target.center.x + (spot.x - target.center.x) * inset,
      y: target.center.y + (spot.y - target.center.y) * inset,
    };
  };
  // 빈 자리에 있던 장식은 다시 두른 고리의 빈 자리 한가운데에 놓는다. 빠진 장식이 있었을 바로 그 자리다.
  const evened = evenly(original);
  return {
    line: evened.map(at),
    place: (point) => {
      const one = onRim(point, CAKE_TOPS[from]);
      if (!one || Math.abs(one.depth - mean) > COMPANION_DEPTH) {
        return undefined;
      }
      return inWidestGap(original, one.around)
        ? at(widestGapMiddle(evened))
        : undefined;
    },
  };
}

// 고리로 보려면 가운데 둘레로 이보다 넓게 빈 자리가 없어야 하고(한 바퀴에 대한 비율), 고리의 굵기가 이 안에서 고르게 나와야 한다.
const LOOP_GAP = 0.3;
const LOOP_SPREAD = 0.35;

// 윗면 테두리보다 작게, 윗면의 한쪽에 두른 고리를 새 모양의 윤곽을 닮은 고리로 다시 두른다.
// 원형 케이크 위의 둥근 고리는 하트 케이크 위에서 하트 모양 고리가 된다. 고리의 자리와 크기 비율은 지킨다.
export function lineLoop(
  points: CakeSpot[],
  from: CakeShapeId,
  to: CakeShapeId,
): CakeSpot[] | undefined {
  return loopPlan(points, from, to)?.line;
}

function loopPlan(
  points: CakeSpot[],
  from: CakeShapeId,
  to: CakeShapeId,
): RingPlan | undefined {
  if (points.length < RIM_CHAIN) return undefined;
  const source = CAKE_TOPS[from];
  const target = CAKE_TOPS[to];
  // 테두리에 살짝 걸친 것까지는 윗면의 장식으로 본다.
  if (!points.every((point) => onRim(point, source))) return undefined;

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const middle = {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
  const outlineXs = source.outline.map((point) => point.x);
  const outlineYs = source.outline.map((point) => point.y);
  const kx =
    (Math.max(...xs) - Math.min(...xs)) /
    (Math.max(...outlineXs) - Math.min(...outlineXs));
  const ky =
    (Math.max(...ys) - Math.min(...ys)) /
    (Math.max(...outlineYs) - Math.min(...outlineYs));
  if (kx <= 0 || ky <= 0) return undefined;

  // 고리를 윗면 크기로 늘려 놓고 보면, 각 장식이 윗면 테두리의 어느 방향에 얼마나 가까이 있는지가 나온다.
  const measure = (point: CakeSpot) => {
    const vx = (point.x - middle.x) / kx;
    const vy = (point.y - middle.y) / ky;
    const length = Math.hypot(vx, vy);
    if (length === 0) return { turn: 0, depth: 0 };
    return {
      turn: (Math.atan2(vy, vx) / (Math.PI * 2) + 1) % 1,
      depth: length / reach(source, vx / length, vy / length),
    };
  };
  const spread = points.map(measure);
  const depths = spread.map((one) => one.depth);
  if (Math.max(...depths) - Math.min(...depths) > LOOP_SPREAD) return undefined;
  const turns = spread.map((one) => one.turn).sort((a, b) => a - b);
  const widest = Math.max(
    ...turns.map(
      (turn, rank) => (turns[(rank + 1) % turns.length] - turn + 1) % 1 || 1,
    ),
  );
  if (widest > LOOP_GAP) return undefined;

  const resize = resizeForShape(from, to);
  const moved = {
    x: target.center.x + (middle.x - source.center.x) * resize,
    y: target.center.y + (middle.y - source.center.y) * resize,
  };
  const depth = depths.reduce((sum, one) => sum + one, 0) / depths.length;
  const at = (turn: number): CakeSpot => {
    const angle = turn * Math.PI * 2;
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const far = reach(target, ux, uy) * depth;
    return { x: moved.x + ux * far * kx, y: moved.y + uy * far * ky };
  };
  const original = spread.map((one) => one.turn);
  const evened = evenly(original);
  return {
    line: evened.map(at),
    place: (point) => {
      const one = measure(point);
      if (Math.abs(one.depth - depth) > COMPANION_DEPTH) return undefined;
      return inWidestGap(original, one.turn)
        ? at(widestGapMiddle(evened))
        : undefined;
    },
  };
}

// 케이크를 주어진 모양으로 바꾸면 그릴 수 없게 되는 장식의 id. 케이크 모양을 따라 그린 장식 가운데 그 모양의 그림이 없는 것이다.
export function lostInShape(
  cake: Pick<CakeConfig, "decorations">,
  shape: CakeShapeId,
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): string[] {
  const chosen = new Set(cake.decorations.map((item) => item.id));
  return decorations
    .filter(
      (item) =>
        chosen.has(item.id) &&
        item.placement === "fixed" &&
        item.layer !== "lettering" &&
        !item.shapes[shape] &&
        !item.rings?.[shape],
    )
    .map((item) => item.id);
}

// 낱개 장식을 윗면 테두리 안쪽을 따라 같은 간격으로 두른다. 뒤쪽 것부터 그려 앞쪽 것이 위에 겹치게 한다.
function ringOf(
  ring: CakeRing,
  top: CakeTop,
  decorations: CakeDecoration[],
): ({ src: string } & CakeBox)[] {
  const part = decorations.find((item) => item.id === ring.part);
  if (part?.placement !== "top") return [];
  const line = top.outline.map((point) => ({
    x: top.center.x + (point.x - top.center.x) * ring.inset,
    y: top.center.y + (point.y - top.center.y) * ring.inset,
  }));
  const closed = [...line, line[0]];
  const total = lengths(closed).reduce((sum, length) => sum + length, 0);
  const width = part.width * ring.scale;
  const height = part.height * ring.scale;
  return Array.from({ length: ring.count }, (_, index) =>
    spotOn(closed, (total * index) / ring.count),
  )
    .sort((a, b) => a.y - b.y)
    .map((spot) => ({
      src: part.src,
      left: spot.x - width / 2,
      top: spot.y - height / 2,
      width,
      height,
    }));
}

// 윗면 안에 있는 점인지.
function onTop(top: CakeTop, point: CakeSpot): boolean {
  const dx = point.x - top.center.x;
  const dy = point.y - top.center.y;
  const distance = Math.hypot(dx, dy);
  return distance === 0 || distance <= reach(top, dx / distance, dy / distance);
}

// 다른 장식 위에 얹힌 장식은 받침과 한 덩어리로 옮긴다. 따로 옮기면 체리가 크림에서 떨어진다.
// 받침은 이 크기보다 작은 장식이어야 한다. 케이크를 덮는 큰 장식까지 받침으로 보면 모든 장식이 한 덩어리가 된다.
const SUPPORT_MAX = 220;
// 얹힌 자리가 받침 그림의 가운데 이만큼 안에 있어야 한다.
const SUPPORT_CORE = 0.8;

interface Placed {
  // 원래 모양에서의 기준 자리와 그림의 가운데, 크기.
  anchor: CakeSpot;
  center: CakeSpot;
  width: number;
  height: number;
  // 새 모양에서의 기준 자리.
  spot: CakeSpot;
}

function supportOf(placed: Placed[], anchor: CakeSpot): Placed | undefined {
  return placed.find(
    (one) =>
      one.width <= SUPPORT_MAX &&
      one.height <= SUPPORT_MAX &&
      Math.abs(anchor.x - one.center.x) <= (one.width * SUPPORT_CORE) / 2 &&
      Math.abs(anchor.y - one.center.y) <= (one.height * SUPPORT_CORE) / 2,
  );
}

// 세트의 중심이 될 수 있는 장식의 가장 큰 크기와, 딸린 장식보다 커야 하는 넓이의 배수, 붙어 있다고 보는 거리.
const SET_LEAD_MAX = 440;
const SET_LEAD_RATIO = 1.5;
const SET_REACH = 12;

// 윗면 장식의 묶음을 가운데 쪽으로 모으는 한계(크기를 줄인 비율에 대한 배수)와, 한 번에 모으는 정도.
const GATHER_MIN = 0.93;
const GATHER_STEP = 0.04;
// 테두리에 가까운 장식이 새 테두리를 따라가는 정도. 클수록 가운데의 장식은 덜 움직인다.
const FOLLOW_POWER = 1.5;
// 묶음을 가운데 쪽으로 미는 단계의 수. 마지막 단계에서 묶음의 한가운데가 윗면 가운데에 온다.
const NUDGE_STEPS = 10;
// 넓은 윗면에서 장식 사이를 가장 많이 벌리는 비율.
const STRETCH_MAX = 1.2;
// 케이크의 중심이 되는 글자로 보는 가장 작은 폭.
const WORDS_MIN = 150;
// 글자 그림에서 실제로 글자가 차지하는 부분. 이 안에 작은 장식의 가운데가 들어오면 글자를 가린다고 본다.
const WORDS_CORE = 0.85;
const WORDS_COVER = 0.6;
// 윗면에 걸쳐 있던 장식 가운데 이보다 작은 것만 윗면 안으로 들인다. 큰 리본이나 꽃은 테두리에 걸쳐 두는 것이 원래 배치다.
const TUCK_MAX = 160;
const NUDGE_BASE = 8;
const NUDGE_DOWN = 0.4;

// 고리의 빈 자리에 앉힌 장식으로 보는 가장 작은 크기. 작은 별이나 진주는 세지 않는다.
const COMPANION_SIZE = 120;

// 옆면의 장식을 윗면 테두리에서 띄우는 거리.
const RIM_CLEAR = 22;

// 옆면의 같은 장식끼리 띄우는 간격. 장식 폭에 대한 비율이다.
const WALL_GAP = 0.9;

// 둘러 놓인 크림에서 이 거리 안에 온 장식은 그 크림 위에 얹는다.
const PERCH_REACH = 70;
// 원래 모양에서 크림에서 이 거리 안에 있던 장식만 크림 위에 얹혀 있던 것으로 본다.
const PERCHED = 45;

// 장식이 윗면에 닿는 폭. 그림 폭의 이만큼이 윗면 안에 있어야 얹혀 보인다.
const FOOTPRINT = 0.7;
// 얹힐 자리를 찾을 때 한 번에 넓히는 거리와 한계, 둘러보는 방향의 수.
const SETTLE_STEP = 8;
const SETTLE_MAX = 200;
const SETTLE_TURNS = 24;

// 옮긴 장식은 테두리에 바짝 붙이지 않고, 윗면을 이만큼 줄인 안쪽에 놓는다.
const INNER = 0.88;

// 장식의 밑면 양 끝이 윗면(을 inner만큼 줄인 곳) 안에 있는지.
function sitsOnTop(
  top: CakeTop,
  spot: CakeSpot,
  width: number,
  inner = 1,
): boolean {
  const half = (width * FOOTPRINT) / 2;
  return [-half, half].every((dx) =>
    onTop(top, {
      x: top.center.x + (spot.x + dx - top.center.x) / inner,
      y: top.center.y + (spot.y - top.center.y) / inner,
    }),
  );
}

// 윗면에 온전히 얹혀 있던 장식이 새 모양에서 테두리 밖으로 걸치면, 얹힐 수 있는 가장 가까운 자리로 옮긴다.
// 가운데로만 당기면 하트의 파인 곳에 걸린 장식이 가운데의 다른 장식 위로 올라간다.
function settleOnTop(top: CakeTop, spot: CakeSpot, width: number): CakeSpot {
  if (sitsOnTop(top, spot, width, INNER)) return spot;
  for (let reach = SETTLE_STEP; reach <= SETTLE_MAX; reach += SETTLE_STEP) {
    const found = Array.from({ length: SETTLE_TURNS }, (_, turn) => {
      const angle = (turn / SETTLE_TURNS) * Math.PI * 2;
      return {
        x: spot.x + Math.cos(angle) * reach,
        y: spot.y + Math.sin(angle) * reach,
      };
    }).filter((moved) => sitsOnTop(top, moved, width, INNER));
    if (found.length > 0) {
      // 같은 거리라면 가운데에 더 가까운 쪽을 고른다.
      return found.reduce((best, moved) =>
        Math.hypot(moved.x - top.center.x, moved.y - top.center.y) <
        Math.hypot(best.x - top.center.x, best.y - top.center.y)
          ? moved
          : best,
      );
    }
  }
  return spot;
}

// 그림의 가장자리에는 여백이 있다. 글자가 윗면 안에 드는지는 그림의 이만큼만 보고 따진다.
const LETTERING_CORE = 0.9;
// 윗면 안에 들 때까지 가운데로 당기고 줄이는 횟수와, 한 번에 줄이는 비율.
const FIT_STEPS = 10;
const FIT_SHRINK = 0.95;

// 지금 모양의 그림이 없는 글자를 다른 모양의 그림으로 대신한다. 장식의 위치를 잡은 모양의 그림을 먼저 찾는다.
// 윗면에서 놓여 있던 자리를 새 윗면의 같은 자리로 옮기고, 새 윗면이 더 작으면 그만큼 줄인다.
// 그래도 윗면을 벗어나면 안에 들 때까지 가운데 쪽으로 당기며 조금씩 줄인다.
function borrow(
  shapes: Partial<Record<CakeShapeId, { src: string } & CakeBox>>,
  preferred: CakeShapeId,
  to: CakeShapeId,
  carry: (spot: CakeSpot) => CakeSpot,
  gathered: number,
): ({ src: string } & CakeBox) | undefined {
  const from = shapes[preferred]
    ? preferred
    : CAKE_SHAPES.find((shape) => shapes[shape.id])?.id;
  const part = from && shapes[from];
  if (!from || !part) return undefined;

  const target = CAKE_TOPS[to];
  // 장식의 위치를 잡은 모양의 그림이면 윗면의 다른 장식과 똑같이 옮긴다. 따로 옮기면 꽃이 글자를 가린다.
  const middle = {
    x: part.left + part.width / 2,
    y: part.top + part.height / 2,
  };
  const moved =
    from === preferred ? carry(middle) : moveToShape(middle, from, to);
  const ratio = from === preferred ? gathered : resizeForShape(from, to);

  let box = { ...part };
  for (let step = 0; step <= FIT_STEPS; step++) {
    const pull = step / FIT_STEPS;
    const x = moved.x + (target.center.x - moved.x) * pull;
    const y = moved.y + (target.center.y - moved.y) * pull;
    const width = part.width * ratio * FIT_SHRINK ** step;
    const height = part.height * ratio * FIT_SHRINK ** step;
    box = { ...part, left: x - width / 2, top: y - height / 2, width, height };
    const reachX = (width * LETTERING_CORE) / 2;
    const reachY = (height * LETTERING_CORE) / 2;
    const fits = [-1, 1].every((sx) =>
      [-1, 1].every((sy) =>
        onTop(target, { x: x + sx * reachX, y: y + sy * reachY }),
      ),
    );
    if (fits) break;
  }
  return box;
}

// 케이크 구성을 아래에서 위로 겹칠 그림 목록으로 바꾼다.
// 바탕이 맨 아래다. 자리가 정해진 장식끼리는 층 순서를 지키고, 위치를 직접 준 윗면 장식은 목록에 적힌 순서 그대로
// 그 사이에 낀다. 그래서 코팅보다 먼저 적힌 별은 코팅 아래에 깔린다. 빈 자리에 놓이는 장식은 맨 위에, 뒤쪽 자리부터 겹친다.
// 장식의 위치를 잡은 모양과 지금 모양이 다르면, 위치를 직접 준 장식을 지금 모양의 같은 자리로 옮겨 그린다.
export function cakeLayers(
  config: Pick<
    CakeConfig,
    "shape" | "color" | "decorations" | "layoutShape" | "shift"
  >,
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): CakeLayer[] {
  const shape = pick(CAKE_SHAPES, config.shape, DEFAULT_CAKE.shape);
  // 특정 모양에서만 그리는 장식은 그 모양이 아닐 때 처음부터 없는 것으로 친다.
  // 관람객이 직접 놓은 장식은 예시의 배치를 옮기는 계산에 넣지 않는다. 넣으면 장식을 하나 더할 때마다 다른 장식이 움직인다.
  const byHand = (chosen: CakeConfig["decorations"][number]) =>
    chosen.manual === true &&
    chosen.x !== undefined &&
    chosen.y !== undefined &&
    stickerOf(
      decorations.find((one) => one.id === chosen.id),
      shape.id,
    ) !== undefined;
  const cake = {
    ...config,
    decorations: config.decorations.filter(
      (chosen) =>
        !byHand(chosen) && (!chosen.only || chosen.only.includes(shape.id)),
    ),
  };
  const layoutShape = pick(
    CAKE_SHAPES,
    cake.layoutShape ?? shape.id,
    shape.id,
  ).id;
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

  const fixed = new Map<CakeLayerId, CakeLayer[]>();
  const inSpots: (CakeLayer & { spotY: number })[] = [];
  // 목록에 적힌 순서. 자리가 정해진 장식이 들어갈 칸은 null로 비워 두었다가 층 순서대로 채운다.
  const sequence: (CakeLayer | null)[] = [];
  const spots = CAKE_SPOTS[shape.id];
  const seen = new Set<string>();
  // 옮길 때 기준으로 삼는 자리. 세워 두는 장식은 밑동이 닿은 자리를 기준으로 옮겨야 케이크에서 뜨지 않는다.
  const anchorOf = (
    chosen: CakeConfig["decorations"][number],
    height: number,
    standing: boolean,
  ): CakeSpot => ({
    x: chosen.x ?? 0,
    y: (chosen.y ?? 0) + (standing ? (height * (chosen.scale ?? 1)) / 2 : 0),
  });
  // 바닥을 따라 두른 장식의 id와 그 자리들.
  const nearFloor = new Map<string, CakeSpot[]>();
  if (layoutShape !== shape.id) {
    for (const chosen of cake.decorations) {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "top") continue;
      if (chosen.x === undefined || chosen.y === undefined) continue;
      const anchor = anchorOf(chosen, item.height, item.anchor === "bottom");
      if (!alongFloor(anchor, CAKE_TOPS[layoutShape])) continue;
      nearFloor.set(item.id, [...(nearFloor.get(item.id) ?? []), anchor]);
    }
  }
  const chains = new Map(
    [...nearFloor].filter(([, points]) => points.length >= FLOOR_CHAIN),
  );
  const lined = new Set<string>();
  // 바닥을 두른 장식은 케이크의 맨 앞에 있으므로 다른 장식보다 나중에 그린다.
  const floorLine: CakeLayer[] = [];
  // 다른 윗면 장식들 위에 얹어 그리도록 적어 둔 장식.
  const onTopOfAll: CakeLayer[] = [];
  // 윗면의 테두리를 따라 두른 고리. 목록에서의 차례를 열쇠로, 새 모양에서의 자리를 값으로 둔다.
  const onRing = new Map<number, CakeSpot>();
  if (layoutShape !== shape.id) {
    const byId = new Map<string, { index: number; anchor: CakeSpot }[]>();
    const loose: { index: number; anchor: CakeSpot }[] = [];
    const earlier: Placed[] = [];
    cake.decorations.forEach((chosen, index) => {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "top" || chains.has(item.id)) return;
      if (chosen.x === undefined || chosen.y === undefined) return;
      const anchor = anchorOf(chosen, item.height, item.anchor === "bottom");
      // 다른 장식 위에 얹힌 것(크림 위의 체리)은 고리로 세지 않는다. 받침을 따라가야 한다.
      const riding = supportOf(earlier, anchor);
      earlier.push({
        anchor,
        center: { x: chosen.x, y: chosen.y },
        width: item.width * (chosen.scale ?? 1),
        height: item.height * (chosen.scale ?? 1),
        spot: anchor,
      });
      if (riding) return;
      byId.set(item.id, [...(byId.get(item.id) ?? []), { index, anchor }]);
      if (
        Math.max(item.width, item.height) * (chosen.scale ?? 1) >=
        COMPANION_SIZE
      ) {
        loose.push({ index, anchor });
      }
    });
    for (const members of byId.values()) {
      const anchors = members.map((one) => one.anchor);
      const plan =
        rimPlan(anchors, layoutShape, shape.id) ??
        loopPlan(anchors, layoutShape, shape.id);
      if (!plan) continue;
      plan.line.forEach((spot, order) => {
        onRing.set(members[order].index, spot);
      });
      // 고리의 빈 자리에 앉혀 둔 큰 장식은 새 고리의 빈 자리로 옮긴다. 따로 옮기면 고리의 장식과 겹친다.
      for (const other of loose) {
        if (onRing.has(other.index)) continue;
        const spot = plan.place(other.anchor);
        if (spot) onRing.set(other.index, spot);
      }
    }
  }

  const placed: Placed[] = [];
  // 윗면의 장식은 서로의 배치를 지킨 채 윗면 가운데를 기준으로 통째로 옮긴다.
  // 하나씩 테두리에 맞춰 옮기면 모아 놓은 장식이 찌그러지거나 서로 겹친다.
  // 새 윗면에 다 들어가지 않으면 묶음 전체를 같은 비율로 가운데 쪽으로 모은다.
  // 그래도 들어가지 않으면 묶음을 통째로 윗면 가운데 쪽으로 민다.
  let gather = resizeForShape(layoutShape, shape.id);
  let nudge = { x: 0, y: 0 };
  // 윗면이 더 넓은 모양으로 바꾸면 장식 사이를 그만큼 벌린다. 좁은 윗면에 맞춘 배치를 그대로 두면 한쪽에 몰려 보인다.
  const extent = (top: CakeTop) => {
    const xs = top.outline.map((point) => point.x);
    const ys = top.outline.map((point) => point.y);
    return {
      x: Math.max(...xs) - Math.min(...xs),
      y: Math.max(...ys) - Math.min(...ys),
    };
  };
  const wider = (to: number, from: number) =>
    Math.min(STRETCH_MAX, Math.max(1, to / from));
  const stretch = {
    x: wider(extent(CAKE_TOPS[shape.id]).x, extent(CAKE_TOPS[layoutShape]).x),
    y: wider(extent(CAKE_TOPS[shape.id]).y, extent(CAKE_TOPS[layoutShape]).y),
  };
  const carry = (anchor: CakeSpot): CakeSpot => {
    const source = CAKE_TOPS[layoutShape];
    const from = source.center;
    const onto = CAKE_TOPS[shape.id].center;
    const rigid = {
      x: onto.x + (anchor.x - from.x) * gather * stretch.x + nudge.x,
      y: onto.y + (anchor.y - from.y) * gather * stretch.y + nudge.y,
    };
    // 가운데의 장식은 배치를 그대로 지키고, 테두리에 가까운 장식일수록 새 모양의 테두리를 따라가게 한다.
    // 그대로만 옮기면 하트의 윤곽을 따라 놓은 장식이 원형 위에서도 하트 모양으로 남는다.
    const dx = anchor.x - from.x;
    const dy = anchor.y - from.y;
    const distance = Math.hypot(dx, dy);
    if (distance === 0) return rigid;
    const depth = Math.min(
      1,
      distance / reach(source, dx / distance, dy / distance),
    );
    const follow = depth ** FOLLOW_POWER;
    const along = moveToShape(anchor, layoutShape, shape.id);
    return {
      x: rigid.x + (along.x - rigid.x) * follow,
      y: rigid.y + (along.y - rigid.y) * follow,
    };
  };
  if (layoutShape !== shape.id) {
    const resize = gather;
    const seated = cake.decorations.flatMap((chosen, index) => {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "top" || onRing.has(index)) return [];
      if (chosen.x === undefined || chosen.y === undefined) return [];
      const anchor = anchorOf(chosen, item.height, item.anchor === "bottom");
      const width = item.width * (chosen.scale ?? 1);
      return sitsOnTop(CAKE_TOPS[layoutShape], anchor, width)
        ? [{ anchor, width: width * resize }]
        : [];
    });
    // 묶음의 한가운데를 윗면 가운데 쪽으로 절반쯤 당겨 둔다. 원래 모양에서 한쪽에 모아 둔 장식은
    // 다른 모양에서 그대로 두면 치우쳐 보인다.
    const { center } = CAKE_TOPS[shape.id];
    const spots = seated.map((one) => carry(one.anchor));
    const middle =
      spots.length === 0
        ? center
        : {
            x: spots.reduce((sum, spot) => sum + spot.x, 0) / spots.length,
            y: spots.reduce((sum, spot) => sum + spot.y, 0) / spots.length,
          };
    // 위아래로는 덜 당긴다. 세워 둔 장식은 윗면 가운데보다 조금 위(뒤쪽)에 모아 두는 것이 원래 배치라,
    // 가운데까지 끌어내리면 아래로 처져 보인다.
    const toward = (step: number) => ({
      x: ((center.x - middle.x) * step) / NUDGE_STEPS,
      y: (((center.y - middle.y) * step) / NUDGE_STEPS) * NUDGE_DOWN,
    });
    // 지금 모양의 자리가 정해진 글자가 있으면 당기지 않는다. 글자는 제자리에 있는데 둘레의 장식만 움직여 글자를 가린다.
    const anchored = cake.decorations.some((chosen) => {
      const item = decorations.find((one) => one.id === chosen.id);
      return (
        item?.placement === "fixed" &&
        item.layer === "lettering" &&
        item.shapes[shape.id] !== undefined
      );
    });
    const base = anchored ? 0 : NUDGE_BASE;
    nudge = toward(base);
    // 위치를 직접 준 큰 글자가 있으면 그 글자가 윗면 한가운데에 오도록 묶음을 통째로 옮긴다.
    // 글자가 케이크의 중심인데, 둘레 장식의 무게에 끌려 한쪽으로 치우치면 안 된다.
    const words = cake.decorations.flatMap((chosen) => {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "top" || item.category !== "lettering") return [];
      if (chosen.x === undefined || chosen.y === undefined) return [];
      if (item.width * (chosen.scale ?? 1) < WORDS_MIN) return [];
      return [{ x: chosen.x, y: chosen.y }];
    });
    const centered = !anchored && words.length === 1;
    if (centered) {
      nudge = { x: 0, y: 0 };
      const at = carry(words[0]);
      nudge = { x: center.x - at.x, y: center.y - at.y };
    }
    // 테두리에 바짝 붙지 않도록 여유를 두고 넣는다.
    const fits = () =>
      seated.every((one) =>
        sitsOnTop(CAKE_TOPS[shape.id], carry(one.anchor), one.width, INNER),
      );
    while (gather > resize * GATHER_MIN && !fits()) {
      gather -= GATHER_STEP;
    }
    for (
      let step = base + 1;
      !centered && step <= NUDGE_STEPS && !fits();
      step++
    ) {
      nudge = toward(step);
    }
  }

  const shift = layoutShape === shape.id ? undefined : cake.shift?.[shape.id];
  if (shift) nudge = { x: nudge.x + shift.x, y: nudge.y + shift.y };

  // 옆면에 놓인 같은 장식끼리는 옮긴 뒤에도 겹치지 않게 좌우로 벌린다.
  const onWall = new Map<number, CakeSpot>();
  const noRoom = new Set<number>();
  if (layoutShape !== shape.id) {
    const source = CAKE_TOPS[layoutShape];
    const { floor } = CAKE_TOPS[shape.id];
    const groups = new Map<
      string,
      { index: number; spot: CakeSpot; width: number }[]
    >();
    cake.decorations.forEach((chosen, index) => {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "top" || chains.has(item.id)) return;
      if (chosen.x === undefined || chosen.y === undefined) return;
      const anchor = anchorOf(chosen, item.height, item.anchor === "bottom");
      if (onTop(source, anchor) || anchor.y < frontEdge(source, anchor.x)) {
        return;
      }
      const width =
        item.width *
        (chosen.scale ?? 1) *
        resizeForShape(layoutShape, shape.id);
      groups.set(item.id, [
        ...(groups.get(item.id) ?? []),
        { index, spot: moveToShape(anchor, layoutShape, shape.id), width },
      ]);
    });
    const right = floor[floor.length - 1].x;
    for (const members of groups.values()) {
      members.sort((a, b) => a.spot.x - b.spot.x);
      const kept: typeof members = [];
      for (const one of members) {
        // 위아래로 겹치는 앞의 장식과는 좌우로 띄운다. 높이가 다르면 그대로 둔다.
        for (const before of kept) {
          const gap = ((one.width + before.width) / 2) * WALL_GAP;
          if (Math.abs(one.spot.y - before.spot.y) >= gap) continue;
          one.spot = {
            ...one.spot,
            x: Math.max(one.spot.x, before.spot.x + gap),
          };
        }
        // 띄우고 나서 케이크 밖으로 나가는 장식은 놓을 자리가 없는 것이라 그리지 않는다.
        if (one.spot.x + (one.width * FOOTPRINT) / 2 > right) {
          noRoom.add(one.index);
          continue;
        }
        kept.push(one);
        onWall.set(one.index, one.spot);
      }
    }
  }

  // 낱개 장식을 둘러 그리는 장식이 있으면, 주어진 모양에서 둘러 놓이는 자리들.
  const ringSpots = (on: CakeShapeId): CakeSpot[] =>
    cake.decorations.flatMap((chosen) => {
      const item = decorations.find((one) => one.id === chosen.id);
      const ring = item?.placement === "fixed" && item.rings?.[on];
      if (!ring) return [];
      return ringOf(ring, CAKE_TOPS[on], decorations).map((box) => ({
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
      }));
    });
  // 원래 모양에서 크림이 놓여 있던 자리와, 지금 모양에서 비어 있는 크림 자리.
  const perchedOn = layoutShape === shape.id ? [] : ringSpots(layoutShape);
  const perches = layoutShape === shape.id ? [] : ringSpots(shape.id);

  // 더 큰 장식에 바짝 붙여 놓은 장식은 그 장식과 한 세트다(푸딩을 감싼 딸기). 세트는 큰 장식을 따라 통째로 옮긴다.
  const setLead = new Map<
    number,
    { index: number; anchor: CakeSpot; width: number }
  >();
  if (layoutShape !== shape.id) {
    const tops = cake.decorations.flatMap((chosen, index) => {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "top") return [];
      if (chosen.x === undefined || chosen.y === undefined) return [];
      if (chains.has(item.id)) return [];
      const width = item.width * (chosen.scale ?? 1);
      const height = item.height * (chosen.scale ?? 1);
      return [
        {
          index,
          width,
          height,
          x: chosen.x,
          y: chosen.y,
          anchor: anchorOf(chosen, item.height, item.anchor === "bottom"),
        },
      ];
    });
    for (const one of tops) {
      if (onRing.has(one.index)) continue;
      const area = one.width * one.height;
      const leads = tops.filter(
        (lead) =>
          lead.index !== one.index &&
          Math.max(lead.width, lead.height) <= SET_LEAD_MAX &&
          // 크기가 같은 것끼리(나란히 붙인 딸기 둘)는 먼저 놓인 쪽을 따라간다.
          (lead.width * lead.height >= area * SET_LEAD_RATIO ||
            (lead.width * lead.height >= area && lead.index < one.index)) &&
          onTop(CAKE_TOPS[layoutShape], lead.anchor) &&
          Math.abs(lead.x - one.x) <=
            (lead.width + one.width) / 2 + SET_REACH &&
          Math.abs(lead.y - one.y) <=
            (lead.height + one.height) / 2 + SET_REACH,
      );
      if (leads.length === 0) {
        // 케이크 위로 솟은 큰 장식(꽃 줄기)은 그 그림 안에 놓인 장식 가운데 가장 큰 것(꽃)을 따라간다.
        // 따로 옮기면 줄기와 꽃이 어긋난다.
        const source = CAKE_TOPS[layoutShape];
        const above =
          !onTop(source, one.anchor) &&
          one.anchor.y < frontEdge(source, one.anchor.x);
        const inside = above
          ? tops.filter(
              (other) =>
                other.index !== one.index &&
                Math.abs(other.x - one.x) <= one.width / 2 &&
                Math.abs(other.y - one.y) <= one.height / 2,
            )
          : [];
        if (inside.length > 0) {
          const largest = inside.reduce((best, next) =>
            next.width * next.height > best.width * best.height ? next : best,
          );
          setLead.set(one.index, {
            index: largest.index,
            anchor: largest.anchor,
            width: largest.width,
          });
        }
        continue;
      }
      const lead = leads.reduce((best, next) =>
        Math.hypot(next.x - one.x, next.y - one.y) <
        Math.hypot(best.x - one.x, best.y - one.y)
          ? next
          : best,
      );
      setLead.set(one.index, {
        index: lead.index,
        anchor: lead.anchor,
        width: lead.width,
      });
    }
  }

  // 윗면을 거의 덮는 큰 장식과, 그 장식을 줄이는 비율.
  const wideShrink = shrinkWide(layoutShape, shape.id);
  const wide = new Map<number, CakeBox>();
  if (layoutShape !== shape.id) {
    cake.decorations.forEach((chosen, index) => {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "top") return;
      if (chosen.x === undefined || chosen.y === undefined) return;
      const width = item.width * (chosen.scale ?? 1);
      const height = item.height * (chosen.scale ?? 1);
      if (Math.max(width, height) < WIDE_MIN) return;
      if (!onTop(CAKE_TOPS[layoutShape], { x: chosen.x, y: chosen.y })) return;
      wide.set(index, {
        left: chosen.x - width / 2,
        top: chosen.y - height / 2,
        width,
        height,
      });
    });
  }
  // 큰 장식 위에 쓴 글자는 그 장식과 같은 비율로 줄인다.
  const onWide = (box: CakeBox | undefined): number => {
    if (!box) return 1;
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    return [...wide.values()].some(
      (one) =>
        x >= one.left &&
        x <= one.left + one.width &&
        y >= one.top &&
        y <= one.top + one.height,
    )
      ? wideShrink
      : 1;
  };

  // 모양이 바뀐 케이크에서 글자가 놓이는 자리와, 원래 모양에서 놓여 있던 자리.
  const words = (() => {
    if (layoutShape === shape.id) return undefined;
    for (const chosen of cake.decorations) {
      const item = decorations.find((one) => one.id === chosen.id);
      if (item?.placement !== "fixed" || item.layer !== "lettering") continue;
      const now =
        item.shapes[shape.id] ??
        borrow(
          item.shapes,
          layoutShape,
          shape.id,
          carry,
          gather * onWide(item.shapes[layoutShape]),
        );
      if (now) return { now, before: item.shapes[layoutShape] };
    }
    return undefined;
  })();

  // 네모의 오른쪽 면에 맞춰 기울인 장식은 원형의 옆면에서는 옆으로 돌아 들어간 만큼만 기울인다.
  // 그대로 두면 앞쪽에 가까운 장식이 혼자 크게 기울어 보인다.
  const wallTurn = (index: number, rotate = 0): number => {
    if (layoutShape === shape.id || shape.id !== "round") return rotate;
    const chosen = cake.decorations[index];
    const item = decorations.find((one) => one.id === chosen.id);
    if (item?.placement !== "top") return rotate;
    if (chosen.x === undefined || chosen.y === undefined) return rotate;
    const source = CAKE_TOPS[layoutShape];
    const inWall = (spot: CakeSpot) =>
      !onTop(source, spot) && spot.y >= frontEdge(source, spot.x);
    const anchor = anchorOf(chosen, item.height, item.anchor === "bottom");
    if (!inWall(anchor) || anchor.x <= source.cornerX) return rotate;
    const fronts = cake.decorations.filter(
      (other) =>
        other.id === chosen.id &&
        other.x !== undefined &&
        other.y !== undefined &&
        other.x <= source.cornerX &&
        inWall({ x: other.x, y: other.y }),
    );
    const front =
      fronts.length === 0
        ? 0
        : fronts.reduce((sum, other) => sum + (other.rotate ?? 0), 0) /
          fronts.length;
    const { floor, cornerX } = CAKE_TOPS[shape.id];
    const x = (onWall.get(index) ?? moveToShape(anchor, layoutShape, shape.id))
      .x;
    const around = Math.min(
      1,
      Math.max(0, (x - cornerX) / (floor[floor.length - 1].x - cornerX)),
    );
    return front + (rotate - front) * around;
  };

  cake.decorations.forEach((chosen, index) => {
    const item = decorations.find((decoration) => decoration.id === chosen.id);
    // 자리를 직접 적어 둔 장식은 놓을 자리가 없다는 판정과 상관없이 그린다.
    const pinned = layoutShape === shape.id ? undefined : chosen.at?.[shape.id];
    if (!item || (noRoom.has(index) && !pinned)) return;

    const hasPosition = chosen.x !== undefined && chosen.y !== undefined;
    // 윗면의 장식은 자리를 모은 만큼 크기도 줄인다. 자리만 모으면 장식끼리 겹치고 글자를 가린다.
    const carried =
      hasPosition &&
      layoutShape !== shape.id &&
      item.placement === "top" &&
      !onRing.has(index) &&
      onTop(
        CAKE_TOPS[layoutShape],
        anchorOf(chosen, item.height, item.anchor === "bottom"),
      );
    const resize = carried ? gather : resizeForShape(layoutShape, shape.id);
    // 장식의 크기는 모양이 바뀌어도 그대로 둔다. 자리만 모은다. 윗면을 거의 덮는 큰 장식만 줄인다.
    const scale =
      pinned?.scale ?? (chosen.scale ?? 1) * (wide.has(index) ? wideShrink : 1);
    // 위치를 직접 준 장식은 같은 것을 여러 번 놓을 수 있다. 위치가 없는 장식은 한 번만 놓는다.
    if (!hasPosition) {
      if (seen.has(item.id)) return;
      seen.add(item.id);
    }
    const key = `${item.id}-${index}`;
    const turn = {
      rotate: wallTurn(index, chosen.rotate) || undefined,
      flip: chosen.flip || undefined,
    };
    // 그림의 가운데가 (x, y)에 오게 놓는다.
    const around = (
      width: number,
      height: number,
      standing = false,
    ): CakeBox => {
      const anchor = anchorOf(chosen, height, standing);
      const ringed = onRing.get(index);
      const support =
        layoutShape === shape.id || ringed
          ? undefined
          : supportOf(placed, anchor);
      const lead = ringed || support ? undefined : setLead.get(index);
      const fixedAt =
        layoutShape === shape.id ? undefined : chosen.at?.[shape.id];
      let spot: CakeSpot;
      if (fixedAt) {
        // 이 모양에서의 자리를 직접 적어 둔 장식은 그 자리에 놓는다.
        spot = anchorOf({ ...chosen, ...fixedAt }, height, standing);
      } else if (ringed) {
        spot = ringed;
      } else if (lead) {
        const moved = onTop(CAKE_TOPS[layoutShape], lead.anchor)
          ? carry(lead.anchor)
          : moveToShape(lead.anchor, layoutShape, shape.id);
        const seat =
          onRing.get(lead.index) ??
          (sitsOnTop(CAKE_TOPS[layoutShape], lead.anchor, lead.width)
            ? settleOnTop(CAKE_TOPS[shape.id], moved, lead.width * gather)
            : moved);
        spot = {
          // 줄어든 큰 장식에 딸린 장식은 그만큼 가까이 붙인다.
          x:
            seat.x +
            (anchor.x - lead.anchor.x) *
              resize *
              (wide.has(lead.index) ? wideShrink : 1),
          y:
            seat.y +
            (anchor.y - lead.anchor.y) *
              resize *
              (wide.has(lead.index) ? wideShrink : 1),
        };
        // 세트로 옮긴 작은 장식이 윗면 밖으로 나가면 윗면 안으로 들인다.
        if (
          width * scale <= TUCK_MAX &&
          onTop(CAKE_TOPS[layoutShape], anchor)
        ) {
          spot = settleOnTop(CAKE_TOPS[shape.id], spot, width * scale);
        }
      } else if (support) {
        spot = {
          x: support.spot.x + (anchor.x - support.anchor.x) * resize,
          y: support.spot.y + (anchor.y - support.anchor.y) * resize,
        };
      } else {
        const sat =
          layoutShape !== shape.id &&
          sitsOnTop(
            CAKE_TOPS[layoutShape],
            anchor,
            width * (chosen.scale ?? 1),
          );
        const moved =
          layoutShape !== shape.id && onTop(CAKE_TOPS[layoutShape], anchor)
            ? carry(anchor)
            : (onWall.get(index) ?? moveToShape(anchor, layoutShape, shape.id));
        // 윗면에 놓여 있던 장식은 새 모양에서도 윗면 밖으로 나가지 않게 한다.
        const wasOnTop =
          layoutShape !== shape.id &&
          width * scale <= TUCK_MAX &&
          onTop(CAKE_TOPS[layoutShape], anchor);
        spot =
          sat || wasOnTop
            ? settleOnTop(CAKE_TOPS[shape.id], moved, width * scale)
            : moved;
        const perched = perchedOn.some(
          (perch) =>
            Math.hypot(perch.x - anchor.x, perch.y - anchor.y) <= PERCHED,
        );
        if (sat && perched) {
          // 크림 위에 얹혀 있던 장식은 새로 둘러 놓인 크림 가운데 가장 가까운 것 위에 얹는다. 크림 하나에는 하나만 얹는다.
          const nearest = perches.reduce(
            (best, perch, order) => {
              // 크림은 묶음과 함께 움직이지 않으므로, 테두리를 따라 옮긴 자리에서 가까운 크림을 찾는다.
              const along = moveToShape(anchor, layoutShape, shape.id);
              const distance = Math.hypot(perch.x - along.x, perch.y - along.y);
              return distance < best.distance ? { distance, order } : best;
            },
            { distance: PERCH_REACH, order: -1 },
          );
          if (nearest.order >= 0) {
            [spot] = perches.splice(nearest.order, 1);
          }
        } else if (!sat && layoutShape !== shape.id) {
          // 옆면의 장식이 케이크 윤곽 밖으로 걸치지 않게 한다.
          const { floor } = CAKE_TOPS[shape.id];
          const half = (width * scale * FOOTPRINT) / 2;
          const inWall =
            anchor.y >= frontEdge(CAKE_TOPS[layoutShape], anchor.x) &&
            !onTop(CAKE_TOPS[layoutShape], anchor);
          if (inWall) {
            const x = Math.min(
              floor[floor.length - 1].x - half,
              Math.max(floor[0].x + half, spot.x),
            );
            // 윗면과 옆면이 만나는 테두리나 바닥에 걸치지 않게 한다.
            const tall = (height * scale) / 2;
            const rim = frontEdge(CAKE_TOPS[shape.id], x) + tall + RIM_CLEAR;
            const bottom = floorAt(floor, x) - tall;
            spot = {
              x,
              y:
                rim > bottom
                  ? (rim + bottom) / 2
                  : Math.min(bottom, Math.max(rim, spot.y)),
            };
          }
        }
      }
      // 작은 장식이 글자를 가리게 되면 글자 밖으로 비켜 놓는다. 원래 모양에서도 글자 위에 얹혀 있던 것은 그대로 둔다.
      if (
        words &&
        !fixedAt &&
        item.placement === "top" &&
        Math.max(width, height) * scale <= TUCK_MAX
      ) {
        // 장식의 절반쯤이 글자에 걸치면 가린 것으로 본다.
        const reachX = (width * scale * WORDS_COVER) / 2;
        const reachY = (height * scale * WORDS_COVER) / 2;
        const over = (box: CakeBox, at: CakeSpot) => ({
          x:
            (box.width * WORDS_CORE) / 2 +
            reachX -
            Math.abs(at.x - (box.left + box.width / 2)),
          y:
            (box.height * WORDS_CORE) / 2 +
            reachY -
            Math.abs(at.y - (box.top + box.height / 2)),
        });
        const was = words.before && over(words.before, anchor);
        const now = over(words.now, spot);
        if (now.x > 0 && now.y > 0 && !(was && was.x > 0 && was.y > 0)) {
          const middle = {
            x: words.now.left + words.now.width / 2,
            y: words.now.top + words.now.height / 2,
          };
          spot =
            now.x < now.y
              ? {
                  x: spot.x + Math.sign(spot.x - middle.x || 1) * now.x,
                  y: spot.y,
                }
              : {
                  x: spot.x,
                  y: spot.y + Math.sign(spot.y - middle.y || 1) * now.y,
                };
        }
      }
      if (item.placement === "top") {
        placed.push({
          anchor,
          center: { x: chosen.x ?? 0, y: chosen.y ?? 0 },
          width: width * (chosen.scale ?? 1),
          height: height * (chosen.scale ?? 1),
          spot,
        });
      }
      return {
        left: spot.x - (width * scale) / 2,
        top: spot.y - (height * scale) / (standing ? 1 : 2),
        width: width * scale,
        height: height * scale,
      };
    };

    if (item.placement === "fixed") {
      // 같은 층에는 먼저 고른 것 하나만 놓는다. 코팅 두 가지를 한꺼번에 얹을 수는 없다.
      if (fixed.has(item.layer)) return;
      const part = item.shapes[shape.id];
      if (part) {
        // 직접 준 위치는 원래 모양의 그림에 맞춘 것이다. 모양이 바뀌면 새 그림의 정해진 자리를 쓴다.
        const box =
          hasPosition && layoutShape === shape.id
            ? around(part.width, part.height)
            : part;
        fixed.set(item.layer, [{ key, src: part.src, ...turn, ...box }]);
        sequence.push(null);
        return;
      }
      const ring = item.rings?.[shape.id];
      if (ring) {
        fixed.set(
          item.layer,
          ringOf(ring, CAKE_TOPS[shape.id], decorations).map((box, order) => ({
            key: `${key}-${order}`,
            ...box,
          })),
        );
        sequence.push(null);
        return;
      }
      // 케이크 모양을 따라 그린 장식은 다른 모양에 얹을 수 없다. 글자만 다른 모양의 그림을 빌려 쓴다.
      if (item.layer !== "lettering") return;
      const borrowed = borrow(
        item.shapes,
        layoutShape,
        shape.id,
        carry,
        gather * onWide(item.shapes[layoutShape]),
      );
      if (!borrowed) return;
      fixed.set(item.layer, [{ key, ...turn, ...borrowed }]);
      sequence.push(null);
      return;
    }

    const chain = hasPosition ? chains.get(item.id) : undefined;
    if (chain) {
      // 바닥을 따라 두른 장식은 처음 나온 자리에서 한 줄을 통째로 다시 두른다. 뒤쪽 것부터 그린다.
      if (lined.has(item.id)) return;
      lined.add(item.id);
      const shrink = shrinkForWall(layoutShape, shape.id);
      const width = item.width * (chosen.scale ?? 1) * shrink;
      const height = item.height * (chosen.scale ?? 1) * shrink;
      const line = lineFloor(chain, layoutShape, shape.id, shrink)
        .sort((a, b) => a.y - b.y)
        .map((spot, order) => ({
          key: `${key}-${order}`,
          src: item.src,
          ...turn,
          left: spot.x - width / 2,
          top: spot.y - height / (item.anchor === "bottom" ? 1 : 2),
          width,
          height,
        }));
      floorLine.push(...line);
      return;
    }

    if (hasPosition) {
      const layer = {
        key,
        src: item.src,
        ...turn,
        ...around(item.width, item.height, item.anchor === "bottom"),
      };
      // 아래에 깔도록 적어 둔 장식은 다른 윗면 장식들보다 먼저 그린다. 코팅 같은 자리가 정해진 장식보다는 위다.
      const first = sequence.findIndex((entry) => entry !== null);
      if (pinned?.under && first >= 0) {
        sequence.splice(first, 0, layer);
      } else if (pinned?.over) {
        onTopOfAll.push(layer);
      } else {
        sequence.push(layer);
      }
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

  // 한 층에 그림이 여러 장일 수 있다(낱개 장식을 두른 경우). 층 단위로 차례를 채운다.
  const fixedInOrder = CAKE_LAYERS.flatMap((layer) => {
    const layers = fixed.get(layer);
    return layers ? [layers] : [];
  });
  const ordered = sequence.flatMap(
    (layer) => layer ?? fixedInOrder.shift() ?? [],
  );

  // 직접 놓은 장식은 놓은 순서대로 맨 위에 그린다. 놓은 모양에서는 놓은 자리 그대로, 다른 모양에서는 같은 자리로 옮겨 그린다.
  const placedByHand = config.decorations.flatMap((chosen, index) => {
    const item = stickerOf(
      decorations.find((one) => one.id === chosen.id),
      shape.id,
    );
    if (!item || !byHand(chosen)) return [];
    const standing = item.anchor === "bottom";
    const pinned = layoutShape === shape.id ? undefined : chosen.at?.[shape.id];
    const spot = pinned
      ? anchorOf({ ...chosen, ...pinned }, item.height, standing)
      : moveToShape(
          anchorOf(chosen, item.height, standing),
          layoutShape,
          shape.id,
        );
    const width = item.width * (chosen.scale ?? 1);
    const height = item.height * (chosen.scale ?? 1);
    return [
      {
        key: `${chosen.id}-manual-${index}`,
        index,
        src: item.src,
        rotate: chosen.rotate || undefined,
        flip: chosen.flip || undefined,
        left: spot.x - width / 2,
        top: spot.y - height / (standing ? 1 : 2),
        width,
        height,
      },
    ];
  });

  return [
    base,
    ...ordered,
    ...onTopOfAll,
    ...floorLine,
    ...inSpots.map(({ spotY: _spotY, ...layer }) => layer),
    ...placedByHand,
  ];
}

// 직접 놓은 낱개 장식이면 그 장식의 정보를, 아니면 undefined를 돌려준다. 예시에 처음부터 있던 장식은 고칠 수 없다.
function handPlaced(
  cake: CakeConfig,
  index: number,
  decorations: CakeDecoration[],
) {
  const chosen = cake.decorations[index];
  const item = stickerOf(
    decorations.find((one) => one.id === chosen?.id),
    cake.shape,
  );
  if (!chosen?.manual || !item) return undefined;
  if (chosen.x === undefined || chosen.y === undefined) return undefined;
  return { chosen, item };
}

export interface DecorationChange {
  // 지금 모양의 케이크에서 장식 그림의 가운데가 놓일 자리.
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
}

// 직접 놓은 장식의 자리, 크기, 기울기를 고친 새 구성을 돌려준다.
// 자리는 지금 모양에서의 것을 받아, 장식의 위치를 잡은 모양 기준으로 되돌려 저장한다.
export function adjustDecoration(
  cake: CakeConfig,
  index: number,
  change: DecorationChange,
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): CakeConfig {
  const found = handPlaced(cake, index, decorations);
  if (!found) return cake;
  const { chosen, item } = found;
  const layoutShape = cake.layoutShape ?? cake.shape;
  const next = {
    ...chosen,
    scale: change.scale ?? chosen.scale,
    rotate: change.rotate ?? chosen.rotate,
  };
  if (change.x !== undefined && change.y !== undefined) {
    const spot = { x: change.x, y: change.y };
    // 세워 두는 장식은 밑동을 기준으로 옮긴다.
    const lift =
      item.anchor === "bottom" ? (item.height * (next.scale ?? 1)) / 2 : 0;
    const moved = moveToShape(
      { x: spot.x, y: spot.y + lift },
      cake.shape,
      layoutShape,
    );
    next.x = moved.x;
    next.y = moved.y - lift;
    // 다른 모양에서 적어 둔 자리는 이제 맞지 않으므로 지운다.
    next.at = layoutShape === cake.shape ? undefined : { [cake.shape]: spot };
  }
  return {
    ...cake,
    layoutShape,
    decorations: cake.decorations.map((one, order) =>
      order === index ? next : one,
    ),
  };
}

// 직접 놓은 장식을 뺀 새 구성을 돌려준다.
export function removeDecoration(
  cake: CakeConfig,
  index: number,
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): CakeConfig {
  if (!handPlaced(cake, index, decorations)) return cake;
  return {
    ...cake,
    decorations: cake.decorations.filter((_, order) => order !== index),
  };
}

// 장식 묶음을 한꺼번에 놓은 새 구성을 돌려준다. 자리는 지금 모양의 케이크에서의 것이다.
// 같은 자리에 먼저 놓아 둔 장식이 있으면 그것과 바꾼다. 그대로 겹치면 색만 다른 묶음을 이어 눌렀을 때
// 아래에 깔린 장식이 테두리처럼 비친다.
export function placeSet(
  cake: CakeConfig,
  parts: {
    id: string;
    x: number;
    y: number;
    scale?: number;
    rotate?: number;
  }[],
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): CakeConfig {
  const layoutShape = cake.layoutShape ?? cake.shape;
  const taken = (chosen: CakeConfig["decorations"][number]) => {
    if (!chosen.manual) return false;
    const spot = layoutShape === cake.shape ? chosen : chosen.at?.[cake.shape];
    return parts.some(
      (part) =>
        spot?.x !== undefined &&
        spot.y !== undefined &&
        Math.hypot(part.x - spot.x, part.y - spot.y) < 1,
    );
  };
  const cleared = {
    ...cake,
    decorations: cake.decorations.filter((chosen) => !taken(chosen)),
  };
  return parts.reduce(
    (next, part) => placeAt(next, part, decorations),
    cleared,
  );
}

// 새로 놓는 장식의 자리. 케이크 왼쪽의 빈 곳에, 바탕 그림에서 이만큼 띄워 놓는다.
const NEW_GAP = 24;
const NEW_Y = 362;

// 예시 케이크에 처음부터 얹혀 있던 장식이 차지한 층. 그 장식은 바꾸거나 뺄 수 없어, 같은 층의 장식을 새로 얹을 수 없다.
export function heldLayers(
  cake: Pick<CakeConfig, "decorations">,
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): Set<CakeLayerId> {
  return new Set(
    cake.decorations.flatMap((chosen) => {
      const item = decorations.find((one) => one.id === chosen.id);
      return item?.placement === "fixed" && !chosen.manual ? [item.layer] : [];
    }),
  );
}

// 낱개 장식 하나를 지금 모양의 케이크에서 주어진 자리(그림의 가운데)에 놓은 새 구성을 돌려준다.
// 좌표는 장식의 위치를 잡은 모양 기준으로 되돌려 저장하고, 지금 모양이 그와 다르면 지금 모양에서의 자리를 함께 적어
// 놓은 자리에서 움직이지 않게 한다.
export function placeAt(
  cake: CakeConfig,
  placed: { id: string; x: number; y: number; scale?: number; rotate?: number },
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
): CakeConfig {
  const item = stickerOf(
    decorations.find((one) => one.id === placed.id),
    cake.shape,
  );
  if (!item) return cake;
  const layoutShape = cake.layoutShape ?? cake.shape;
  const spot = { x: placed.x, y: placed.y };
  // 세워 두는 장식은 밑동을 기준으로 옮긴다.
  const lift =
    item.anchor === "bottom" ? (item.height * (placed.scale ?? 1)) / 2 : 0;
  const moved = moveToShape(
    { x: spot.x, y: spot.y + lift },
    cake.shape,
    layoutShape,
  );
  return {
    ...cake,
    layoutShape,
    decorations: [
      ...cake.decorations,
      {
        ...placed,
        x: moved.x,
        y: moved.y - lift,
        manual: true,
        ...(layoutShape === cake.shape ? {} : { at: { [cake.shape]: spot } }),
      },
    ],
  };
}

// 수정 화면의 목록에서 고른 장식을 케이크에 더한 새 구성을 돌려준다. 받은 구성은 고치지 않는다.
// 낱개 장식은 케이크 옆의 빈 곳에, 글자는 윗면에 놓는다.
// 케이크 모양을 따라 그린 장식은 한 층에 하나만 얹을 수 있어 같은 층의 것과 바꾸고, 이미 얹혀 있으면 뺀다.
// 예시에 처음부터 있던 장식은 건드리지 않는다.
export function placeDecoration(
  cake: CakeConfig,
  id: string,
  decorations: CakeDecoration[] = CAKE_DECORATIONS,
  // 낱개 장식을 놓을 때의 배율.
  scale = 1,
): CakeConfig {
  const item = decorations.find((one) => one.id === id);
  const layoutShape = cake.layoutShape ?? cake.shape;
  if (!item) return cake;

  // 글자는 케이크 옆이 아니라 윗면에 놓는다. 그 모양에서의 자리가 정해진 글자는 그 자리에, 아니면 윗면 가운데에 놓는다.
  if (item.category === "lettering") {
    const part =
      item.placement === "fixed" ? item.shapes[cake.shape] : undefined;
    const spot = part
      ? { x: part.left + part.width / 2, y: part.top + part.height / 2 }
      : CAKE_TOPS[cake.shape].center;
    return placeAt(cake, { id, ...spot }, decorations);
  }

  if (item.placement === "fixed") {
    if (!item.shapes[cake.shape]) return cake;
    if (heldLayers(cake, decorations).has(item.layer)) return cake;
    const rest = cake.decorations.filter((chosen) => {
      const other = decorations.find((one) => one.id === chosen.id);
      return !(other?.placement === "fixed" && other.layer === item.layer);
    });
    const worn = cake.decorations.some((chosen) => chosen.id === id);
    return {
      ...cake,
      layoutShape,
      decorations: worn ? rest : [...rest, { id, manual: true }],
    };
  }

  const shape = pick(CAKE_SHAPES, cake.shape, DEFAULT_CAKE.shape);
  const left = (CAKE_BOARD.width - shape.width) / 2 + shape.offsetX;
  return placeAt(
    cake,
    {
      id,
      x: left - NEW_GAP - (item.width * scale) / 2,
      y: NEW_Y,
      ...(scale === 1 ? {} : { scale }),
    },
    decorations,
  );
}
