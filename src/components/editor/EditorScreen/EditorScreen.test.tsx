import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CAKE_COLORS,
  CAKE_SHAPES,
  CAKE_SIZES,
  cakeBaseImage,
} from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import {
  CATEGORY_HOLD_MS,
  CONTROL_LABELS,
  DECORATION_CATEGORIES,
  DECORATION_SCALE,
  DECORATION_SETS,
  EDITOR_PACK_CHOICE,
  LETTERING_CATEGORIES,
  LIST_CLOSE_LABEL,
  SHAPE_ICONS,
} from "@/data/editor";
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
      "레터링",
      "장식",
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
      "레터링",
      "장식",
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

const control = (name: string) => screen.getByRole("button", { name });

describe("EditorScreen 장식 탭", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "editor" });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const openList = (category: string) => {
    click("tab", "장식");
    click("button", category);
    act(() => {
      vi.advanceTimersByTime(CATEGORY_HOLD_MS);
    });
  };

  it("장식 탭에는 분류 타일이 나온다", () => {
    render(<EditorScreen />);

    click("tab", "장식");

    for (const category of DECORATION_CATEGORIES)
      expect(tile(category.label)).toBeTruthy();
  });

  it("분류를 누르면 고른 상태가 된 뒤 그 분류의 장식 목록으로 바뀐다", () => {
    render(<EditorScreen />);
    click("tab", "장식");

    click("button", "CANDLE");
    expect(tile("CANDLE").getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByRole("button", { name: "candle-pink" })).toBeNull();

    act(() => {
      vi.advanceTimersByTime(CATEGORY_HOLD_MS);
    });
    expect(tile("candle-pink")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "flower-rose" })).toBeNull();
    expect(screen.queryByRole("button", { name: "CANDLE" })).toBeNull();
  });

  it("닫기를 누르면 분류 타일로 돌아가고 고른 분류가 풀린다", () => {
    render(<EditorScreen />);
    openList("FLOWER");

    click("button", LIST_CLOSE_LABEL);

    expect(tile("FLOWER").getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByRole("button", { name: "flower-rose" })).toBeNull();
  });

  it("다른 탭에 다녀오면 분류 타일부터 다시 보인다", () => {
    render(<EditorScreen />);
    openList("FLOWER");

    click("tab", "크기");
    click("tab", "장식");

    expect(tile("FLOWER").getAttribute("aria-pressed")).toBe("false");
  });

  it("목록에서 장식을 누르면 케이크에 더해진다", () => {
    render(<EditorScreen />);
    openList("CANDLE");

    click("button", "candle-pink");
    click("button", "candle-pink");

    expect(storedCake()?.decorations).toMatchObject([
      { id: "candle-pink", manual: true },
      { id: "candle-pink", manual: true },
    ]);
  });

  it("케이크 모양을 따라 그린 장식은 지금 모양의 그림이 있는 것만 목록에 나온다", () => {
    useExperienceStore.setState({
      cake: { size: "large", shape: "square", color: "white", decorations: [] },
    });
    render(<EditorScreen />);
    openList("RIBBON");

    const wrap = tile("ribbon-wrap").querySelector("img");
    expect(wrap?.getAttribute("src")).toContain("ribbon-wrap-square");
  });

  it("예시에 처음부터 있던 장식이 차지한 자리의 장식은 목록에 나오지 않는다", () => {
    useExperienceStore.setState({
      cake: {
        size: "large",
        shape: "round",
        color: "white",
        decorations: [{ id: "ribbon-wrap" }],
      },
    });
    render(<EditorScreen />);
    openList("RIBBON");

    expect(screen.queryByRole("button", { name: "ribbon-wrap" })).toBeNull();
    expect(tile("ribbon-garland")).toBeTruthy();
  });

  const drag = (
    target: HTMLElement,
    from: { x: number; y: number },
    to: { x: number; y: number },
  ) => {
    fireEvent.pointerDown(target, {
      pointerId: 1,
      clientX: from.x,
      clientY: from.y,
    });
    fireEvent.pointerMove(target, {
      pointerId: 1,
      clientX: to.x,
      clientY: to.y,
    });
    fireEvent.pointerUp(target, { pointerId: 1, clientX: to.x, clientY: to.y });
  };

  it("장식을 더하면 그 장식에 조절 상자가 생긴다", () => {
    render(<EditorScreen />);
    openList("CANDLE");

    click("button", "candle-pink");

    expect(control(CONTROL_LABELS.move).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(control(CONTROL_LABELS.remove)).toBeTruthy();
    expect(control(CONTROL_LABELS.scale)).toBeTruthy();
    expect(control(CONTROL_LABELS.rotate)).toBeTruthy();
  });

  it("빈 곳을 누르면 조절 상자가 사라지고, 장식을 누르면 다시 생긴다", () => {
    render(<EditorScreen />);
    openList("CANDLE");
    click("button", "candle-pink");

    click("button", CONTROL_LABELS.release);
    expect(
      screen.queryByRole("button", { name: CONTROL_LABELS.remove }),
    ).toBeNull();

    fireEvent.pointerDown(control(CONTROL_LABELS.move), { pointerId: 1 });
    expect(control(CONTROL_LABELS.remove)).toBeTruthy();
  });

  it("다른 장식을 누르면 조절 상자가 그 장식으로 옮겨 간다", () => {
    render(<EditorScreen />);
    openList("CANDLE");
    click("button", "candle-pink");
    click("button", "candle-mint");

    const bodies = () =>
      screen.getAllByRole("button", { name: CONTROL_LABELS.move });
    expect(bodies().map((body) => body.getAttribute("aria-pressed"))).toEqual([
      "false",
      "true",
    ]);

    fireEvent.pointerDown(bodies()[0], { pointerId: 1 });

    expect(bodies().map((body) => body.getAttribute("aria-pressed"))).toEqual([
      "true",
      "false",
    ]);
  });

  it("상자 안쪽을 끌면 장식이 그만큼 옮겨져 저장된다", () => {
    render(<EditorScreen />);
    openList("CANDLE");
    click("button", "candle-pink");
    const before = storedCake()?.decorations[0];

    drag(control(CONTROL_LABELS.move), { x: 300, y: 500 }, { x: 367, y: 433 });

    // 케이크 창에서 케이크는 0.67배로 그려지므로, 화면의 67px은 케이크의 100px이다.
    const after = storedCake()?.decorations[0];
    expect(after?.x).toBeCloseTo((before?.x ?? 0) + 100);
    expect(after?.y).toBeCloseTo((before?.y ?? 0) - 100);
  });

  it("크기 손잡이를 끌면 배율이 저장되고 한도를 넘지 않는다", () => {
    render(<EditorScreen />);
    openList("OTHERS");
    click("button", "star-pink");
    const body = control(CONTROL_LABELS.move).parentElement;
    const center = /translate\(([\d.-]+)px, ([\d.-]+)px\)/.exec(
      body?.style.transform ?? "",
    );
    const middle = {
      x: Number(center?.[1]) + Number.parseFloat(body?.style.width ?? "0") / 2,
      y: Number(center?.[2]) + Number.parseFloat(body?.style.height ?? "0") / 2,
    };

    drag(
      control(CONTROL_LABELS.scale),
      { x: middle.x + 50, y: middle.y },
      { x: middle.x + 75, y: middle.y },
    );
    expect(storedCake()?.decorations[0].scale).toBeCloseTo(1.5);

    drag(
      control(CONTROL_LABELS.scale),
      { x: middle.x + 10, y: middle.y },
      { x: middle.x + 900, y: middle.y },
    );
    expect(storedCake()?.decorations[0].scale).toBe(DECORATION_SCALE.max);

    drag(
      control(CONTROL_LABELS.scale),
      { x: middle.x + 500, y: middle.y },
      { x: middle.x + 2, y: middle.y },
    );
    expect(storedCake()?.decorations[0].scale).toBe(DECORATION_SCALE.min);
  });

  it("기울기 손잡이를 끌면 돌린 각도가 저장된다", () => {
    render(<EditorScreen />);
    openList("OTHERS");
    click("button", "star-pink");
    const body = control(CONTROL_LABELS.move).parentElement;
    const center = /translate\(([\d.-]+)px, ([\d.-]+)px\)/.exec(
      body?.style.transform ?? "",
    );
    const middle = {
      x: Number(center?.[1]) + Number.parseFloat(body?.style.width ?? "0") / 2,
      y: Number(center?.[2]) + Number.parseFloat(body?.style.height ?? "0") / 2,
    };

    drag(
      control(CONTROL_LABELS.rotate),
      { x: middle.x + 60, y: middle.y },
      { x: middle.x, y: middle.y + 60 },
    );

    expect(storedCake()?.decorations[0].rotate).toBeCloseTo(90);
  });

  it("삭제 손잡이를 누르면 그 장식만 빠진다", () => {
    render(<EditorScreen />);
    openList("CANDLE");
    click("button", "candle-pink");
    click("button", "candle-mint");

    click("button", CONTROL_LABELS.remove);

    expect(storedCake()?.decorations.map((item) => item.id)).toEqual([
      "candle-pink",
    ]);
    expect(
      screen.queryByRole("button", { name: CONTROL_LABELS.remove }),
    ).toBeNull();
  });

  it("예시에 처음부터 있던 장식에는 조절 상자가 생기지 않는다", () => {
    useExperienceStore.setState({ cake: CAKE_PRESETS[0].cake });
    render(<EditorScreen />);

    click("tab", "장식");

    expect(
      screen.queryByRole("button", { name: CONTROL_LABELS.move }),
    ).toBeNull();
  });

  it("목록에는 분류에 정해 둔 장식만 정해 둔 순서로 나온다", () => {
    render(<EditorScreen />);
    openList("RIBBON");

    const listed = screen
      .getAllByRole("listitem")
      .map((item) => item.querySelector("button")?.getAttribute("aria-label"));
    expect(listed).toEqual(
      DECORATION_CATEGORIES.find((item) => item.id === "ribbon")?.items,
    );
    expect(
      screen.queryByRole("button", { name: "ribbon-bow-wide" }),
    ).toBeNull();
  });

  it("물방울 묶음을 누르면 지금 모양의 배치대로 한꺼번에 놓이고 조절 상자는 생기지 않는다", () => {
    useExperienceStore.setState({
      cake: { size: "large", shape: "heart", color: "white", decorations: [] },
    });
    render(<EditorScreen />);
    openList("OTHERS");

    click("button", "drops-white");

    const parts = DECORATION_SETS["drops-white"].parts.heart;
    expect(storedCake()?.decorations).toMatchObject(
      parts.map((part) => ({ ...part, manual: true })),
    );
    expect(
      screen.getAllByRole("button", { name: CONTROL_LABELS.move }),
    ).toHaveLength(parts.length);
    expect(
      screen.queryByRole("button", { name: CONTROL_LABELS.remove }),
    ).toBeNull();
  });

  it("작은 케이크에서도 끈 만큼 장식이 손가락을 따라 옮겨진다", () => {
    useExperienceStore.setState({
      cake: { size: "mini", shape: "round", color: "white", decorations: [] },
    });
    render(<EditorScreen />);
    openList("OTHERS");
    click("button", "star-pink");
    const before = storedCake()?.decorations[0];

    drag(
      control(CONTROL_LABELS.move),
      { x: 300, y: 500 },
      { x: 340.2, y: 500 },
    );

    // 미니 케이크는 0.67 x 0.6배로 그려지므로, 화면의 40.2px은 케이크의 100px이다.
    const after = storedCake()?.decorations[0];
    expect(after?.x).toBeCloseTo((before?.x ?? 0) + 100);
    expect(after?.y).toBeCloseTo(before?.y ?? 0);
  });
});

describe("EditorScreen 레터링 탭", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "editor" });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const openList = (category: string | RegExp) => {
    click("tab", "레터링");
    click("button", category);
    act(() => {
      vi.advanceTimersByTime(CATEGORY_HOLD_MS);
    });
  };
  const listed = () =>
    screen
      .getAllByRole("listitem")
      .map((item) => item.querySelector("button")?.getAttribute("aria-label"));

  it("레터링 탭에는 분류 타일이 나오고, 분류를 누르면 정해 둔 글자 목록이 나온다", () => {
    render(<EditorScreen />);
    click("tab", "레터링");
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(
      LETTERING_CATEGORIES.length,
    );

    click("button", "LOVE");
    act(() => {
      vi.advanceTimersByTime(CATEGORY_HOLD_MS);
    });

    expect(listed()).toEqual(
      LETTERING_CATEGORIES.find((item) => item.id === "love")?.items,
    );
  });

  it("레터링 탭과 장식 탭을 오가면 분류 타일부터 다시 보인다", () => {
    render(<EditorScreen />);
    openList("BIRTHDAY");

    click("tab", "장식");

    expect(tile("CANDLE").getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByRole("button", { name: "BIRTHDAY" })).toBeNull();
  });

  it("글자를 누르면 케이크 윗면에 놓이고 조절 상자가 생긴다", () => {
    render(<EditorScreen />);
    openList("THANKS");

    click("button", "lettering-thankyou");

    const placed = storedCake()?.decorations[0];
    expect(placed).toMatchObject({ id: "lettering-thankyou", manual: true });
    // 원형 케이크에서 이 글자의 정해진 자리다.
    expect(placed?.x).toBeCloseTo(137.2 + 356.5 / 2);
    expect(placed?.y).toBeCloseTo(225.9 + 233.4 / 2);
    expect(control(CONTROL_LABELS.move).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(control(CONTROL_LABELS.remove)).toBeTruthy();
  });

  it("예시에 글자가 있는 케이크에도 글자를 더 놓고, 놓은 글자만 지울 수 있다", () => {
    const preset = CAKE_PRESETS.find(({ cake }) =>
      cake.decorations.some((item) => item.id === "lettering-hbd-pink"),
    );
    if (!preset) throw new Error("글자가 있는 예시가 없다");
    useExperienceStore.setState({ cake: preset.cake });
    render(<EditorScreen />);
    openList(/JAPANESE/);

    click("button", "lettering-ouen-pink");
    expect(
      screen.getAllByRole("button", { name: CONTROL_LABELS.move }),
    ).toHaveLength(1);

    click("button", CONTROL_LABELS.remove);

    expect(storedCake()?.decorations).toEqual(preset.cake.decorations);
  });
});
