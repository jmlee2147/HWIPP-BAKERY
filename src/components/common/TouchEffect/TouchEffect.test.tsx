import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TouchEffect } from "./TouchEffect";

describe("TouchEffect", () => {
  afterEach(() => {
    cleanup();
  });

  it("처음에는 아무것도 그리지 않는다", () => {
    render(<TouchEffect />);

    expect(screen.queryAllByTestId("touch-ripple")).toHaveLength(0);
  });

  it("애니메이션이 끝난 고리는 사라진다", () => {
    render(<TouchEffect />);
    const layer = screen.getByTestId("touch-layer");
    layer.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 540, height: 960 }) as DOMRect;
    Object.defineProperty(layer, "offsetWidth", { value: 1080 });

    fireEvent.pointerDown(window, { clientX: 100, clientY: 200 });
    const ripple = screen.getByTestId("touch-ripple");
    // 화면의 절반 크기로 줄어든 스테이지에서 누르면 스테이지 좌표는 두 배가 된다.
    expect(ripple.style.left).toBe("125px");
    expect(ripple.style.top).toBe("325px");

    fireEvent.animationEnd(ripple);
    expect(screen.queryAllByTestId("touch-ripple")).toHaveLength(0);
  });
});
