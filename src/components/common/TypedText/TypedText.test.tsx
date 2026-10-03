import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypedText } from "./TypedText";

const visibleText = (container: HTMLElement) =>
  container.querySelector("span[aria-hidden]:not(.invisible)")?.textContent;

describe("TypedText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("정해진 간격마다 한 글자씩 드러낸다", () => {
    const { container } = render(<TypedText text="케이크" intervalMs={100} />);

    expect(visibleText(container)).toBe("");
    act(() => vi.advanceTimersByTime(100));
    expect(visibleText(container)).toBe("케");
    act(() => vi.advanceTimersByTime(100));
    expect(visibleText(container)).toBe("케이");
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
    const { container } = render(
      <TypedText text="케이크" instant onDone={onDone} />,
    );

    expect(visibleText(container)).toBe("케이크");
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
