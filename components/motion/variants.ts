/**
 * 모션 값의 단일 출처. 컴포넌트에 직접 쓰지 않는다 (`.claude/rules/motion.md`).
 * duration·easing 토큰은 `app/globals.css` 의 CSS 변수에 있다.
 */

/** 대사 한 글자당 간격. */
export const TYPE_CHAR_MS = 50

/** 대화 박스가 떠오른 뒤 타이핑이 시작된다. */
export const TYPE_START_DELAY_MS = 700

/** 주어진 글자 수의 타이핑이 끝나는 시각. */
export const typeDurationMs = (charCount: number) =>
  TYPE_START_DELAY_MS + charCount * TYPE_CHAR_MS
