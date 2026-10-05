import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { RESULT_CHOICES } from "@/data/result";
import { formatOrderDate } from "@/lib/order";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { ResultScreen } from "./ResultScreen";

const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));

describe("ResultScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "result" });
  });

  afterEach(() => {
    cleanup();
  });

  it("수정하기를 누르면 결과 수정 단계로 간다", () => {
    render(<ResultScreen />);

    click(RESULT_CHOICES.edit);

    expect(useExperienceStore.getState().step).toBe("editor");
  });

  it("이대로 받기를 누르면 결과 수정을 건너뛰고 소장 및 공유 단계로 간다", () => {
    render(<ResultScreen />);

    click(RESULT_CHOICES.keep);

    expect(useExperienceStore.getState().step).toBe("share");
  });

  it("갈 곳이 없는 메뉴판 버튼은 보여 주지 않는다", () => {
    render(<ResultScreen />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("저장된 케이크의 부품을 그리고 오늘 날짜와 순번을 적는다", () => {
    const { cake } = CAKE_PRESETS[0];
    useExperienceStore.setState({ cake, orderNumber: 42 });
    const { container } = render(<ResultScreen />);

    expect(
      container.querySelector('img[src*="/assets/cake-parts/"]'),
    ).not.toBeNull();
    expect(screen.getByText(formatOrderDate(new Date()))).toBeTruthy();
    expect(screen.getByText("(042)")).toBeTruthy();
  });

  it("케이크와 순번이 없는 채로 들어와도 기본 케이크와 첫 번호를 보여 준다", () => {
    const { container } = render(<ResultScreen />);

    expect(
      container.querySelector('img[src*="/assets/cake-parts/"]'),
    ).not.toBeNull();
    expect(screen.getByText("(001)")).toBeTruthy();
  });
});
