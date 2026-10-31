import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CAKE_PRESETS } from "@/data/cakePresets";
import {
  MENU_BACK_LABEL,
  MENU_CLOSE_LABEL,
  MENU_PACK_CHOICE,
  menuCakes,
} from "@/data/menu";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { MenuScreen } from "./MenuScreen";

// 부품을 겹칠 순서를 몇 번이나 셈하는지 센다. 목록을 다시 그릴 때마다 셈하면 키오스크에서 밀린다.
const layerCalls = { count: 0 };
vi.mock("@/lib/cake", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/cake")>();
  return {
    ...actual,
    cakeLayers: (...args: Parameters<typeof actual.cakeLayers>) => {
      layerCalls.count += 1;
      return actual.cakeLayers(...args);
    },
  };
});

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

  it("화면을 다시 그려도 목록의 케이크를 다시 셈하지 않는다", () => {
    render(<MenuScreen />);
    layerCalls.count = 0;

    // 크게 보기를 열고 닫으면 목록은 그대로인 채 화면만 다시 그려진다. 목록을 미는 것과 같은 모양의 부하다.
    fireEvent.click(cakeButtons()[0]);
    fireEvent.click(screen.getByRole("button", { name: MENU_CLOSE_LABEL }));

    // 크게 보여 줄 케이크 한 개 말고는 다시 셈하지 않는다.
    expect(layerCalls.count).toBeLessThanOrEqual(1);
  });

  it("뒤로 가기를 누르면 결과 화면으로 돌아간다", () => {
    render(<MenuScreen />);

    fireEvent.click(screen.getByRole("button", { name: MENU_BACK_LABEL }));

    expect(useExperienceStore.getState().step).toBe("result");
  });
});
