import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { STEP_LABELS, STEPS } from "@/lib/steps";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { ExperienceRoot } from "./ExperienceRoot";

const WAIT = { timeout: 4000 };

const click = async (name: string) =>
  fireEvent.click(await screen.findByRole("button", { name }, WAIT));

// 장면이 바뀐 뒤에 누른다. 글자가 나오는 중에 누르면 글자를 마저 보여 주고, 한 번 더 눌러야 넘어간다.
const advanceFrom = async (line: RegExp) => {
  await screen.findAllByText(line, undefined, WAIT);
  await click("다음");
  await click("다음");
};

const walkToQuestion = async (answer: string) => {
  await click("START!");
  await click("가게에 들어가기");
  await click(answer);
  await advanceFrom(/아하! 저희는/);
  await advanceFrom(/두 사람의 이야기와/);
  await screen.findAllByText(/자, 그럼 바로/, undefined, WAIT);
};

describe("ExperienceRoot", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
  });

  afterEach(() => {
    cleanup();
  });

  it("오프닝을 순서대로 지나 선물 상대를 고르면 관계 단계로 간다", async () => {
    render(<ExperienceRoot />);

    await walkToQuestion("아니요. 예약 안 했어요.");
    await click("좋아! 내가 선물하고 싶은 상대는 ...");

    await screen.findByRole("heading", { name: STEP_LABELS.relation });
  }, 15000);

  it("직접 디자인을 고르면 결과 수정 단계로 간다", async () => {
    render(<ExperienceRoot />);

    await walkToQuestion("여기는 뭐하는 곳이에요?");
    await click("내가 바로 직접 디자인 해볼래");

    await screen.findByRole("heading", { name: STEP_LABELS.editor });
    expect(useExperienceStore.getState().step).toBe("editor");
  }, 15000);

  it("문답 첫 단계부터 다음 버튼만 눌러 마지막 단계까지 이동한다", async () => {
    useExperienceStore.setState({ step: "relation" });
    render(<ExperienceRoot />);

    for (const step of STEPS.slice(1, -1)) {
      await screen.findByRole("heading", { name: STEP_LABELS[step] });
      await click("다음");
    }

    await screen.findByRole("heading", { name: STEP_LABELS.share });
  });

  it("마지막 단계에서 처음으로를 누르면 오프닝으로 돌아간다", async () => {
    useExperienceStore.setState({ step: "share" });
    render(<ExperienceRoot />);

    await click("처음으로");

    await screen.findByRole("button", { name: "START!" });
  });
});
