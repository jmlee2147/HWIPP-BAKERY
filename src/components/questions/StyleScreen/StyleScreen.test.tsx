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
// 요약 창은 닫힌 뒤에도 사라지는 모션 동안 화면에 남는다. 열림 여부는 이름 버튼의 상태로 확인한다.
const summaryOpen = (name: string) =>
  button(name).getAttribute("aria-expanded");
// 상태가 바뀐 뒤에야 다음 타이머가 걸리므로, 시간을 한 번에 흘리지 않고 단계마다 나눠 흘린다.
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });
// 말풍선의 뜸과 타이핑, 그리고 요약 창이 뜨기까지의 뜸을 차례로 지나간다.
const finishDialog = () => {
  advance(600);
  advance(4000);
  advance(700);
};

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

  it("창의 화살표로 옆 스타일로 넘어가고, 끝에서는 반대쪽 끝으로 이어진다", () => {
    render(<StyleScreen />);

    click("다음 스타일");
    expect(pressed("Aesthetic Curator 폴더")).toBe("true");

    click("이전 스타일");
    click("이전 스타일");
    expect(pressed("Subculture Digger 폴더")).toBe("true");
  });

  it("창을 왼쪽으로 밀면 다음, 오른쪽으로 밀면 이전 스타일로 넘어간다", () => {
    render(<StyleScreen />);
    const swipe = (from: number, to: number) => {
      const target = screen.getByText("자주 하는 말");
      fireEvent.pointerDown(target, { clientX: from, clientY: 500 });
      fireEvent.pointerUp(target, { clientX: to, clientY: 510 });
    };

    swipe(600, 400);
    expect(pressed("Aesthetic Curator 폴더")).toBe("true");

    swipe(400, 600);
    expect(pressed("Trendsetter 폴더")).toBe("true");

    // 옆으로 조금만 움직인 것은 넘기지 않는다.
    swipe(500, 480);
    expect(pressed("Trendsetter 폴더")).toBe("true");
  });

  it("밀다가 손을 뗀 자리의 버튼은 눌리지 않는다", () => {
    render(<StyleScreen />);
    const thumb = button("Cute Collector 즐겨찾기");

    fireEvent.pointerDown(thumb, { clientX: 600, clientY: 500 });
    fireEvent.pointerUp(thumb, { clientX: 400, clientY: 500 });
    fireEvent.click(button("Cute Collector 즐겨찾기"));

    expect(pressed("Aesthetic Curator 폴더")).toBe("true");
  });

  it("한 줄 요약 창은 화면에 들어온 것만으로는 뜨지 않는다", () => {
    render(<StyleScreen />);
    finishDialog();

    expect(summaryOpen("Trendsetter")).toBe("false");

    advance(3000);
    expect(summaryOpen("Trendsetter")).toBe("false");
  });

  it("폴더를 눌러 스타일을 바꾸는 것만으로는 요약 창이 뜨지 않는다", () => {
    render(<StyleScreen />);
    finishDialog();

    click("Minimalist 폴더");
    expect(summaryOpen("Minimalist")).toBe("false");

    advance(3000);
    expect(summaryOpen("Minimalist")).toBe("false");
  });

  it("스타일 이름을 누르면 요약 창이 다시 뜨고, 요약을 누르면 닫힌다", () => {
    render(<StyleScreen />);
    finishDialog();
    advance(3000);
    expect(summaryOpen("Trendsetter")).toBe("false");

    click("Trendsetter");
    expect(screen.getByText(STYLES[0].summary)).toBeTruthy();
    expect(summaryOpen("Trendsetter")).toBe("true");

    click(STYLES[0].summary);
    expect(summaryOpen("Trendsetter")).toBe("false");
  });

  it("선택하기를 누르면 스타일을 저장하고, 요약 창을 한 번 더 보여 준 뒤 다음 단계로 간다", () => {
    render(<StyleScreen />);
    finishDialog();
    click("Aesthetic Curator 폴더");
    advance(3000);
    expect(useExperienceStore.getState().style).toBeNull();

    click("선택하기");
    expect(useExperienceStore.getState().style).toBe("aesthetic-curator");
    expect(summaryOpen("Aesthetic Curator")).toBe("true");
    expect(useExperienceStore.getState().step).toBe("style");

    advance(2000);
    expect(useExperienceStore.getState().step).toBe("party");
  });

  it("앞서 고른 스타일이 있으면 그 폴더를 연 채로 시작한다", () => {
    useExperienceStore.setState({ style: "minimalist" });
    render(<StyleScreen />);

    expect(pressed("Minimalist 폴더")).toBe("true");
  });
});
