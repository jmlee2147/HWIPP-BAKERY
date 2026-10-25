import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CAKE_PRESETS } from "@/data/cakePresets";
import {
  FLAVOR_KEYWORDS,
  PARTY_KEYWORDS,
  RELATION_KEYWORDS,
  RESULT_CHOICES,
  RESULT_FLAVOR_SUFFIX,
  STYLE_KEYWORDS,
} from "@/data/result";
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

  it("메뉴판 버튼을 누르면 메뉴판으로 간다", () => {
    render(<ResultScreen />);

    click(RESULT_CHOICES.menu);

    expect(useExperienceStore.getState().step).toBe("menu");
  });

  it("답변마다 키워드를 하나씩 붙이고, 맛 키워드 뒤에 완성 문구를 단다", () => {
    useExperienceStore.setState({
      party: "event",
      style: "trendsetter",
      relation: "friend",
      flavor: "sweet",
    });
    render(<ResultScreen />);

    expect(screen.getByText(PARTY_KEYWORDS.event)).toBeTruthy();
    expect(screen.getByText(STYLE_KEYWORDS.trendsetter)).toBeTruthy();
    expect(screen.getByText(RELATION_KEYWORDS.friend)).toBeTruthy();
    expect(
      screen.getByText(`${FLAVOR_KEYWORDS.sweet}${RESULT_FLAVOR_SUFFIX}`),
    ).toBeTruthy();
  });

  it("답하지 않은 문답의 키워드는 붙이지 않는다", () => {
    useExperienceStore.setState({ party: "birthday" });
    render(<ResultScreen />);

    expect(screen.getByText(PARTY_KEYWORDS.birthday)).toBeTruthy();
    expect(
      screen.queryByText(RESULT_FLAVOR_SUFFIX, { exact: false }),
    ).toBeNull();
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
