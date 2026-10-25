import { KeywordTag } from "@/components/result/KeywordTag/KeywordTag";
import {
  FLAVOR_KEYWORDS,
  PARTY_KEYWORDS,
  RELATION_KEYWORDS,
  RESULT_KEYWORD_TAGS,
  STYLE_KEYWORDS,
} from "@/data/result";
import type { SharedCake } from "@/lib/share";

interface KeywordTagsProps {
  answers: SharedCake["answers"];
  // 맛 키워드 뒤에 붙이는 말. 결과 화면과 최종 완성 화면이 서로 다르다.
  flavorSuffix: string;
  // 태그 묶음을 아래로 내리는 거리.
  offsetY?: number;
}

// 문답 답변마다 키워드 태그를 하나씩 붙인다. 답하지 않은 문답의 태그는 건너뛴다.
export const KeywordTags = ({
  answers,
  flavorSuffix,
  offsetY = 0,
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
      {RESULT_KEYWORD_TAGS.map((tag) => {
        const text = keywords[tag.answer];
        if (!text) return null;
        return (
          <KeywordTag
            key={tag.answer}
            tone={tag.tone}
            className="absolute"
            style={{ left: tag.left, top: tag.top + offsetY }}
          >
            {text}
          </KeywordTag>
        );
      })}
    </>
  );
};
