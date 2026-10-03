import { describe, expect, it } from "vitest";
import { FIRST_STEP, nextStep, prevStep, STEPS, type Step } from "./steps";

describe("단계 이동", () => {
  it("다음 단계는 순서대로 이어진다", () => {
    expect(nextStep("opening")).toBe("relation");
    expect(nextStep("flavor")).toBe("analysis");
  });

  it("마지막 단계에서 다음으로 가도 마지막에 머문다", () => {
    expect(nextStep("share")).toBe("share");
  });

  it("첫 단계에서 이전으로 가도 처음에 머문다", () => {
    expect(prevStep("opening")).toBe("opening");
  });

  it("처음부터 다음만 눌러 마지막 단계에 도달한다", () => {
    let step: Step = FIRST_STEP;
    for (let i = 0; i < STEPS.length - 1; i++) step = nextStep(step);
    expect(step).toBe("share");
  });
});
