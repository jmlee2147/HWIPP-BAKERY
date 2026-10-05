import { describe, expect, it } from "vitest";
import { CAKE_DECORATIONS, CAKE_SHAPES } from "./cake";
import {
  DECORATION_CATEGORIES,
  DECORATION_SETS,
  decorationChoices,
  EDITOR_CATEGORIES,
  LETTERING_CATEGORIES,
} from "./editor";

const ALL_CATEGORIES = Object.values(EDITOR_CATEGORIES).flat();

describe("EDITOR_CATEGORIES", () => {
  it("목록의 id는 모두 장식이나 묶음에 있고, 한 분류 안에서 겹치지 않는다", () => {
    const known = new Set([
      ...CAKE_DECORATIONS.map((item) => item.id),
      ...Object.keys(DECORATION_SETS),
    ]);
    expect(ALL_CATEGORIES).toHaveLength(
      DECORATION_CATEGORIES.length + LETTERING_CATEGORIES.length,
    );
    for (const category of ALL_CATEGORIES) {
      expect(category.items.filter((id) => !known.has(id))).toEqual([]);
      expect(new Set(category.items).size).toBe(category.items.length);
    }
  });

  it("묶음의 장식은 모두 낱개로 놓을 수 있는 장식이다", () => {
    for (const set of Object.values(DECORATION_SETS)) {
      for (const shape of CAKE_SHAPES) {
        expect(set.parts[shape.id].length).toBeGreaterThan(0);
        for (const part of set.parts[shape.id]) {
          const item = CAKE_DECORATIONS.find((one) => one.id === part.id);
          expect(item?.placement).toBe("top");
        }
      }
    }
  });
});

describe("decorationChoices", () => {
  it("낱개 장식과 묶음은 어느 모양에서나 나오고, 그림은 목록 칸보다 크지 않다", () => {
    for (const category of ALL_CATEGORIES) {
      for (const shape of CAKE_SHAPES) {
        const choices = decorationChoices(category, shape.id);
        // 시안의 장식은 세 모양의 그림이 모두 있고, 글자는 없는 모양에서 다른 모양의 그림을 써서 빠지는 것이 없다.
        expect(choices.map((choice) => choice.id)).toEqual(category.items);
        for (const choice of choices) {
          expect(choice.width).toBeLessThan(230.01);
          expect(choice.height).toBeLessThan(227.01);
        }
      }
    }
  });

  it("예시의 장식이 차지한 층의 장식은 빠진다", () => {
    const others = DECORATION_CATEGORIES.find((item) => item.id === "others");
    if (!others) throw new Error("OTHERS 분류가 없다");
    const ids = decorationChoices(others, "round", new Set(["sprinkle"])).map(
      (choice) => choice.id,
    );

    expect(ids).not.toContain("sprinkle");
    expect(ids).toContain("topper-bears");
  });

  it("예시에 글자가 있어도 글자는 목록에 모두 나온다", () => {
    for (const category of LETTERING_CATEGORIES) {
      const ids = decorationChoices(
        category,
        "heart",
        new Set(["lettering"]),
      ).map((choice) => choice.id);

      expect(ids).toEqual(category.items);
    }
  });
});
