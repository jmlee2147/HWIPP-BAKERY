import type { Config } from 'tailwindcss'

// Tailwind v3. v4는 Chrome 111+ 요구 — webOS 24는 Chromium 108이다.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // 베이커리 재료 이름. 괄호는 대조용 Figma 변수명.
      colors: {
        cream: 'var(--color-cream)', // 메인2  — 화면 바탕, 대화박스
        berry: 'var(--color-berry)', // 색상 3 — 강조, 선택지, 진행률 채움
        cocoa: 'var(--color-cocoa)', // 색상 2 — 본문 텍스트, 하단 바
        dough: 'var(--color-dough)', // 색상   — 보조 텍스트, 비활성
        sugar: 'var(--color-sugar)', // 메인1  — 밝은 면, 구분선
        icing: 'var(--color-icing)', // 대화 박스 본문 배경
        crust: 'var(--color-crust)', // 대화 박스 하단 바
        blush: 'var(--color-blush)', // 선택지 버튼 핑크
        mint: 'var(--color-mint)',   // 선택지 버튼 민트, 진행률 트랙
        plate: 'var(--color-plate)', // 선택지 버튼 바깥 판
        'track-line': 'var(--color-track-line)',
        'fill-line': 'var(--color-fill-line)',
        'plate-line': 'var(--color-plate-line)',
        board: 'var(--color-board)', // 타이틀 액자 안쪽 면
        panel: 'var(--color-panel)', // 타이틀 액자 위쪽 판
        dot: 'var(--color-dot)',     // 타이틀 도트 패턴
        roast: 'var(--color-roast)', // START! 글자
      },
      boxShadow: {
        window: 'var(--shadow-window)',
      },
      dropShadow: {
        dialog: 'var(--shadow-dialog)',
        cream: 'var(--shadow-cream)',
        window: 'var(--shadow-window-drop)',
        sign: 'var(--shadow-sign-drop)', // 오프닝 간판 로고
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        hint: ['var(--font-hint)'], // 오프닝 하단 안내문
      },
      // Figma 텍스트 스타일은 `본문` 하나뿐. 스케일이 확정되면 여기에 추가한다.
      fontSize: {
        body: [
          'var(--text-body-size)',
          {
            lineHeight: 'var(--text-body-leading)',
            letterSpacing: 'var(--text-body-tracking)',
            fontWeight: 'var(--text-body-weight)',
          },
        ],
      },
      // 고정 캔버스라 Figma px를 그대로 쓴다.
      spacing: {
        canvas: '1080px',
        'canvas-h': '1920px',
      },
      transitionTimingFunction: {
        enter: 'var(--ease-enter)',
        exit: 'var(--ease-exit)',
        move: 'var(--ease-move)',
      },
      transitionDuration: {
        instant: 'var(--dur-instant)',
        quick: 'var(--dur-quick)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        scene: 'var(--dur-scene)',
      },
    },
  },
  plugins: [],
}

export default config
