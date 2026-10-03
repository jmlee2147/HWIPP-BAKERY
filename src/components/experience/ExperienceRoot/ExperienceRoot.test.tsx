import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it } from "vitest";
import { STEP_LABELS, STEPS } from "@/lib/steps";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { ExperienceRoot } from "./ExperienceRoot";

describe("ExperienceRoot", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
  });

  afterEach(() => {
    cleanup();
  });

  it("다음 버튼만 눌러 첫 단계부터 마지막 단계까지 이동한다", async () => {
    render(<ExperienceRoot />);

    for (const step of STEPS.slice(0, -1)) {
      await screen.findByRole("heading", { name: STEP_LABELS[step] });
      fireEvent.click(screen.getByRole("button", { name: "다음" }));
    }

    await screen.findByRole("heading", { name: STEP_LABELS.share });
  });

  it("마지막 단계에서 처음으로를 누르면 오프닝으로 돌아간다", async () => {
    useExperienceStore.setState({ step: "share" });
    render(<ExperienceRoot />);

    fireEvent.click(await screen.findByRole("button", { name: "처음으로" }));

    await screen.findByRole("heading", { name: STEP_LABELS.opening });
  });
});
