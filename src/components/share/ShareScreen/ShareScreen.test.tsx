import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FLAVOR_KEYWORDS } from "@/data/result";
import {
  BYE_CHOICES,
  BYE_MESSAGE,
  FINAL_CHOICES,
  FINAL_FLAVOR_SUFFIX,
  QR_HOME,
  QR_TIMEOUT_MS,
} from "@/data/share";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { ShareScreen } from "./ShareScreen";

const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));

describe("ShareScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "share", flavor: "sweet" });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("최종 완성 화면은 맛 키워드 뒤에 함께 완성했다는 말을 붙인다", () => {
    render(<ShareScreen />);

    expect(
      screen.getByText(`${FLAVOR_KEYWORDS.sweet}${FINAL_FLAVOR_SUFFIX}`),
    ).toBeTruthy();
  });

  it("QR 다운로드를 누르면 케이크 저장 페이지로 가는 QR 코드를 보여 준다", async () => {
    render(<ShareScreen />);

    click(FINAL_CHOICES.qr);

    await waitFor(() =>
      expect(screen.getByRole("img", { name: /QR 코드/ })).toBeTruthy(),
    );
  });

  it("처음으로를 누르면 끝인사 팝업을 띄우고, 아직 안 간다고 하면 그대로 머문다", () => {
    render(<ShareScreen />);

    click(FINAL_CHOICES.home);
    expect(screen.getByRole("alertdialog", { name: BYE_MESSAGE })).toBeTruthy();

    click(BYE_CHOICES.stay);
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(useExperienceStore.getState().step).toBe("share");
  });

  it("끝인사 팝업에서 네를 고르면 처음 화면으로 돌아간다", () => {
    render(<ShareScreen initialScene="qr" />);

    click(QR_HOME);
    click(BYE_CHOICES.leave);

    expect(useExperienceStore.getState().step).toBe("opening");
  });

  it("QR 화면은 아무것도 누르지 않아도 정해진 시간이 지나면 처음 화면으로 돌아간다", () => {
    vi.useFakeTimers();
    render(<ShareScreen initialScene="qr" />);

    act(() => {
      vi.advanceTimersByTime(QR_TIMEOUT_MS - 1);
    });
    expect(useExperienceStore.getState().step).toBe("share");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(useExperienceStore.getState().step).toBe("opening");
  });

  it("최종 완성 화면에서는 시간이 지나도 스스로 처음으로 돌아가지 않는다", () => {
    vi.useFakeTimers();
    render(<ShareScreen />);

    act(() => {
      vi.advanceTimersByTime(QR_TIMEOUT_MS * 2);
    });

    expect(useExperienceStore.getState().step).toBe("share");
  });
});
