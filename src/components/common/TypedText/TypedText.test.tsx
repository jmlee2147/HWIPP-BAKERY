import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypedText } from "./TypedText";

const typed = () => screen.getByTestId("typed-text").textContent;

describe("TypedText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("정해진 간격마다 한 글자씩 드러낸다", () => {
    render(<TypedText text="케이크" intervalMs={100} />);

    expect(typed()).toBe("");
    act(() => vi.advanceTimersByTime(100));
    expect(typed()).toBe("케");
    act(() => vi.advanceTimersByTime(100));
    expect(typed()).toBe("케이");
  });

  it("끝까지 드러내면 onDone을 한 번 부른다", () => {
    const onDone = vi.fn();
    render(<TypedText text="케이크" intervalMs={100} onDone={onDone} />);

    for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(100));
    act(() => vi.advanceTimersByTime(1000));

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("instant면 전체를 바로 보여 준다", () => {
    const onDone = vi.fn();
    render(<TypedText text="케이크" instant onDone={onDone} />);

    expect(typed()).toBe("케이크");
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("시작 지연이 지난 뒤에 첫 글자를 드러낸다", () => {
    render(<TypedText text="케이크" intervalMs={100} startDelayMs={500} />);

    act(() => vi.advanceTimersByTime(499));
    expect(typed()).toBe("");
    act(() => vi.advanceTimersByTime(1));
    act(() => vi.advanceTimersByTime(100));
    expect(typed()).toBe("케");
  });
});
