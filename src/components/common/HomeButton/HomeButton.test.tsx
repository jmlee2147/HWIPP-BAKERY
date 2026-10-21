import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeButton } from "./HomeButton";

const MESSAGE = "케이크 제작을 끝내고 처음으로 돌아갈까요?";

describe("HomeButton", () => {
  afterEach(() => {
    cleanup();
  });

  it("누르면 바로 돌아가지 않고 확인 팝업을 띄운다", () => {
    const onHome = vi.fn();
    render(<HomeButton onHome={onHome} />);
    expect(screen.queryByRole("alertdialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "처음으로 돌아가기" }));
    expect(screen.getByRole("alertdialog", { name: MESSAGE })).toBeTruthy();
    expect(onHome).not.toHaveBeenCalled();
  });

  it("팝업에서 처음으로를 고르면 돌아가고, 계속하기를 고르면 팝업만 닫힌다", () => {
    const onHome = vi.fn();
    render(<HomeButton onHome={onHome} />);
    const open = () =>
      fireEvent.click(
        screen.getByRole("button", { name: "처음으로 돌아가기" }),
      );

    open();
    fireEvent.click(screen.getByRole("button", { name: "계속하기" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(onHome).not.toHaveBeenCalled();

    open();
    fireEvent.click(screen.getByRole("button", { name: "처음으로" }));
    expect(onHome).toHaveBeenCalledOnce();
  });
});
