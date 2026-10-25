import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { PARTY_KEYWORDS } from "@/data/result";
import { SAVE_CHOICE, SHARE_BROKEN_TEXT } from "@/data/share";
import { encodeSharedCake } from "@/lib/share";
import { SharedCakeView } from "./SharedCakeView";

describe("SharedCakeView", () => {
  afterEach(() => {
    cleanup();
    window.location.hash = "";
  });

  it("주소에 담긴 케이크와 키워드, 날짜와 순번을 보여 주고 저장 버튼을 둔다", async () => {
    window.location.hash = await encodeSharedCake({
      cake: CAKE_PRESETS[0].cake,
      answers: { party: "wedding", style: null, relation: null, flavor: null },
      date: "2026.10.25",
      orderNumber: 7,
    });
    const { container } = render(<SharedCakeView />);

    expect(await screen.findByText(PARTY_KEYWORDS.wedding)).toBeTruthy();
    expect(screen.getByText("2026.10.25")).toBeTruthy();
    expect(screen.getByText("(007)")).toBeTruthy();
    expect(screen.getByRole("button", { name: SAVE_CHOICE })).toBeTruthy();
    expect(
      container.querySelector('img[src*="/assets/cake-parts/"]'),
    ).not.toBeNull();
  });

  it("망가진 주소로 들어오면 다시 찍어 달라고 안내하고 저장 버튼은 두지 않는다", async () => {
    window.location.hash = "#c=broken";
    render(<SharedCakeView />);

    expect(
      await screen.findByText(SHARE_BROKEN_TEXT, {
        normalizer: (text) => text,
      }),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: SAVE_CHOICE })).toBeNull();
  });
});
