import { describe, expect, it } from "vitest";
import { PARTY_RULES } from "@/data/analysisRules";
import { CAKE_DECORATIONS } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { FLAVORS } from "@/data/flavors";
import { PARTIES } from "@/data/parties";
import { RELATIONS } from "@/data/relations";
import { STYLES } from "@/data/styles";
import { type AnalysisAnswers, pickCake } from "./analysis";
import { cakeLayers } from "./cake";

const ANSWERS: AnalysisAnswers = {
  relation: "friend",
  style: "cute-collector",
  party: "birthday",
  flavor: "anything",
};

const categories = (decorationIds: string[]) =>
  decorationIds.map(
    (id) => CAKE_DECORATIONS.find((item) => item.id === id)?.category,
  );

describe("pickCake", () => {
  it("어떤 답변 조합에도 예시 케이크 중 하나를 그릴 수 있는 구성으로 돌려준다", () => {
    for (const relation of RELATIONS) {
      for (const style of STYLES) {
        for (const party of PARTIES) {
          for (const flavor of FLAVORS) {
            const answers = {
              relation: relation.id,
              style: style.id,
              party: party.id,
              flavor: flavor.id,
            };
            const cake = pickCake(answers);
            const label = Object.values(answers).join("/");
            expect(
              CAKE_PRESETS.some(
                (preset) => preset.cake.decorations === cake.decorations,
              ),
              label,
            ).toBe(true);
            expect(cakeLayers(cake), label).toHaveLength(
              cake.decorations.length + 1,
            );
          }
        }
      }
    }
  });

  it("파티 테마에 정해 둔 크기를 쓴다", () => {
    const size = (party: AnalysisAnswers["party"]) =>
      pickCake({ ...ANSWERS, party }).size;
    expect(size("birthday")).toBe("large");
    expect(size("event")).toBe("large");
    expect(size("comfort")).toBe("medium");
    expect(size("daily")).toBe("mini");
    expect(size("wedding")).toBe("large");
  });

  it("생일에는 초와 레터링이 있는 케이크를 고른다", () => {
    for (const style of STYLES) {
      const cake = pickCake({ ...ANSWERS, style: style.id });
      const used = categories(cake.decorations.map((item) => item.id));
      expect(used, style.id).toContain("candle");
      expect(used, style.id).toContain("lettering");
    }
  });

  it("위로와 응원에는 응원 문구가 적힌 케이크를 고른다", () => {
    for (const style of STYLES) {
      const cake = pickCake({ ...ANSWERS, party: "comfort", style: style.id });
      expect(
        cake.decorations.some((item) =>
          PARTY_RULES.comfort.decorations.includes(item.id),
        ),
        style.id,
      ).toBe(true);
    }
  });

  it("이벤트에는 장식이 많은 케이크를, 일상에는 장식이 적은 케이크를 고른다", () => {
    for (const style of STYLES) {
      const event = pickCake({ ...ANSWERS, party: "event", style: style.id });
      const daily = pickCake({ ...ANSWERS, party: "daily", style: style.id });
      expect(event.decorations.length, style.id).toBeGreaterThanOrEqual(14);
      expect(daily.decorations.length, style.id).toBeLessThanOrEqual(8);
    }
  });

  it("웨딩에는 레터링이 있는 케이크를 고른다", () => {
    for (const style of STYLES) {
      const cake = pickCake({ ...ANSWERS, party: "wedding", style: style.id });
      expect(
        categories(cake.decorations.map((item) => item.id)),
        style.id,
      ).toContain("lettering");
    }
  });

  it("같은 답변이면 같은 케이크를, 관계나 맛이 다르면 다른 케이크도 고른다", () => {
    expect(pickCake(ANSWERS)).toEqual(pickCake(ANSWERS));
    const picked = new Set(
      RELATIONS.flatMap((relation) =>
        FLAVORS.map((flavor) =>
          JSON.stringify(
            pickCake({
              ...ANSWERS,
              party: "daily",
              relation: relation.id,
              flavor: flavor.id,
            }),
          ),
        ),
      ),
    );
    expect(picked.size).toBeGreaterThan(1);
  });
});
