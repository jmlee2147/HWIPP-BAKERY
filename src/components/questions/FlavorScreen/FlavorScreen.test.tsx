import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FLAVORS } from "@/data/flavors";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { FlavorScreen } from "./FlavorScreen";

const card = (index: number) =>
  screen.getByRole("button", { name: FLAVORS[index].label });
const pressed = (index: number) => card(index).getAttribute("aria-pressed");

describe("FlavorScreen", () => {
  beforeEach(() => {
    useExperienceStore.getState().reset();
    useExperienceStore.setState({ step: "flavor" });
  });

  afterEach(() => {
    cleanup();
  });

  it("첫 카드가 강조된 채로 시작하고, 다른 카드를 누르면 그 카드가 강조된다", () => {
    render(<FlavorScreen />);
    expect(pressed(0)).toBe("true");
    expect(screen.getByRole("status").textContent).toBe(FLAVORS[0].label);

    fireEvent.click(card(3));
    expect(pressed(3)).toBe("true");
    expect(pressed(0)).toBe("false");
    expect(screen.getByRole("status").textContent).toBe(FLAVORS[3].label);
  });

  it("선택하기를 눌러야 고른 조건이 저장되고 다음 단계로 간다", () => {
    render(<FlavorScreen />);

    fireEvent.click(card(2));
    expect(useExperienceStore.getState().flavor).toBeNull();
    expect(useExperienceStore.getState().step).toBe("flavor");

    fireEvent.click(screen.getByRole("button", { name: "선택하기" }));
    expect(useExperienceStore.getState().flavor).toBe("allergy");
    expect(useExperienceStore.getState().step).toBe("analysis");
  });

  it("앞서 고른 조건이 있으면 그 카드를 강조한 채로 시작한다", () => {
    useExperienceStore.setState({ flavor: "anything" });
    render(<FlavorScreen />);

    expect(pressed(4)).toBe("true");
  });
});
