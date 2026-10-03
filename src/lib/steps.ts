export const STEPS = [
  "opening",
  "relation",
  "style",
  "party",
  "flavor",
  "analysis",
  "result",
  "editor",
  "share",
] as const;

export type Step = (typeof STEPS)[number];

export const FIRST_STEP: Step = STEPS[0];

export const STEP_LABELS: Record<Step, string> = {
  opening: "오프닝",
  relation: "수신인과의 관계",
  style: "수신인 스타일 및 성격",
  party: "파티 스타일",
  flavor: "맛 선택",
  analysis: "분석 및 로딩",
  result: "결과",
  editor: "결과 수정",
  share: "소장 및 공유",
};

export function nextStep(step: Step): Step {
  return STEPS[Math.min(STEPS.indexOf(step) + 1, STEPS.length - 1)];
}

export function prevStep(step: Step): Step {
  return STEPS[Math.max(STEPS.indexOf(step) - 1, 0)];
}
