import { describe, expect, it } from "vitest";
import {
  FIRST_STEP,
  furthestQuestionStep,
  nextStep,
  prevStep,
  STEPS,
  type Step,
} from "./steps";

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

describe("문답 단계 사이 이동 범위", () => {
  const none = { relation: null, style: null, party: null, flavor: null };

  it("아무것도 답하지 않았으면 첫 단계까지만 갈 수 있다", () => {
    expect(furthestQuestionStep(none)).toBe("relation");
  });

  it("답하지 않은 첫 단계까지 갈 수 있다", () => {
    expect(
      furthestQuestionStep({
        ...none,
        relation: "friend",
        style: "minimalist",
      }),
    ).toBe("party");
  });

  it("앞 단계를 보류했다면 뒤 단계에 답이 있어도 그 단계까지만 갈 수 있다", () => {
    expect(
      furthestQuestionStep({ ...none, relation: "friend", party: "birthday" }),
    ).toBe("style");
  });

  it("네 단계에 모두 답했으면 마지막 단계까지 갈 수 있다", () => {
    expect(
      furthestQuestionStep({
        relation: "friend",
        style: "minimalist",
        party: "birthday",
        flavor: "sweet",
      }),
    ).toBe("flavor");
  });
});
