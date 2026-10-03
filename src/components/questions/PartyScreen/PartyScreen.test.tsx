import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { PartyScreen } from "./PartyScreen";

const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));
const dot = (label: string) =>
  screen.getByRole("button", { name: `${label} 카드 보기` });
const current = (label: string) => dot(label).getAttribute("aria-current");

describe("PartyScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "party" });
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("화살표로 테마를 넘기고, 끝에서는 반대쪽 끝으로 이어진다", () => {
    render(<PartyScreen />);
    expect(current("생일/기념일")).toBe("true");
    expect(screen.getByRole("status").textContent).toContain("생일/기념일");

    click("다음 카드");
    expect(current("이벤트/촬영")).toBe("true");
    expect(screen.getByRole("status").textContent).toContain("이벤트/촬영");

    click("이전 카드");
    click("이전 카드");
    expect(current("웨딩/약혼")).toBe("true");
  });

  it("점을 눌러 그 테마로 바로 간다", () => {
    render(<PartyScreen />);

    fireEvent.click(dot("일상"));
    expect(current("일상")).toBe("true");
  });

  it("선택하기를 누르면 테마를 저장하고, 색종이를 보여 준 뒤 다음 단계로 간다", () => {
    render(<PartyScreen />);
    click("다음 카드");
    click("다음 카드");
    expect(useExperienceStore.getState().party).toBeNull();

    click("선택하기");
    expect(useExperienceStore.getState().party).toBe("comfort");
    expect(useExperienceStore.getState().step).toBe("party");

    // 확정한 뒤에는 테마를 바꿀 수 없다.
    click("다음 카드");
    expect(current("위로/응원")).toBe("true");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(useExperienceStore.getState().step).toBe("flavor");
  });

  it("앞서 고른 테마가 있으면 그 카드를 보여 준 채로 시작한다", () => {
    useExperienceStore.setState({ party: "daily" });
    render(<PartyScreen />);

    expect(current("일상")).toBe("true");
  });
});
