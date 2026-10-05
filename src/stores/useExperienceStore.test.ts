import { beforeEach, describe, expect, it } from "vitest";
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
});
