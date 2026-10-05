import { describe, expect, it } from "vitest";
import {
  CLOSE_RELATIONS,
  CONFESSIONS,
  DISTANT_RELATIONS,
  LOVE_MESSAGES,
  MESSAGE_PARTIES,
  PARTY_RULES,
  STYLE_TASTES,
} from "@/data/analysisRules";
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

// 모든 답변 조합과 그 답변으로 고른 케이크.
const ALL = RELATIONS.flatMap((relation) =>
  STYLES.flatMap((style) =>
    PARTIES.flatMap((party) =>
      FLAVORS.map((flavor) => {
        const answers: AnalysisAnswers = {
          relation: relation.id,
          style: style.id,
          party: party.id,
          flavor: flavor.id,
        };
        const cake = pickCake(answers);
        const preset = CAKE_PRESETS.find(
          (one) => one.cake.decorations === cake.decorations,
        );
        // 다른 모양에서만 그리는 장식은 원래 모양에서 그려지지 않는다.
        const used = cake.decorations
          .filter((item) => !item.only || item.only.includes(cake.shape))
          .map((item) => item.id);
        return { answers, cake, presetId: preset?.id, used };
      }),
    ),
  ),
);

const share = <T>(items: T[], test: (item: T) => boolean) =>
  items.filter(test).length / items.length;
const hasAny = (used: string[], starts: string[]) =>
  used.some((id) => starts.some((start) => id.startsWith(start)));

describe("pickCake", () => {
  it("어떤 답변 조합에도 예시 케이크 중 하나를 그릴 수 있는 구성으로 돌려준다", () => {
    for (const { answers, cake, presetId, used } of ALL) {
      const label = Object.values(answers).join("/");
      expect(presetId, label).toBeDefined();
      expect(cakeLayers(cake), label).toHaveLength(used.length + 1);
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

  it("같은 답변이면 같은 케이크를 고른다", () => {
    expect(pickCake(ANSWERS)).toEqual(pickCake(ANSWERS));
  });
});

describe("파티 테마의 반영", () => {
  it("생일, 위로와 응원, 웨딩에는 그 테마의 글자가 적힌 케이크가 나온다", () => {
    for (const { answers, used } of ALL) {
      const { messages } = PARTY_RULES[answers.party];
      // 과일을 고르면 과일이 먼저다. 그 경우는 아래에서 따로 본다.
      if (messages.length === 0 || answers.flavor === "fruit") continue;
      expect(
        used.some((id) => messages.includes(id)),
        Object.values(answers).join("/"),
      ).toBe(true);
    }
  });

  it("과일을 골라 그 테마의 글자를 쓸 수 없으면 축하 이름표가 적힌 케이크가 나온다", () => {
    for (const { answers, used } of ALL) {
      const { messages } = PARTY_RULES[answers.party];
      if (messages.length === 0 || answers.flavor !== "fruit") continue;
      expect(
        used.some((id) => MESSAGE_PARTIES[id]?.includes(answers.party)),
        Object.values(answers).join("/"),
      ).toBe(true);
    }
  });

  it("테마에 맞지 않는 글자가 적힌 케이크는 나오지 않는다", () => {
    for (const { answers, used } of ALL) {
      for (const id of used) {
        const parties = MESSAGE_PARTIES[id];
        if (!parties) continue;
        expect(parties, `${Object.values(answers).join("/")} ${id}`).toContain(
          answers.party,
        );
      }
    }
  });

  it("이벤트에는 장식이 많은 케이크가, 일상에는 장식이 적은 케이크가 나온다", () => {
    for (const { answers, used } of ALL) {
      const label = Object.values(answers).join("/");
      if (answers.party === "event") {
        expect(used.length, label).toBeGreaterThanOrEqual(12);
      }
      if (answers.party === "daily") {
        expect(used.length, label).toBeLessThanOrEqual(11);
      }
    }
  });
});

describe("맛 답변의 반영", () => {
  it("초코나 치즈가 별로라면 초코 케이크는 나오지 않는다", () => {
    for (const { answers, cake, used } of ALL) {
      if (answers.flavor !== "rich") continue;
      const label = Object.values(answers).join("/");
      expect(cake.color, label).not.toBe("choco");
      expect(hasAny(used, ["coating-choco", "plate-choco"]), label).toBe(false);
    }
  });

  it("과일을 고르면 늘 과일이 얹힌 케이크가 나온다", () => {
    for (const { answers, used } of ALL) {
      if (answers.flavor !== "fruit") continue;
      expect(hasAny(used, ["fruit-"]), Object.values(answers).join("/")).toBe(
        true,
      );
    }
  });
});

describe("관계 답변의 반영", () => {
  it("웨딩이 아니면 친구와 동료에게 사랑을 말하는 글자의 케이크는 나오지 않는다", () => {
    for (const { answers, used } of ALL) {
      if (answers.party === "wedding") continue;
      if (!DISTANT_RELATIONS.includes(answers.relation)) continue;
      expect(
        used.some((id) => LOVE_MESSAGES.includes(id)),
        Object.values(answers).join("/"),
      ).toBe(false);
    }
  });

  it("고백에 가까운 글자의 케이크는 연인과 최애에게만 나온다", () => {
    for (const { answers, used } of ALL) {
      if (CLOSE_RELATIONS.includes(answers.relation)) continue;
      expect(
        used.some((id) => CONFESSIONS.includes(id)),
        Object.values(answers).join("/"),
      ).toBe(false);
    }
  });

  it("사랑을 말하는 글자의 케이크는 연인과 최애에게 더 자주 나온다", () => {
    const loving = (one: (typeof ALL)[number]) =>
      one.used.some((id) => [...LOVE_MESSAGES, ...CONFESSIONS].includes(id));
    const close = ALL.filter((one) =>
      CLOSE_RELATIONS.includes(one.answers.relation),
    );
    const rest = ALL.filter(
      (one) => !CLOSE_RELATIONS.includes(one.answers.relation),
    );

    expect(share(close, loving)).toBeGreaterThan(share(rest, loving));
  });
});

describe("스타일 답변의 반영", () => {
  // 과일을 고르면 과일이 얹힌 예시 안에서만 고르므로, 스타일은 그 밖의 맛 답변으로 본다.
  const FREE = ALL.filter((one) => one.answers.flavor !== "fruit");

  it("미니멀리스트에게는 장식이 더 적은 케이크가 나온다", () => {
    const count = (items: typeof ALL) =>
      items.reduce((sum, one) => sum + one.used.length, 0) / items.length;
    for (const party of PARTIES) {
      const inParty = FREE.filter((one) => one.answers.party === party.id);
      const minimal = inParty.filter(
        (one) => one.answers.style === "minimalist",
      );
      const rest = inParty.filter((one) => one.answers.style !== "minimalist");
      // 웨딩은 글자가 적힌 예시가 여섯뿐이라 차이가 나지 않는다.
      if (party.id === "wedding") continue;
      expect(count(minimal), party.id).toBeLessThan(count(rest));
    }
  });

  it("글자 조건이 없는 테마에서는 취향의 장식이 얹힌 케이크가 나온다", () => {
    for (const style of [
      "aesthetic-curator",
      "cute-collector",
      "subculture-digger",
    ] as const) {
      const picked = FREE.filter(
        (one) =>
          one.answers.style === style &&
          PARTY_RULES[one.answers.party].messages.length === 0,
      );
      expect(
        share(picked, (one) =>
          hasAny(one.used, STYLE_TASTES[style].decorations),
        ),
        style,
      ).toBeGreaterThan(0.9);
    }
  });

  it("스타일을 바꾸면 케이크도 달라진다", () => {
    for (const party of PARTIES) {
      const picked = new Set(
        STYLES.map(
          (style) =>
            ALL.find(
              (one) =>
                one.answers.party === party.id &&
                one.answers.style === style.id &&
                one.answers.relation === ANSWERS.relation &&
                one.answers.flavor === ANSWERS.flavor,
            )?.presetId,
        ),
      );
      expect(picked.size, party.id).toBeGreaterThan(1);
    }
  });
});

describe("결과의 쏠림", () => {
  it("예시 대부분이 어떤 답변으로든 나온다", () => {
    const picked = new Set(ALL.map((one) => one.presetId));
    expect(picked.size).toBeGreaterThanOrEqual(CAKE_PRESETS.length - 4);
  });

  // 응원 글자가 적힌 예시는 넷뿐이고, 그중 과일이 얹힌 것은 하나라 과일을 고르면 늘 그 예시가 나온다.
  it("한 테마에서 예시 하나가 결과의 5분의 2를 넘지 않는다", () => {
    for (const party of PARTIES) {
      const inParty = ALL.filter((one) => one.answers.party === party.id);
      const counts = new Map<string | undefined, number>();
      for (const one of inParty) {
        counts.set(one.presetId, (counts.get(one.presetId) ?? 0) + 1);
      }
      expect(
        Math.max(...counts.values()) / inParty.length,
        party.id,
      ).toBeLessThan(2 / 5);
    }
  });

  it("테마와 스타일이 같아도 관계와 맛에 따라 다른 케이크가 나온다", () => {
    for (const party of PARTIES) {
      for (const style of STYLES) {
        const picked = new Set(
          ALL.filter(
            (one) =>
              one.answers.party === party.id && one.answers.style === style.id,
          ).map((one) => one.presetId),
        );
        expect(picked.size, `${party.id}/${style.id}`).toBeGreaterThan(1);
      }
    }
  });
});
