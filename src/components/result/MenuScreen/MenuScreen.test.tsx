import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CAKE_PRESETS } from "@/data/cakePresets";
import {
  MENU_BACK_LABEL,
  MENU_CLOSE_LABEL,
  MENU_PACK_CHOICE,
  menuCakes,
} from "@/data/menu";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { MenuScreen } from "./MenuScreen";

const cakeButtons = () => screen.getAllByRole("button", { name: /크게 보기$/ });

describe("MenuScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "menu" });
  });

  afterEach(() => {
    cleanup();
  });

  it("처음에는 원형 예시를, 탭을 누르면 그 모양의 예시를 보여 준다", () => {
    render(<MenuScreen />);
    expect(cakeButtons()).toHaveLength(menuCakes("round").length);

    fireEvent.click(screen.getByRole("tab", { name: "하트 케이크" }));

    expect(cakeButtons()).toHaveLength(menuCakes("heart").length);
    expect(
      screen
        .getByRole("tab", { name: "하트 케이크" })
        .getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("탭마다 나누어 보여 주면 예시가 모두 한 번씩 나온다", () => {
    const shown = (["round", "heart", "square"] as const).flatMap((shape) =>
      menuCakes(shape).map((preset) => preset.id),
    );

    expect(shown.sort()).toEqual(
      CAKE_PRESETS.map((preset) => preset.id).sort(),
    );
  });

  it("케이크를 누르면 크게 보여 주고, 닫으면 목록으로 돌아간다", async () => {
    render(<MenuScreen />);

    fireEvent.click(cakeButtons()[0]);
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: MENU_CLOSE_LABEL }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(useExperienceStore.getState().step).toBe("menu");
  });

  it("이 디자인으로 포장하면 고른 예시를 케이크로 삼아 소장 및 공유 단계로 간다", () => {
    const preset = menuCakes("square")[1];
    render(<MenuScreen />);

    fireEvent.click(screen.getByRole("tab", { name: "사각형 케이크" }));
    fireEvent.click(cakeButtons()[1]);
    fireEvent.click(screen.getByRole("button", { name: MENU_PACK_CHOICE }));

    const { step, cake } = useExperienceStore.getState();
    expect(step).toBe("share");
    expect(cake).toEqual(preset.cake);
    expect(cake).not.toBe(preset.cake);
    expect(cake?.decorations[0]).not.toBe(preset.cake.decorations[0]);
  });

  it("뒤로 가기를 누르면 결과 화면으로 돌아간다", () => {
    render(<MenuScreen />);

    fireEvent.click(screen.getByRole("button", { name: MENU_BACK_LABEL }));

    expect(useExperienceStore.getState().step).toBe("result");
  });
});
