# 프로젝트 제약 조건

이 문서는 프로젝트에서 항상 지켜야 하는 금지/제약 조건을 정의합니다.
근거와 대안 검토는 `docs/ARCHITECTURE.md`에 있습니다.

## 구동 환경 (확정)

```
스탠바이미2 webOS 24 브라우저 ──Wi-Fi──▶ Vercel 배포 URL
```

| 항목 | 값 |
| --- | --- |
| 표시 | LG 스탠바이미2 27LX6 · 세로 회전 · 1440 × 2560 |
| 디자인 캔버스 | Figma 세로 **1080 × 1920** (패널과 9:16 동일, 정확히 4/3배) |
| 렌더링 | webOS 24 내장 브라우저 · **TV SoC(알파8), 데스크톱 GPU 아님** |
| 입력 | **터치** (기기가 자기 화면을 처리하므로 네이티브 동작) |
| 네트워크 | **와이파이 전용** (유선랜 포트 없음) |
| 전원 | AC 상시 연결 (배터리 4시간으로는 하루를 못 넘김) |

- 전시장에 컴퓨터를 두지 않습니다. 개발용 맥은 개발 장비입니다.
- **HDMI로 컴퓨터를 붙여 터치를 받는 경로는 종료되었습니다.** 다시 검토하지 않습니다.
  (LG 공식: "HDMI로 연결한 PC는 터치로 조작할 수 없습니다." USB-C 3조도 USB 2.0이라 불가)

## 런타임과 패키지 매니저

- **Node 22** (`.nvmrc`). Node 20은 2026년 4월 EOL이므로 쓰지 않습니다.
- **`pnpm`만** 사용합니다. `npm install`, `yarn install`, `npm run`, `yarn`을 쓰지 않습니다.
  버전은 `package.json`의 `packageManager`가 corepack으로 고정합니다.
- pnpm은 의존성 `postinstall`을 기본 차단합니다. 허용이 필요하면
  **`pnpm-workspace.yaml`의 `allowBuilds`**에 명시합니다 (package.json의 `pnpm` 필드는 더 이상 읽히지 않습니다).
  허용 대상을 늘릴 때는 그 패키지가 왜 빌드 스크립트를 필요로 하는지 주석으로 남깁니다.

## 브라우저 타깃 — **Chromium 108** (확정)

LG 공식 문서 기준 **webOS TV 24 = Chromium 108**입니다.
개발 맥의 Chrome을 기준으로 삼지 않습니다. `browserslist`를 `chrome >= 108`로 고정합니다.

### 쓸 수 있는 것 (Chromium 108에서 지원)

`:has()`(105) · container query(105) · `@property`(85) · cascade layers `@layer`(99) ·
`:is()`/`:where()`(88) · `aspect-ratio`(88) · flexbox `gap`(84) ·
Service Worker · Fullscreen API · Pointer Events · Web Animations API ·
**AVIF**(85) · WebP · `structuredClone`(98) · `Object.hasOwn`(93) · `findLast`(97) · top-level await(89)

### 쓸 수 없는 것 (108 초과 요구)

| 기능 | 필요 버전 |
| --- | --- |
| **Tailwind CSS v4** | Chrome 111 (`color-mix()` 의존) |
| `color-mix()` | 111 |
| CSS nesting (`&`) | 112 |
| View Transitions API | 111 |
| `text-wrap: balance` | 114 |
| Subgrid | 117 |
| **`paint-order` (HTML 텍스트)** | **123** |

- **Tailwind CSS v3을 사용합니다.** v4는 Chromium 108에서 **폴백 없이 깨집니다.**
- 위 표의 기능을 쓰지 않습니다. CI가 잡도록 `browserslist`에 반영합니다.
- 새 CSS/JS 기능을 쓸 때는 **Chrome 108 지원 여부를 먼저 확인**합니다.
- **`paint-order`로 글자 외곽선을 뒤로 보내지 않습니다.** SVG 텍스트에서는 되지만 HTML 텍스트
  지원은 Chromium 123부터입니다. 개발 맥에서는 맞게 보이고 실기에서만 달라지므로 놓치기 쉽습니다.
  대신 **두께를 두 배로 준 겹을 뒤에 깔고 글자를 덮습니다** (`features/opening/TitleLogo.tsx`).

## 레이아웃

- **반응형을 만들지 않습니다.** 브레이크포인트, 미디어 쿼리, 반응형 유틸리티를 쓰지 않습니다.
- 1080×1920 캔버스를 고정하고 루트에서 전체를 scale 합니다.
- **배율을 `4/3`으로 하드코딩하지 않습니다.** `lib/config/canvas.ts`의 `getCanvasScale()`을 씁니다.
  webOS 논리 뷰포트가 1080인지 1440인지 아직 확인되지 않았습니다.
- Figma px 좌표를 rem·%·vw로 환산하지 않고 그대로 씁니다.

## 입력 — 터치 전용

- `cursor: none`을 전역에 둡니다. **이 프로젝트에서는 이것이 맞습니다.**
- **hover를 유일한 어포던스로 쓰지 않습니다.** 터치에는 hover가 없습니다.
  Figma에 hover 상태가 그려져 있어도 그 의도를 `:active` 또는 정적 어포던스로 옮깁니다.
- 클릭 이벤트는 `pointerdown`/`pointerup`을 사용합니다.
- 터치 타겟은 **≥ 88px**, `touch-action: manipulation`으로 300ms 탭 지연을 제거합니다.
- 컨텍스트 메뉴, 텍스트 선택, 드래그, 더블탭 확대, 핀치 줌, 풀투리프레시를 전역 비활성화합니다.

## 이미지

- **AVIF를 사용합니다.** Chromium 108은 AVIF를 지원합니다(Chrome 85+).
  WebP 대비 용량이 40~50% 줄어 디코딩 예산에 직접 도움이 됩니다.
  (디코딩 메모리는 포맷과 무관하게 픽셀 수로 결정되므로, 줄어드는 것은 전송·저장 용량입니다)
- `next/image`를 쓰지 않습니다. 정적 `<img>` + 프리로드가 더 빠릅니다.
- `srcset`·`sizes`를 쓰지 않습니다. 고정 해상도라 후보가 하나뿐입니다.
- 배수 에셋을 여러 개 만들지 않습니다. **Figma 2x 익스포트 하나**만 씁니다.
- 자세한 기준은 `.claude/rules/assets.md`를 따릅니다.

## 보안

- `ANTHROPIC_API_KEY`는 서버 전용입니다. `NEXT_PUBLIC_*`에 넣지 않습니다.
- `/api/analyze`는 공개 노출됩니다. rate limit·Origin 체크·일일 상한 없이 배포하지 않습니다
  (`.claude/rules/ai-pipeline.md`).
- 답변은 선택지 코드값만 저장합니다. 개인 식별 정보와 자유 텍스트를 저장하지 않습니다.

## 만들지 않는 것

- **관리자 대시보드**를 만들지 않습니다. 필요하다는 결론이 나오면 자가 복구가 부족한 것입니다
  (`.claude/rules/operations.md`).
- 커스텀 커서, `INPUT_MODE` 같은 입력 분기 플래그를 만들지 않습니다. 터치로 확정되었습니다.
- 새 UI 라이브러리나 패키지 매니저를 도입하지 않습니다.
- production dependency 추가 전에는 확인을 받습니다.

## 배포

- 전시 기간 중에는 배포하지 않습니다. 긴급 수정만 하고 버전 전파 경로로 반영합니다.
- 전시 전날 이후로는 의존성을 올리지 않습니다. lockfile과 Node 버전을 고정합니다.
