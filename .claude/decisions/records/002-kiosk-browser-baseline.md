# 002. 키오스크 브라우저 기준선

## 상태

- Accepted (2026-10-21 실기기 확인)

## 맥락

전시 키오스크는 LG StanbyME 2(webOS 24, Chromium 108로 알려짐)지만, 지금 시험에 쓰는 기기는 1세대 StanbyME다. 1세대 기본 브라우저에서 `/check.html`로 확인한 값은 Chromium 87(`SmartTV/10.0`, webOS 22), viewport 720x1273, devicePixelRatio 1.5다.

처음에는 기준선을 108로 잡았다. 그 결과 1세대에서는 Next.js 런타임의 클래스 static 블록(94+)을 읽지 못해 JS가 통째로 멈추고 흰 화면만 보였다. Tailwind 기본 스타일의 `:where()`(88+) 규칙도 버려져 버튼에 기본 회색 바탕이 생긴다.

## 결정

브라우저 기준선을 Chromium 87로 낮춘다. `package.json`의 `browserslist`에 `chrome 87`을 적고, Tailwind CSS는 v3.4를 그대로 쓴다.

## 근거

- 기준선을 낮게 잡으면 전시 기기(2세대)가 더 최신이어도 문제가 없고, 시험 기기(1세대)에서도 같은 화면을 확인할 수 있다.
- Next.js는 `browserslist`에 맞춰 자기 런타임까지 변환한다. 87로 두면 static 블록이 87에서 읽히는 비공개 static 필드로 바뀐다.
- Tailwind v4는 `oklch`, `color-mix`, `@property`에 의존해 Chrome 111 미만에서 깨진다.

## 대안

- 기준선 108 유지, 2세대에서만 확인: 시험 기기에서 아무것도 볼 수 없다.
- 키오스크에 외부 PC를 HDMI로 연결해 최신 브라우저 사용: 현장 장비와 절차가 늘어난다.

## 영향

- Chromium 87에서 지원하지 않는 CSS/JS를 쓰지 않는다 (`.claude/rules/project-constraints.md`). 대표적으로 `:where()`, `:is()`(88), `aspect-ratio`(88), `Array.prototype.at`(92), `Object.hasOwn`(93), `structuredClone`(98), CSS `rotate`/`scale` 속성(104)이다.
- Tailwind 기본 스타일 가운데 `:where()`로 묶인 규칙이 필요하면 `src/app/globals.css`에 `:where()` 없이 다시 적는다.
- 라이브러리를 올리거나 들이면 빌드 결과(`.next/static/chunks`)에 87이 못 읽는 문법이 있는지 확인한다.
- 실기기 엔진은 배포 주소의 `/check.html`로 확인한다. React 없이 동작해 사이트 JS가 멈춰도 보인다.
