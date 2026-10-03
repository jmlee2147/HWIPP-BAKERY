import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STYLES } from "@/data/styles";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { StyleScreen } from "./StyleScreen";

const button = (name: string) => screen.getByRole("button", { name });
const click = (name: string) => fireEvent.click(button(name));
const pressed = (name: string) => button(name).getAttribute("aria-pressed");

describe("StyleScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "style" });
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("첫 폴더가 열린 채로 시작하고, 다른 폴더를 누르면 그 스타일 창으로 바뀐다", () => {
    render(<StyleScreen />);
    expect(pressed("Trendsetter 폴더")).toBe("true");
    expect(screen.getByText(`"${STYLES[0].quotes[0][0]}"`)).toBeTruthy();

    click("Cute Collector 폴더");
    expect(pressed("Cute Collector 폴더")).toBe("true");
    expect(pressed("Trendsetter 폴더")).toBe("false");
    expect(screen.getByText(STYLES[2].description)).toBeTruthy();
    expect(screen.getByText(`"${STYLES[2].quotes[0][0]}"`)).toBeTruthy();
    expect(screen.getByText(STYLES[2].traits[0])).toBeTruthy();
  });

  it("창 안의 즐겨찾기로도 스타일을 바꿀 수 있다", () => {
    render(<StyleScreen />);

    click("Subculture Digger 즐겨찾기");
    expect(pressed("Subculture Digger 폴더")).toBe("true");
    expect(pressed("Subculture Digger 즐겨찾기")).toBe("true");
  });

  it("한 줄 요약 창은 스타일 창이 뜰 때 한 번 보였다가 사라진다", () => {
    render(<StyleScreen />);
    expect(screen.getByText(STYLES[0].summary)).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText(STYLES[0].summary)).toBeNull();

    click("Minimalist 폴더");
    expect(screen.getByText(STYLES[3].summary)).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText(STYLES[3].summary)).toBeNull();
  });

  it("스타일 이름을 누르면 요약 창이 다시 뜨고, 요약을 누르면 닫힌다", () => {
    render(<StyleScreen />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    click("Trendsetter");
    expect(screen.getByText(STYLES[0].summary)).toBeTruthy();

    click(STYLES[0].summary);
    expect(screen.queryByText(STYLES[0].summary)).toBeNull();
  });

  it("선택하기를 누르면 스타일을 저장하고, 요약 창을 한 번 더 보여 준 뒤 다음 단계로 간다", () => {
    render(<StyleScreen />);
    click("Aesthetic Curator 폴더");
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(useExperienceStore.getState().style).toBeNull();

    click("선택하기");
    expect(useExperienceStore.getState().style).toBe("aesthetic-curator");
    expect(screen.getByText(STYLES[1].summary)).toBeTruthy();
    expect(useExperienceStore.getState().step).toBe("style");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(useExperienceStore.getState().step).toBe("party");
  });

  it("앞서 고른 스타일이 있으면 그 폴더를 연 채로 시작한다", () => {
    useExperienceStore.setState({ style: "minimalist" });
    render(<StyleScreen />);

    expect(pressed("Minimalist 폴더")).toBe("true");
  });
});
