import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CAKE } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { useExperienceStore } from "./useExperienceStore";

describe("useExperienceStore", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
  });

  it("오프닝에서 시작한다", () => {
    expect(useExperienceStore.getState().step).toBe("opening");
  });

  it("다음과 이전으로 단계를 오간다", () => {
    const { goNext, goPrev } = useExperienceStore.getState();
    goNext();
    goNext();
    expect(useExperienceStore.getState().step).toBe("style");
    goPrev();
    expect(useExperienceStore.getState().step).toBe("relation");
  });

  it("처음으로 돌아가면 오프닝이 된다", () => {
    const { goNext, reset } = useExperienceStore.getState();
    goNext();
    goNext();
    reset();
    expect(useExperienceStore.getState().step).toBe("opening");
  });

  it("지정한 단계로 바로 이동한다", () => {
    useExperienceStore.getState().goTo("editor");
    expect(useExperienceStore.getState().step).toBe("editor");
  });

  it("고른 관계, 스타일, 파티 테마를 저장하고, 처음으로 돌아가면 지운다", () => {
    const { setRelation, setStyle, setParty, reset } =
      useExperienceStore.getState();
    setRelation("friend");
    setStyle("cute-collector");
    setParty("wedding");
    useExperienceStore.getState().setFlavor("fruit");
    expect(useExperienceStore.getState().party).toBe("wedding");
    expect(useExperienceStore.getState().flavor).toBe("fruit");
    expect(useExperienceStore.getState().relation).toBe("friend");
    expect(useExperienceStore.getState().style).toBe("cute-collector");
    reset();
    expect(useExperienceStore.getState().relation).toBeNull();
    expect(useExperienceStore.getState().style).toBeNull();
    expect(useExperienceStore.getState().party).toBeNull();
    expect(useExperienceStore.getState().flavor).toBeNull();
  });

  it("만든 케이크 구성을 저장하고, 처음으로 돌아가면 지운다", () => {
    const cake = {
      size: "mini" as const,
      shape: "heart" as const,
      color: "pink" as const,
      decorations: [{ id: "candle-pink" }],
    };
    expect(useExperienceStore.getState().cake).toBeNull();
    useExperienceStore.getState().setCake(cake);
    expect(useExperienceStore.getState().cake).toEqual(cake);
    useExperienceStore.getState().reset();
    expect(useExperienceStore.getState().cake).toBeNull();
  });

  it("케이크의 크기, 모양, 색상 중 준 것만 바꾸고 장식은 그대로 둔다", () => {
    const { setCake, updateCake } = useExperienceStore.getState();
    setCake({
      size: "large",
      shape: "round",
      color: "white",
      decorations: [{ id: "candle-pink" }],
    });

    updateCake({ shape: "heart" });
    updateCake({ color: "choco" });

    expect(useExperienceStore.getState().cake).toEqual({
      size: "large",
      shape: "heart",
      color: "choco",
      decorations: [{ id: "candle-pink" }],
      layoutShape: "round",
    });
  });

  it("모양을 여러 번 바꿔도 장식의 위치를 잡은 처음 모양을 기억한다", () => {
    const { setCake, updateCake } = useExperienceStore.getState();
    setCake({
      size: "large",
      shape: "square",
      color: "white",
      decorations: [{ id: "star-pink", x: 100, y: 200 }],
    });

    updateCake({ shape: "heart" });
    updateCake({ shape: "round" });

    expect(useExperienceStore.getState().cake).toMatchObject({
      shape: "round",
      layoutShape: "square",
      decorations: [{ id: "star-pink", x: 100, y: 200 }],
    });
  });

  it("케이크가 없을 때 고치면 기본 케이크에서 시작하고, 기본 케이크는 바뀌지 않는다", () => {
    const before = structuredClone(DEFAULT_CAKE);

    useExperienceStore.getState().updateCake({ size: "mini" });

    expect(useExperienceStore.getState().cake).toEqual({
      ...before,
      size: "mini",
      layoutShape: before.shape,
    });
    expect(DEFAULT_CAKE).toEqual(before);
  });

  it("예시 케이크를 고쳐도 예시의 원본은 바뀌지 않는다", () => {
    const preset = CAKE_PRESETS[0];
    const before = structuredClone(preset.cake);
    const { setCake, updateCake } = useExperienceStore.getState();
    setCake(preset.cake);

    updateCake({ size: "mini", shape: "heart", color: "pink" });

    expect(preset.cake).toEqual(before);
    expect(useExperienceStore.getState().cake).not.toBe(preset.cake);
  });

  it("장식을 더해도 예시의 원본은 바뀌지 않는다", () => {
    const preset = CAKE_PRESETS[0];
    const before = structuredClone(preset.cake);
    const { setCake, addDecoration } = useExperienceStore.getState();
    setCake(preset.cake);

    addDecoration("candle-pink");

    expect(preset.cake).toEqual(before);
    const cake = useExperienceStore.getState().cake;
    expect(cake?.decorations).toHaveLength(before.decorations.length + 1);
    expect(cake?.decorations.at(-1)).toMatchObject({
      id: "candle-pink",
      manual: true,
    });
    expect(cake?.layoutShape).toBe(before.shape);
  });

  it("케이크가 없을 때 장식을 더하면 기본 케이크에서 시작한다", () => {
    useExperienceStore.getState().addDecoration("star-pink");

    expect(useExperienceStore.getState().cake).toMatchObject({
      shape: DEFAULT_CAKE.shape,
      decorations: [{ id: "star-pink", manual: true }],
    });
    expect(DEFAULT_CAKE.decorations).toEqual([]);
  });

  it("기본 크기가 큰 하늘색 공은 다른 공과 같은 크기로 줄여 놓는다", () => {
    const { addDecoration } = useExperienceStore.getState();

    addDecoration("cream-ball-sky");
    addDecoration("cream-ball-pink");

    const [sky, pink] = useExperienceStore.getState().cake?.decorations ?? [];
    expect(sky.scale).toBeLessThan(0.5);
    expect(pink.scale).toBeUndefined();
  });
});
