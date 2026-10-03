import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { RelationScreen } from "./RelationScreen";

const card = (label: string) =>
  screen.getByRole("button", { name: `${label} 카드` });
const dot = (label: string) =>
  screen.getByRole("button", { name: `${label} 카드 보기` });
const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));

describe("RelationScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "relation" });
  });

  afterEach(() => {
    cleanup();
  });

  it("화살표로 카드를 넘기고, 끝에서는 반대쪽 끝으로 이어진다", () => {
    render(<RelationScreen />);
    expect(dot("연인").getAttribute("aria-current")).toBe("true");

    click("다음 카드");
    expect(dot("가족").getAttribute("aria-current")).toBe("true");

    click("이전 카드");
    click("이전 카드");
    expect(dot("최애").getAttribute("aria-current")).toBe("true");
  });

  it("점이나 옆 카드를 눌러 그 카드로 바로 간다", () => {
    render(<RelationScreen />);

    fireEvent.click(dot("동료"));
    expect(dot("동료").getAttribute("aria-current")).toBe("true");

    fireEvent.click(card("친구"));
    expect(dot("친구").getAttribute("aria-current")).toBe("true");
    expect(card("친구").getAttribute("aria-pressed")).toBe("false");
  });

  it("가운데 카드를 누르면 뒤집히고, 다른 카드로 넘어가면 앞면으로 돌아온다", () => {
    render(<RelationScreen />);

    fireEvent.click(card("연인"));
    expect(card("연인").getAttribute("aria-pressed")).toBe("true");
    expect(card("연인").getAttribute("aria-description")).toBe("사랑하는 연인");
    expect(useExperienceStore.getState().step).toBe("relation");

    click("다음 카드");
    expect(card("가족").getAttribute("aria-pressed")).toBe("false");
  });

  it("앞서 고른 관계가 있으면 그 카드를 가운데에 둔 채 시작한다", () => {
    useExperienceStore.setState({ relation: "colleague" });
    render(<RelationScreen />);

    expect(dot("동료").getAttribute("aria-current")).toBe("true");
  });

  it("선택하기를 눌러야 고른 관계가 저장되고 다음 단계로 간다", () => {
    render(<RelationScreen />);

    click("다음 카드");
    click("다음 카드");
    expect(useExperienceStore.getState().relation).toBeNull();

    click("선택하기");
    expect(useExperienceStore.getState().relation).toBe("friend");
    expect(useExperienceStore.getState().step).toBe("style");
  });
});
