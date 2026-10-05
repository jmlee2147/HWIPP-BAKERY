import { PARTY_RULES, STYLE_TASTES } from "@/data/analysisRules";
import { CAKE_DECORATIONS, type CakeConfig } from "@/data/cake";
import { CAKE_PRESETS, type CakePreset } from "@/data/cakePresets";
import { FLAVORS, type FlavorId } from "@/data/flavors";
import type { PartyId } from "@/data/parties";
import { RELATIONS, type RelationId } from "@/data/relations";
import type { StyleId } from "@/data/styles";

export interface AnalysisAnswers {
  relation: RelationId;
  style: StyleId;
  party: PartyId;
  flavor: FlavorId;
}

const CATEGORY_OF = new Map(
  CAKE_DECORATIONS.map((item) => [item.id, item.category]),
);

// 예시 케이크가 답변에 얼마나 어울리는지. 파티 테마의 조건이 스타일 취향보다 먼저다.
function presetScore(preset: CakePreset, answers: AnalysisAnswers): number {
  const rule = PARTY_RULES[answers.party];
  const taste = STYLE_TASTES[answers.style];
  const used = preset.cake.decorations.map((item) => item.id);
  const count = used.length;

  let score = 0;
  for (const category of rule.categories) {
    if (used.some((id) => CATEGORY_OF.get(id) === category)) score += 3;
  }
  if (used.some((id) => rule.decorations.includes(id))) score += 6;
  if (
    (rule.minCount !== undefined || rule.maxCount !== undefined) &&
    count >= (rule.minCount ?? 0) &&
    count <= (rule.maxCount ?? Number.POSITIVE_INFINITY)
  ) {
    score += 6;
  }

  if (
    used.some((id) => taste.decorations.some((start) => id.startsWith(start)))
  ) {
    score += 2;
  }
  if (taste.maxCount !== undefined && count <= taste.maxCount) score += 2;
  return score;
}

// 문답 답변으로 완성 케이크 예시 중 하나를 골라 케이크 구성을 만든다. 크기는 파티 테마에 정해 둔 것을 쓴다.
// 가장 어울리는 예시가 여럿이면 관계와 맛 답변에 따라 그중 하나를 골라, 답변이 다르면 케이크도 달라지게 한다.
export function pickCake(answers: AnalysisAnswers): CakeConfig {
  const scores = CAKE_PRESETS.map((preset) => presetScore(preset, answers));
  const best = Math.max(...scores);
  const candidates = CAKE_PRESETS.filter((_, index) => scores[index] === best);
  const turn =
    RELATIONS.findIndex((item) => item.id === answers.relation) *
      FLAVORS.length +
    FLAVORS.findIndex((item) => item.id === answers.flavor);
  const preset = candidates[turn % candidates.length];
  return { ...preset.cake, size: PARTY_RULES[answers.party].size };
}
