import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIdleReset } from "./useIdleReset";

describe("useIdleReset", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("입력 없이 제한 시간이 지나면 onIdle을 부른다", () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleReset(1000, onIdle, true));

    vi.advanceTimersByTime(999);
    expect(onIdle).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it("입력이 있으면 시간을 다시 센다", () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleReset(1000, onIdle, true));

    vi.advanceTimersByTime(900);
    window.dispatchEvent(new Event("pointerdown"));
    vi.advanceTimersByTime(900);
    expect(onIdle).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it("꺼져 있으면 onIdle을 부르지 않는다", () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleReset(1000, onIdle, false));

    vi.advanceTimersByTime(5000);
    expect(onIdle).not.toHaveBeenCalled();
  });

  it("unmount 뒤에는 onIdle을 부르지 않는다", () => {
    const onIdle = vi.fn();
    const { unmount } = renderHook(() => useIdleReset(1000, onIdle, true));

    unmount();
    vi.advanceTimersByTime(5000);
    expect(onIdle).not.toHaveBeenCalled();
  });
});
