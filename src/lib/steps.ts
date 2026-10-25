export const STEPS = [
  "opening",
  "relation",
  "style",
  "party",
  "flavor",
  "analysis",
  "result",
  // 결과 화면에서 메뉴판 버튼으로만 들어간다. 결과 화면에서 다음 단계로 넘기는 곳은 없다.
  "menu",
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
  menu: "메뉴판",
  editor: "결과 수정",
  share: "소장 및 공유",
};

export function nextStep(step: Step): Step {
  return STEPS[Math.min(STEPS.indexOf(step) + 1, STEPS.length - 1)];
}

export function prevStep(step: Step): Step {
  return STEPS[Math.max(STEPS.indexOf(step) - 1, 0)];
}

// 문답 네 단계. 이 단계들 사이에서는 진행 바로 오갈 수 있다.
export const QUESTION_STEPS = ["relation", "style", "party", "flavor"] as const;

export type QuestionStep = (typeof QUESTION_STEPS)[number];

// 진행 바로 갈 수 있는 가장 뒤 단계. 아직 답하지 않은 첫 단계까지 갈 수 있다.
// 예: 1, 2단계에 답하고 3단계를 보류했다면 1~3단계를 오갈 수 있고 4단계로는 갈 수 없다.
export function furthestQuestionStep(
  answers: Record<QuestionStep, unknown>,
): QuestionStep {
  return (
    QUESTION_STEPS.find((step) => answers[step] == null) ??
    QUESTION_STEPS[QUESTION_STEPS.length - 1]
  );
}
