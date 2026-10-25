import { KeywordTag } from "@/components/result/KeywordTag/KeywordTag";
import {
  FLAVOR_KEYWORDS,
  type KeywordSlot,
  PARTY_KEYWORDS,
  RELATION_KEYWORDS,
  STYLE_KEYWORDS,
} from "@/data/result";
import type { SharedCake } from "@/lib/share";
import { STAGE_WIDTH } from "@/lib/stage";

interface KeywordTagsProps {
  answers: SharedCake["answers"];
  // 맛 키워드 뒤에 붙이는 말. 결과 화면과 최종 완성 화면이 서로 다르다.
  flavorSuffix: string;
  slots: KeywordSlot[];
}

// 문답 답변마다 키워드 태그를 하나씩 붙인다. 답하지 않은 문답의 태그는 건너뛴다.
export const KeywordTags = ({
  answers,
  flavorSuffix,
  slots,
}: KeywordTagsProps) => {
  const { party, style, relation, flavor } = answers;
  const keywords = {
    party: party && PARTY_KEYWORDS[party],
    style: style && STYLE_KEYWORDS[style],
    relation: relation && RELATION_KEYWORDS[relation],
    flavor: flavor && `${FLAVOR_KEYWORDS[flavor]}${flavorSuffix}`,
  };

  return (
    <>
      {slots.map((slot) => {
        const text = keywords[slot.answer];
        if (!text) return null;
        return (
          <KeywordTag
            key={slot.answer}
            tone={slot.tone}
            className="absolute"
            style={
              "left" in slot
                ? { left: slot.left, top: slot.top }
                : { right: STAGE_WIDTH - slot.rightEdge, top: slot.top }
            }
          >
            {text}
          </KeywordTag>
        );
      })}
    </>
  );
};
