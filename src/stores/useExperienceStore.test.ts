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

  it("고른 관계를 저장하고, 처음으로 돌아가면 지운다", () => {
    const { setRelation, reset } = useExperienceStore.getState();
    setRelation("friend");
    expect(useExperienceStore.getState().relation).toBe("friend");
    reset();
    expect(useExperienceStore.getState().relation).toBeNull();
  });
});
