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

// 주소에는 좌표와 기울기를 정수로 줄여 담는다.
const rounded = (cake: SharedCake["cake"]): SharedCake["cake"] => ({
  ...cake,
  decorations: cake.decorations.map((item) =>
    item.x === undefined || item.only || item.at
      ? item
      : {
          ...item,
          x: Math.round(item.x),
          y: Math.round(item.y ?? 0),
          ...(item.rotate === undefined
            ? {}
            : { rotate: Math.round(item.rotate) }),
        },
  ),
});

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

    expect(await decodeSharedCake(`#${hash}`)).toEqual({
      ...edited,
      cake: rounded(edited.cake),
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

  it("장식을 손대지 않은 예시는 모양을 바꿔도 예시 id만 담고, 되돌리면 같은 케이크다", async () => {
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
  });

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

    expect(decoded?.cake.decorations).toEqual(rounded(shared.cake).decorations);
  });
});
