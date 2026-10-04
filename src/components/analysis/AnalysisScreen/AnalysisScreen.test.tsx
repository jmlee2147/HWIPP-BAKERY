import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONFIRM_CHOICE } from "@/data/analysis";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { AnalysisScreen } from "./AnalysisScreen";

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("AnalysisScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "analysis" });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("버튼을 누르기 전에는 시간이 지나도 다음 단계로 가지 않는다", () => {
    render(<AnalysisScreen loadingMs={2000} />);

    advance(10000);

    expect(screen.getByRole("button", { name: CONFIRM_CHOICE })).toBeTruthy();
    expect(useExperienceStore.getState().step).toBe("analysis");
  });

  it("버튼을 누르면 로딩 장면으로 넘어가 진행률이 0%부터 오른다", () => {
    render(<AnalysisScreen loadingMs={2000} />);

    fireEvent.click(screen.getByRole("button", { name: CONFIRM_CHOICE }));
    expect(screen.getByText("0%")).toBeTruthy();

    advance(1000);
    expect(screen.getByText("75%")).toBeTruthy();
    expect(useExperienceStore.getState().step).toBe("analysis");
  });

  it("로딩 장면에서는 아무것도 누르지 않아도 100%를 채우고 결과 단계로 간다", () => {
    render(<AnalysisScreen initialScene="loading" loadingMs={2000} />);

    advance(2000);
    expect(screen.getByText("100%")).toBeTruthy();
    expect(useExperienceStore.getState().step).toBe("analysis");

    advance(1000);
    expect(useExperienceStore.getState().step).toBe("result");
  });
});
