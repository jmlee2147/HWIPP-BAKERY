import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playTalk } from "@/lib/sound";
import { TypedText } from "./TypedText";

vi.mock("@/lib/sound", () => ({ playTalk: vi.fn() }));

const typed = () => screen.getByTestId("typed-text").textContent;

describe("TypedText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(playTalk).mockClear();
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

  it("말소리는 글자마다 내지 않고 사이를 띄운다", () => {
    // 휴대폰과 키오스크는 소리를 자주 내면 재생이 밀려 말소리가 버벅인다.
    render(<TypedText text="가나다라마바사아자차" intervalMs={50} sound />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(typed()).toBe("가나다라마바사아자차");
    expect(vi.mocked(playTalk).mock.calls.length).toBeLessThanOrEqual(4);
    expect(vi.mocked(playTalk)).toHaveBeenCalled();
  });

  it("한 번에 다 보여 줄 때는 말소리를 내지 않는다", () => {
    render(<TypedText text="가나다라마" intervalMs={50} sound instant />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(vi.mocked(playTalk)).not.toHaveBeenCalled();
  });
});
