import { describe, expect, it } from "vitest";
import { CAKE_SHAPES } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { cakeLayers } from "@/lib/cake";
import {
  decodeSharedCake,
  encodeSharedCake,
  forCurrentShape,
  type SharedCake,
  shareUrl,
} from "./share";

// 예시 97개를 세 모양으로 모두 그려 보는 테스트는 오래 걸린다.
const HEAVY_MS = 30_000;

// 되살리지 못했을 때 비교할 빈 케이크.
const EMPTY: SharedCake["cake"] = {
  size: "large",
  shape: "round",
  color: "white",
  decorations: [],
};

const shared: SharedCake = {
  cake: CAKE_PRESETS[0].cake,
  answers: {
    party: "event",
    style: "trendsetter",
    relation: "friend",
    flavor: null,
  },
  date: "2026.10.25",
  orderNumber: 42,
};

describe("공유 주소", () => {
  it("장식을 고친 케이크와 답변을 담았다가 되돌린다. 좌표와 기울기는 정수로 반올림된다", async () => {
    // 관람객이 장식을 하나 더 놓아 예시와 달라진 케이크다.
    const edited: SharedCake = {
      ...shared,
      cake: {
        ...shared.cake,
        decorations: [
          ...shared.cake.decorations,
          { id: "pearl", x: 100.4, y: 200.6, scale: 0.3, rotate: 12.7 },
        ],
      },
    };
    const hash = await encodeSharedCake(edited);

    // 예시에서 그대로 가져온 장식은 예시의 값 그대로, 새로 놓은 장식만 정수로 줄어든다.
    expect(await decodeSharedCake(`#${hash}`)).toEqual({
      ...edited,
      cake: {
        ...edited.cake,
        decorations: [
          ...shared.cake.decorations,
          { id: "pearl", x: 100, y: 201, scale: 0.3, rotate: 13 },
        ],
      },
    });
  });

  it("주소에 그대로 쓸 수 있는 글자만 쓴다", async () => {
    const url = await shareUrl("https://example.com", shared);

    expect(url.startsWith("https://example.com/share#c=")).toBe(true);
    expect(url).toMatch(/^[\w:/.#=-]+$/);
  });

  it("가장 복잡한 예시 케이크도 QR 코드에 담을 만큼 짧다", async () => {
    const lengths = await Promise.all(
      CAKE_PRESETS.map(
        async (preset) =>
          (await encodeSharedCake({ ...shared, cake: preset.cake })).length,
      ),
    );

    expect(Math.max(...lengths)).toBeLessThan(1500);
  });

  it(
    "장식을 손대지 않은 예시는 모양을 바꿔도 예시 id만 담고, 되돌리면 같은 케이크다",
    async () => {
      for (const preset of CAKE_PRESETS) {
        for (const shape of CAKE_SHAPES.map((one) => one.id)) {
          const cake = {
            ...preset.cake,
            shape,
            layoutShape: preset.cake.layoutShape ?? preset.cake.shape,
          };
          const hash = await encodeSharedCake({ ...shared, cake });
          expect(hash.length).toBeLessThan(300);
          const back = await decodeSharedCake(`#${hash}`);
          expect(cakeLayers(back?.cake ?? cake)).toEqual(cakeLayers(cake));
        }
      }
    },
    HEAVY_MS,
  );

  it(
    "예시에서 장식을 지우고 옮기고 새로 놓은 케이크도 짧게 담고, 되살리면 같은 모습이다",
    async () => {
      for (const preset of CAKE_PRESETS) {
        const base = preset.cake.decorations;
        for (const shape of CAKE_SHAPES.map((one) => one.id)) {
          // 관람객이 수정 화면에서 한 일: 장식 하나 지우기, 하나 옮기기(정수 좌표), 하나 새로 놓기.
          const movable = base.findIndex(
            (item) => item.x !== undefined && !item.only && !item.at,
          );
          const decorations = base
            .filter((_, index) => index !== 0)
            .map((item, index) =>
              index + 1 === movable
                ? { ...item, x: Math.round((item.x ?? 0) + 10), manual: true }
                : item,
            );
          decorations.push({
            id: "pearl",
            x: 300,
            y: 300,
            scale: 0.4,
            manual: true,
          });
          const cake = {
            ...preset.cake,
            shape,
            layoutShape: preset.cake.layoutShape ?? preset.cake.shape,
            decorations,
          };

          const hash = await encodeSharedCake({ ...shared, cake });
          const back = await decodeSharedCake(`#${hash}`);

          expect(hash.length).toBeLessThan(500);
          expect(cakeLayers(back?.cake ?? EMPTY)).toEqual(cakeLayers(cake));
        }
      }
    },
    HEAVY_MS,
  );

  it("장식을 고친 케이크는 지금 모양에 쓰는 값만 남겨 담아도 모습이 같다", () => {
    for (const preset of CAKE_PRESETS) {
      for (const shape of CAKE_SHAPES.map((one) => one.id)) {
        const cake = {
          ...preset.cake,
          shape,
          layoutShape: preset.cake.layoutShape ?? preset.cake.shape,
        };
        expect(cakeLayers(forCurrentShape(cake))).toEqual(cakeLayers(cake));
      }
    }
  });

  it("잘리거나 손댄 주소는 null을 돌려준다", async () => {
    const hash = await encodeSharedCake(shared);

    expect(await decodeSharedCake("")).toBeNull();
    expect(await decodeSharedCake("#c=abc")).toBeNull();
    expect(await decodeSharedCake(`#${hash.slice(0, -10)}`)).toBeNull();
  });

  it("모르는 장식은 버리고 나머지 케이크는 살린다", async () => {
    const hash = await encodeSharedCake({
      ...shared,
      cake: {
        ...shared.cake,
        decorations: [...shared.cake.decorations, { id: "no-such-part" }],
      },
    });

    const decoded = await decodeSharedCake(hash);

    expect(decoded?.cake.decorations).toEqual(shared.cake.decorations);
  });
});
