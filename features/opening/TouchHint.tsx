import { fromRotatedArtboard } from '@/lib/config/artboard'
import { HINT_TYPE, OPENING_LAYOUT } from './script'

const HINT = fromRotatedArtboard(OPENING_LAYOUT.hint)
const TYPE = 'absolute inset-0 flex items-center justify-center whitespace-nowrap font-hint text-white'

interface TouchHintProps {
  children: string
}

/**
 * "화면을 터치해 들어가기" — 오프닝 하단의 탭 어포던스.
 *
 * 놓이는 자리의 배경 밝기가 224/255 라 흰 글자와 대비가 1.11:1 이다. 그래서 밝기를
 * 깜빡이면 거의 읽히지 않고, 색·폰트는 Figma 스펙이라 바꾸지 않는다. 대신 **번짐**을
 * 맥동시킨다 — 번짐이 강해질 때 글자 윤곽이 드러나 대비에 직접 도움이 된다.
 *
 * 그래서 같은 글자를 두 겹 깐다. `text-shadow` 자체를 애니메이션하면 프레임마다 글자를
 * 다시 그리므로, 번짐이 진한 겹을 뒤에 깔고 그 **불투명도만** 움직인다
 * (`.claude/rules/motion.md` — transform·opacity 만).
 */
export const TouchHint = ({ children }: TouchHintProps) => (
  <div className="absolute animate-hint-in" style={HINT}>
    <span
      aria-hidden="true"
      className={`${TYPE} animate-hint-glow`}
      style={{ ...HINT_TYPE, textShadow: 'var(--text-shadow-hint-pulse)' }}
    >
      {children}
    </span>
    <span className={TYPE} style={{ ...HINT_TYPE, textShadow: 'var(--text-shadow-hint)' }}>
      {children}
    </span>
  </div>
)
