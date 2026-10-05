import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CAKE_COLORS,
  CAKE_SHAPES,
  CAKE_SIZES,
  cakeBaseImage,
} from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { EDITOR_PACK_CHOICE, SHAPE_ICONS } from "@/data/editor";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { EditorScreen } from "./EditorScreen";

const click = (role: "button" | "tab", name: string | RegExp) =>
  fireEvent.click(screen.getByRole(role, { name }));

const tile = (name: string | RegExp) => screen.getByRole("button", { name });

const storedCake = () => useExperienceStore.getState().cake;

describe("EditorScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "editor" });
  });

  afterEach(() => {
    cleanup();
  });

  it("내용이 있는 탭만 보여 주고 크기 탭에서 시작한다", () => {
    render(<EditorScreen />);

    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "크기",
      "모양",
      "색상",
    ]);
    expect(
      screen.getByRole("tab", { name: "크기" }).getAttribute("aria-selected"),
    ).toBe("true");
    for (const size of CAKE_SIZES) expect(tile(size.label)).toBeTruthy();
  });

  it("탭을 누르면 그 탭의 선택지로 바뀐다", () => {
    render(<EditorScreen />);

    click("tab", "모양");
    for (const shape of CAKE_SHAPES)
      expect(tile(new RegExp(shape.label))).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: CAKE_SIZES[0].label }),
    ).toBeNull();

    click("tab", "색상");
    for (const color of CAKE_COLORS) expect(tile(color.label)).toBeTruthy();
  });

  it("지금 케이크의 크기, 모양, 색상에 해당하는 타일이 고른 상태로 보인다", () => {
    useExperienceStore.setState({
      cake: { size: "medium", shape: "heart", color: "sky", decorations: [] },
    });
    render(<EditorScreen />);

    expect(tile("SIZE 2 - 12cm").getAttribute("aria-pressed")).toBe("true");
    expect(tile("SIZE 1 - 15cm").getAttribute("aria-pressed")).toBe("false");
    click("tab", "모양");
    expect(tile(/HEART/).getAttribute("aria-pressed")).toBe("true");
    click("tab", "색상");
    expect(tile("SKYBLUE").getAttribute("aria-pressed")).toBe("true");
  });

  it("크기, 모양, 색상을 고르면 저장하고 얹혀 있던 장식은 그대로 둔다", () => {
    const { cake } = CAKE_PRESETS[0];
    useExperienceStore.setState({ cake });
    render(<EditorScreen />);

    click("button", "SIZE 3 - mini");
    click("tab", "모양");
    click("button", /HEART/);
    click("tab", "색상");
    click("button", "PINK");

    expect(storedCake()).toEqual({
      size: "mini",
      shape: "heart",
      color: "pink",
      decorations: cake.decorations,
      layoutShape: cake.shape,
    });
  });

  it("고르면 케이크 창의 케이크가 바로 바뀐다", () => {
    const { container } = render(<EditorScreen />);
    const base = (src: string) => container.querySelector(`img[src="${src}"]`);

    expect(base(cakeBaseImage("round", "white"))).not.toBeNull();

    click("tab", "모양");
    click("button", /SQUARE/);
    click("tab", "색상");
    click("button", "CHOCO");

    expect(base(cakeBaseImage("square", "choco"))).not.toBeNull();
    expect(base(cakeBaseImage("round", "white"))).toBeNull();
  });

  it("모양을 바꿨다가 되돌리면 장식이 원래 자리로 돌아온다", () => {
    useExperienceStore.setState({ cake: CAKE_PRESETS[0].cake });
    const { container } = render(<EditorScreen />);
    const placed = () =>
      [...container.querySelectorAll('img[src*="/assets/cake-parts/"]')].map(
        (image) =>
          `${image.getAttribute("src")} ${image.getAttribute("style")}`,
      );
    const before = placed();
    const original = CAKE_SHAPES.find(
      (shape) => shape.id === CAKE_PRESETS[0].cake.shape,
    );
    const other = CAKE_SHAPES.find((shape) => shape !== original);

    click("tab", "모양");
    click("button", new RegExp(other?.label ?? ""));
    expect(placed()).not.toEqual(before);
    click("button", new RegExp(original?.label ?? ""));

    expect(placed()).toEqual(before);
  });

  it("바꾸면 장식이 빠지는 모양은 선택지에 보여 주지 않는다", () => {
    // 분홍 코팅은 원형과 하트의 그림만 있다.
    useExperienceStore.setState({
      cake: {
        size: "large",
        shape: "heart",
        color: "sky",
        decorations: [{ id: "coating-pink" }],
      },
    });
    render(<EditorScreen />);

    click("tab", "모양");

    expect(tile(/CIRCLE/)).toBeTruthy();
    expect(tile(/HEART/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /SQUARE/ })).toBeNull();
  });

  it("고를 모양이 지금 모양뿐이면 모양 탭을 보여 주지 않는다", () => {
    // 프로스팅은 원형의 그림만 있다.
    useExperienceStore.setState({
      cake: {
        size: "large",
        shape: "round",
        color: "white",
        decorations: [{ id: "frosting-cream" }],
      },
    });
    render(<EditorScreen />);

    expect(screen.getAllByRole("tab").map((item) => item.textContent)).toEqual([
      "크기",
      "색상",
    ]);
  });

  it("예시 케이크를 고쳐도 예시의 원본은 바뀌지 않는다", () => {
    const preset = CAKE_PRESETS[0];
    const before = structuredClone(preset.cake);
    useExperienceStore.setState({ cake: preset.cake });
    render(<EditorScreen />);

    click("button", "SIZE 3 - mini");

    expect(preset.cake).toEqual(before);
  });

  it("케이크 없이 들어오면 기본 케이크를 보여 주고, 고르면 거기서부터 고친다", () => {
    render(<EditorScreen />);

    expect(tile("SIZE 1 - 15cm").getAttribute("aria-pressed")).toBe("true");
    expect(storedCake()).toBeNull();

    click("tab", "색상");
    click("button", "YELLOW");

    expect(storedCake()).toEqual({
      size: "large",
      shape: "round",
      color: "yellow",
      decorations: [],
      layoutShape: "round",
    });
  });

  it("크기 타일의 그림이 지금 모양을 따라간다", () => {
    useExperienceStore.setState({
      cake: { size: "large", shape: "heart", color: "white", decorations: [] },
    });
    render(<EditorScreen />);

    for (const size of CAKE_SIZES) {
      expect(
        tile(size.label).querySelector(`img[src="${SHAPE_ICONS.heart.src}"]`),
      ).not.toBeNull();
    }
  });

  it("포장하기를 누르면 소장 및 공유 단계로 간다", () => {
    render(<EditorScreen />);

    click("button", EDITOR_PACK_CHOICE);

    expect(useExperienceStore.getState().step).toBe("share");
  });
});
