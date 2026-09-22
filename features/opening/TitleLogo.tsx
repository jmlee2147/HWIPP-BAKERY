import { fromArtboardMeta } from '@/lib/config/artboard'
import {
  LOGO_LAYOUT,
  LOGO_STAR_IMAGE,
  LOGO_STAR_TILT,
  LOGO_STAR_WINDOW,
  LOGO_WORDMARK_FONT_SIZE,
} from './script'

const place = fromArtboardMeta
const PLATE = place(LOGO_LAYOUT.plate)
const HEART = place(LOGO_LAYOUT.heart)
const WORDMARK = place(LOGO_LAYOUT.wordmark)
const BAKERY = place(LOGO_LAYOUT.bakery)

/**
 * 타이틀 중앙 로고.
 *
 * 디자이너 메모는 "마우스 갖다대면 로고 뒤 별 배경 사각형 무빙"이지만
 * 터치에는 hover 가 없어 영영 보이지 않는 연출이 된다 (`.claude/rules/project-constraints.md`).
 * 그래서 상시 흐르게 옮겼다 — idle 은 전시 중 가장 오래 떠 있는 화면이라 움직임이 필요하다.
 *
 * 판·하트·BAKERY 는 간판 로고(`SignLogo`)와 같은 그림을 크기만 바꿔 쓴다.
 * 간판 쪽은 흰 면 위라 `hard-light` 를 걸지만 여기는 별판 위라 그대로 얹는다.
 */
export const TitleLogo = () => (
  <>
    {/* 별판. 창 밖으로 넘치는 그림을 창 안에서 천천히 흘린다. */}
    <div
      className="absolute overflow-hidden"
      style={{ ...LOGO_STAR_WINDOW, transform: `rotate(${LOGO_STAR_TILT}deg)` }}
    >
      <img
        src="/img/opening/title/logo-stars.avif"
        alt=""
        className="absolute block max-w-none animate-star-drift"
        style={LOGO_STAR_IMAGE}
      />
    </div>

    <img
      src="/img/opening/title/logo-plate.avif"
      alt=""
      className="absolute block max-w-none"
      style={{ ...PLATE, filter: 'drop-shadow(var(--shadow-logo-plate))' }}
    />
    <img src="/img/opening/sign-heart.svg" alt="" className="absolute block max-w-none" style={HEART} />
    <div
      className="absolute flex items-center justify-center whitespace-nowrap font-display text-white"
      style={{ ...WORDMARK, fontSize: LOGO_WORDMARK_FONT_SIZE, textShadow: 'var(--text-shadow-logo)' }}
    >
      Hwipp!
    </div>
    <img src="/img/opening/sign-bakery.svg" alt="" className="absolute block max-w-none" style={BAKERY} />
  </>
)
