import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProgressBar } from "./ProgressBar";

// 진행 바를 화면에 실제 크기(930.25px)로 놓은 것처럼 만든다.
const placeTrack = () => {
  const track = screen.getByTestId("progress-track");
  const bar = track.parentElement as HTMLElement;
  vi.spyOn(bar, "getBoundingClientRect").mockReturnValue({
    left: 0,
    width: 930.25,
  } as DOMRect);
  return track;
};

const drag = (track: HTMLElement, from: number, to: number) => {
  fireEvent.pointerDown(track, { clientX: from, pointerId: 1 });
  fireEvent.pointerMove(track, { clientX: to, pointerId: 1 });
  fireEvent.pointerUp(track, { clientX: to, pointerId: 1 });
};

describe("ProgressBar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("손잡이를 끌어 놓으면 가장 가까운 단계로 간다", () => {
    const onSelectStep = vi.fn();
    render(<ProgressBar step={3} maxStep={4} onSelectStep={onSelectStep} />);
    const track = placeTrack();

    // 1단계 손잡이 가운데(약 192px) 가까이에 놓는다.
    drag(track, 478, 210);
    expect(onSelectStep).toHaveBeenLastCalledWith(1);

    // 4단계 손잡이 가운데(약 606px) 가까이에 놓는다.
    drag(track, 478, 590);
    expect(onSelectStep).toHaveBeenLastCalledWith(4);
  });

  it("갈 수 있는 단계보다 뒤로 끌어도 그 단계에 멈춘다", () => {
    const onSelectStep = vi.fn();
    render(<ProgressBar step={1} maxStep={2} onSelectStep={onSelectStep} />);

    drag(placeTrack(), 192, 900);
    expect(onSelectStep).toHaveBeenLastCalledWith(2);
  });

  it("지금 단계 자리에 놓으면 아무 데도 가지 않는다", () => {
    const onSelectStep = vi.fn();
    render(<ProgressBar step={2} maxStep={4} onSelectStep={onSelectStep} />);

    drag(placeTrack(), 318, 330);
    expect(onSelectStep).not.toHaveBeenCalled();
  });

  it("이동할 수 없는 진행 바에는 끄는 영역과 이동 버튼이 없다", () => {
    render(<ProgressBar step={2} />);

    expect(screen.queryByTestId("progress-track")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
