import { fromRotatedArtboard } from '@/lib/config/artboard'
import { SIGN_LAYOUT, WORDMARK_FONT_SIZE } from './script'

const PLATE = fromRotatedArtboard(SIGN_LAYOUT.plate)
const HEART = fromRotatedArtboard(SIGN_LAYOUT.heart)
const WORDMARK = fromRotatedArtboard(SIGN_LAYOUT.wordmark)
const BAKERY = fromRotatedArtboard(SIGN_LAYOUT.bakery)

/**
 * 가게 간판의 로고. 겹 구성과 blend 근거는 `script.ts` 의 `SIGN_LAYOUT` 주석에 있다.
 * `hard-light` 는 겹 전체에 한 번만 건다 — 겹마다 걸면 밝은 겹이 중복으로 밝아진다.
 */
export const SignLogo = () => (
  <div className="absolute inset-0" style={{ mixBlendMode: 'hard-light' }}>
    <img
      src="/img/opening/sign-plate.avif"
      alt=""
      className="absolute block max-w-none drop-shadow-sign"
      style={PLATE}
    />
    <img src="/img/opening/sign-heart.svg" alt="" className="absolute block max-w-none" style={HEART} />
    <div
      className="absolute flex items-center justify-center whitespace-nowrap font-display text-white"
      style={{ ...WORDMARK, fontSize: WORDMARK_FONT_SIZE }}
    >
      Hwipp!
    </div>
    <img src="/img/opening/sign-bakery.svg" alt="" className="absolute block max-w-none" style={BAKERY} />
  </div>
)
