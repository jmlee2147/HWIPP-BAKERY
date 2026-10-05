import {
  CLOSE_RELATIONS,
  CONFESSIONS,
  DISTANT_RELATIONS,
  FLAVOR_RULES,
  LOVE_MESSAGES,
  MESSAGE_PARTIES,
  PARTY_RULES,
  STYLE_TASTES,
} from "@/data/analysisRules";
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

// 답변과 맞지 않아 고르지 않는 예시의 점수.
const UNFIT = Number.NEGATIVE_INFINITY;
// 가장 어울리는 예시와 점수가 이만큼 안에 있으면 함께 후보로 둔다. 최고점 하나만 고르면 몇 개의 예시만 되풀이해 나온다.
const CLOSE_ENOUGH = 2;
// 후보가 이보다 적으면 관계와 맛을 바꿔도 같은 케이크만 나온다.
const MIN_CANDIDATES = 3;
// 테마의 조건을 채운 예시와 못 채운 예시의 점수 차이보다 작은 값. 이 안에 있으면 같은 조건을 채운 예시다.
const SAME_TIER = 12;

// 테마의 조건(글자, 장식 수)을 채웠을 때의 점수. 스타일, 관계, 맛의 점수를 모두 더한 것보다 커서,
// 테마의 조건을 채운 예시가 못 채운 예시에 밀리지 않는다.
const THEME_WEIGHT = 30;
// 장식이 모두 취향에 맞을 때의 점수와, 장식이 이보다 많으면 소박한 취향에 전혀 맞지 않는다고 보는 개수.
const STYLE_WEIGHT = 6;
const SPARSE_LIMIT = 30;

const startsWithAny = (id: string, starts: string[]) =>
  starts.some((start) => id.startsWith(start));

// 예시 케이크가 답변에 얼마나 어울리는지. 답변과 어긋나는 예시는 UNFIT이다.
// 파티 테마(글자, 장식 수)가 가장 크게, 그다음 스타일 취향, 관계, 맛 순으로 반영된다.
export function presetScore(
  preset: CakePreset,
  answers: AnalysisAnswers,
): number {
  const rule = PARTY_RULES[answers.party];
  const taste = STYLE_TASTES[answers.style];
  const flavor = FLAVOR_RULES[answers.flavor];
  // 다른 모양에서만 그리는 장식은 세지 않는다.
  const used = preset.cake.decorations
    .filter((item) => !item.only || item.only.includes(preset.cake.shape))
    .map((item) => item.id);
  const count = used.length;
  const messages = used.filter((id) => MESSAGE_PARTIES[id]);

  // 테마에 맞지 않는 글자가 적힌 케이크는 고르지 않는다.
  if (messages.some((id) => !MESSAGE_PARTIES[id].includes(answers.party))) {
    return UNFIT;
  }
  // 고백에 가까운 글자는 연인과 최애에게만, 사랑을 말하는 글자는 웨딩이 아니면 친구와 동료에게 주지 않는다.
  if (
    used.some((id) => CONFESSIONS.includes(id)) &&
    !CLOSE_RELATIONS.includes(answers.relation)
  ) {
    return UNFIT;
  }
  const loving = used.some((id) => LOVE_MESSAGES.includes(id));
  if (
    loving &&
    answers.party !== "wedding" &&
    DISTANT_RELATIONS.includes(answers.relation)
  ) {
    return UNFIT;
  }
  if (
    flavor &&
    (flavor.avoidColors.includes(preset.cake.color) ||
      used.some((id) => startsWithAny(id, flavor.avoid)) ||
      (flavor.require.length > 0 &&
        !used.some((id) => startsWithAny(id, flavor.require))))
  ) {
    return UNFIT;
  }

  let score = 0;
  // 글자가 꼭 있어야 하는 테마에서 그 글자가 없는 케이크는 한참 뒤로 민다.
  // 그 글자의 예시를 맛 답변 때문에 고를 수 없으면, 테마에 어울리는 다른 글자(축하 이름표)가 적힌 예시가 그다음이다.
  if (used.some((id) => rule.messages.includes(id))) score += THEME_WEIGHT;
  else if (rule.messages.length > 0 && messages.length > 0) {
    score += THEME_WEIGHT / 2;
  }
  for (const category of rule.categories) {
    if (used.some((id) => CATEGORY_OF.get(id) === category)) score += 2;
  }
  if (
    (rule.minCount !== undefined || rule.maxCount !== undefined) &&
    count >= (rule.minCount ?? 0) &&
    count <= (rule.maxCount ?? Number.POSITIVE_INFINITY)
  ) {
    score += THEME_WEIGHT;
  }

  if (taste.sparse) {
    score += Math.round(
      STYLE_WEIGHT * (1 - Math.min(count, SPARSE_LIMIT) / SPARSE_LIMIT),
    );
  } else if (count > 0) {
    const fitting = used.filter((id) => startsWithAny(id, taste.decorations));
    score += Math.round((fitting.length / count) * STYLE_WEIGHT);
  }
  if (taste.colors.includes(preset.cake.color)) score += 2;

  if (loving && CLOSE_RELATIONS.includes(answers.relation)) score += 2;

  if (flavor && used.some((id) => startsWithAny(id, flavor.dislike))) {
    score -= 3;
  }
  return score;
}

// 답변에 어울리는 예시들. 가장 어울리는 것과 점수가 가까운 것까지 들고, 그렇게 모은 것이 너무 적으면
// 같은 조건(테마의 글자, 장식 수)을 채운 예시 가운데 점수가 높은 순으로 더 채운다.
export function cakeCandidates(answers: AnalysisAnswers): CakePreset[] {
  const scored = CAKE_PRESETS.map((preset) => ({
    preset,
    score: presetScore(preset, answers),
  })).sort((a, b) => b.score - a.score);
  const best = scored[0].score;
  return scored
    .filter(
      (one, rank) =>
        one.score >= best - CLOSE_ENOUGH ||
        (rank < MIN_CANDIDATES && one.score > best - SAME_TIER),
    )
    .map((one) => one.preset);
}

// 문답 답변으로 완성 케이크 예시 중 하나를 골라 케이크 구성을 만든다. 크기는 파티 테마에 정해 둔 것을 쓴다.
// 어울리는 예시가 여럿이면 관계와 맛 답변에 따라 그중 하나를 골라, 답변이 다르면 케이크도 달라지게 한다.
export function pickCake(answers: AnalysisAnswers): CakeConfig {
  const candidates = cakeCandidates(answers);
  const turn =
    RELATIONS.findIndex((item) => item.id === answers.relation) *
      FLAVORS.length +
    FLAVORS.findIndex((item) => item.id === answers.flavor);
  const preset = candidates[turn % candidates.length];
  return { ...preset.cake, size: PARTY_RULES[answers.party].size };
}
