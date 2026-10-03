# 002. 키오스크 브라우저 기준선

## 상태

- Accepted (실기기 확인 전)

## 맥락

키오스크는 LG StanbyME 2입니다. 제품 사양상 webOS 24를 탑재합니다. webOS TV 24의 웹 엔진은 Chromium 108로 알려져 있으나, 이 저장소에서 실기기로 확인한 값은 아닙니다. Tailwind CSS v4와 Next.js 16 기본 browserslist는 Chrome 111 이상을 요구합니다.

## 결정

브라우저 기준선을 Chromium 108로 잡습니다. Tailwind CSS는 v3.4를 쓰고, `package.json`의 `browserslist`에 `chrome 108`을 명시합니다.

## 근거

- 기준선을 낮게 잡으면 실기기 엔진이 더 최신이어도 문제가 없습니다. 반대로 잡으면 전시 직전에 스타일이 깨진 것을 발견하게 됩니다.
- Tailwind v4는 `oklch`, `color-mix`, `@property`에 의존해 Chrome 111 미만에서 색상과 일부 유틸리티가 깨집니다.

## 대안

- Tailwind v4 유지 후 실기기에서 확인: 깨질 경우 되돌리는 비용이 일정에 비해 큽니다.
- 키오스크에 외부 PC를 HDMI로 연결해 최신 브라우저 사용: 현장 장비와 절차가 늘어납니다.

## 영향

- Chromium 108에서 지원하지 않는 CSS/JS를 쓰지 않습니다 (`.claude/rules/project-constraints.md`).
- 배포 후 키오스크에서 `/device` 화면을 열어 실제 Chromium 버전을 확인하고 이 문서의 상태를 갱신합니다. 실제 버전이 111 이상이면 기준선 상향을 다시 검토할 수 있습니다.
