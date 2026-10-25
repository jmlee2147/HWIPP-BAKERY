import { describe, expect, it } from "vitest";
import { CAKE_PRESETS } from "@/data/cakePresets";
import {
  decodeSharedCake,
  encodeSharedCake,
  type SharedCake,
  shareUrl,
} from "./share";

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
  it("케이크와 답변을 담았다가 그대로 되돌린다", async () => {
    const hash = await encodeSharedCake(shared);

    expect(await decodeSharedCake(`#${hash}`)).toEqual(shared);
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
