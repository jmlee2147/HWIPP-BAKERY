import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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
  });

  afterEach(() => {
    cleanup();
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

  it("스타일 이름을 누르면 한 줄 요약 창이 뜨고, 요약을 누르거나 스타일을 바꾸면 닫힌다", () => {
    render(<StyleScreen />);
    expect(screen.queryByText(STYLES[0].summary)).toBeNull();

    click("Trendsetter");
    expect(screen.getByText(STYLES[0].summary)).toBeTruthy();

    click(STYLES[0].summary);
    expect(screen.queryByText(STYLES[0].summary)).toBeNull();

    click("Trendsetter");
    click("Minimalist 폴더");
    expect(screen.queryByText(STYLES[0].summary)).toBeNull();
    expect(screen.queryByText(STYLES[3].summary)).toBeNull();
  });

  it("선택하기를 눌러야 고른 스타일이 저장되고 다음 단계로 간다", () => {
    render(<StyleScreen />);

    click("Aesthetic Curator 폴더");
    expect(useExperienceStore.getState().style).toBeNull();

    click("선택하기");
    expect(useExperienceStore.getState().style).toBe("aesthetic-curator");
    expect(useExperienceStore.getState().step).toBe("party");
  });

  it("앞서 고른 스타일이 있으면 그 폴더를 연 채로 시작한다", () => {
    useExperienceStore.setState({ style: "minimalist" });
    render(<StyleScreen />);

    expect(pressed("Minimalist 폴더")).toBe("true");
  });
});
