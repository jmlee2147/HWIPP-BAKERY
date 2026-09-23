import { TYPE_CHAR_MS, TYPE_START_DELAY_MS } from './variants'

interface TypewriterProps {
  lines: readonly string[]
  /** true 면 애니메이션 없이 전체를 보여준다 — 탭 스킵과 타이핑 완료 후에 쓴다. */
  revealed?: boolean
}

/**
 * 대사를 한 글자씩 드러낸다.
 *
 * 글자마다 state 를 바꾸면 텍스트 레이아웃이 글자 수만큼 반복된다.
 * 대신 글자를 span 으로 쪼개 `animation-delay` 만 다르게 준다 — 레이아웃은 한 번이고
 * 이후로는 opacity 만 바뀌므로 TV SoC 에서도 합성만 일어난다.
 */
export const Typewriter = ({ lines, revealed = false }: TypewriterProps) => {
  let charsBefore = 0

  return (
    <>
      {lines.map((line) => {
        const chars = [...line]
        const start = charsBefore
        charsBefore += chars.length

        return (
          // 줄바꿈은 데이터(`lines`)가 정한다. 자동 줄바꿈이 끼면 Figma 와 줄 수가 달라진다 —
          // 컷 4 의 첫 줄은 대화 박스 본문 너비(591px)보다 길어 세 줄로 접혔다.
          // 넘치는 줄은 `w-max` 로 자기 너비를 갖고 가운데에 놓인다. 부모의 `text-center`
          // 만으로는 넘치는 순간 왼쪽에 붙어 40px 틀어진다.
          <p key={line} className="w-max self-center whitespace-nowrap">
            {chars.map((char, index) => (
              <span
                key={`${start + index}`}
                className={revealed ? undefined : 'animate-type-in'}
                style={
                  revealed
                    ? undefined
                    : { animationDelay: `${TYPE_START_DELAY_MS + (start + index) * TYPE_CHAR_MS}ms` }
                }
              >
                {/* span 으로 쪼개면 일반 공백이 접힐 수 있어 nbsp 로 둔다 */}
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </p>
        )
      })}
    </>
  )
}
