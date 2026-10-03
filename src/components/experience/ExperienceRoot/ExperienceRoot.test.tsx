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

    await screen.findByRole("button", { name: "선택하기" });
    expect(useExperienceStore.getState().step).toBe("relation");
  }, 15000);

  it("직접 디자인을 고르면 결과 수정 단계로 간다", async () => {
    render(<ExperienceRoot />);

    await walkToQuestion("여기는 뭐하는 곳이에요?");
    await click("내가 바로 직접 디자인 해볼래");

    await screen.findByRole("heading", { name: STEP_LABELS.editor });
    expect(useExperienceStore.getState().step).toBe("editor");
  }, 15000);

  it("관계 화면에서 선택하기를 누르면 고른 관계를 저장하고 다음 단계로 간다", async () => {
    useExperienceStore.setState({ step: "relation" });
    render(<ExperienceRoot />);

    await click("다음 카드");
    await click("선택하기");

    await screen.findByRole("button", { name: "Trendsetter 폴더" });
    expect(useExperienceStore.getState().relation).toBe("family");
  });

  it("스타일 화면에서 선택하기를 누르면 고른 스타일을 저장하고 다음 단계로 간다", async () => {
    useExperienceStore.setState({ step: "style" });
    render(<ExperienceRoot />);

    await click("Minimalist 폴더");
    await click("선택하기");

    await screen.findByRole("button", { name: "생일/기념일 카드 보기" }, WAIT);
    expect(useExperienceStore.getState().style).toBe("minimalist");
  });

  it("파티 화면에서 선택하기를 누르면 고른 테마를 저장하고 다음 단계로 간다", async () => {
    useExperienceStore.setState({ step: "party" });
    render(<ExperienceRoot />);

    await click("다음 카드");
    await click("선택하기");

    await screen.findByRole(
      "button",
      { name: "너무 단 건 극혐! 덜 달아야 해" },
      WAIT,
    );
    expect(useExperienceStore.getState().party).toBe("event");
  });

  it("맛 화면에서 선택하기를 누르면 고른 조건을 저장하고 다음 단계로 간다", async () => {
    useExperienceStore.setState({ step: "flavor" });
    render(<ExperienceRoot />);

    await click("너무 단 건 극혐! 덜 달아야 해");
    await click("선택하기");

    await screen.findByRole("heading", { name: STEP_LABELS.analysis }, WAIT);
    expect(useExperienceStore.getState().flavor).toBe("sweet");
  });

  it("임시 화면에서는 다음 버튼만 눌러 마지막 단계까지 이동한다", async () => {
    useExperienceStore.setState({ step: "analysis" });
    render(<ExperienceRoot />);

    for (const step of STEPS.slice(5, -1)) {
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
