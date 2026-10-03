# 프로젝트 제약 조건

이 문서는 프로젝트에서 항상 지켜야 하는 금지/제약 조건을 정의합니다.

## 구동 환경

- 1차 대상은 전시장의 세로 터치 키오스크(LG StanbyME 2, 2560x1440 패널을 세로로 사용)입니다.
- 2차 대상은 관람객 개인 휴대폰 브라우저입니다. 같은 배포 주소로 접속합니다.
- 키오스크 브라우저 기준선은 **Chromium 108**로 잡습니다. 근거는 `.claude/decisions/records/002-kiosk-browser-baseline.md`입니다.
- 실기기의 실제 엔진 버전과 CSS 지원 범위는 배포 주소의 `/device` 화면으로 확인합니다.

## 브라우저 호환

- Chromium 108에서 동작하지 않는 기능을 쓰지 않습니다. 대표적으로 `oklch()`, `color-mix()`, CSS nesting, `@starting-style`, View Transitions(문서 간), scroll-driven animations, `linear()` easing이 해당합니다.
- `package.json`의 `browserslist`를 임의로 올리지 않습니다.
- 새 CSS/JS 기능을 쓰기 전에 Chrome 108 지원 여부를 확인합니다.

## 화면 크기

- 모든 화면은 1080x1920 고정 좌표계로 만들고 `Stage`(`src/components/common/Stage`)가 뷰포트에 맞춰 배율을 정합니다.
- 화면 안에서 `vw`, `vh`, 미디어 쿼리, 반응형 분기로 크기를 잡지 않습니다. 시안의 px 값을 그대로 씁니다.
- hover에만 의존하는 인터랙션을 만들지 않습니다. 터치로 같은 동작이 가능해야 합니다.

## 무인 운영

- 현장에서 사람이 고쳐줄 것을 전제한 설계를 하지 않습니다. 운영자는 안전망이지 설계 입력이 아닙니다.
- 체험이 멈출 수 있는 지점(네트워크 실패, LLM 지연/오류, 에셋 로드 실패, 관람객 이탈)에는 자동 복구 경로를 둡니다.
- 일정 시간 입력이 없으면 처음 화면으로 돌아가야 합니다.
- 관리 화면이나 수동 절차가 필요해 보이면 먼저 자동화로 풀 수 있는지 따집니다.

## 패키지 매니저

- `pnpm`만 사용합니다.
- `npm install`, `yarn install`, `npm run`, `yarn` 명령을 사용하지 않습니다.

## Tailwind CSS

- Tailwind CSS v3.4를 PostCSS 플러그인 방식으로 사용합니다. 설정은 `tailwind.config.ts`입니다.
- Tailwind v4로 올리지 않습니다. v4는 Chrome 111 이상을 요구해 키오스크 기준선과 맞지 않습니다.

## LLM

- API 키와 LLM 호출은 서버(`src/app/api`)에만 둡니다. 세부 규칙은 `.claude/rules/llm.md`를 따릅니다.

## 디렉터리 구조

- `src/services`, `src/views`, `src/pages` 같은 새 구조를 임의로 만들지 않습니다.
- 파일 배치는 `.claude/rules/architecture.md`를 따릅니다.

## 의존성

- production dependency 추가 전에는 확인을 받습니다.
- three.js 등 WebGL 라이브러리를 도입하지 않습니다. 근거는 `.claude/decisions/records/003-no-threejs.md`입니다.

## 표기

- 코드 주석, 문서, 커밋 메시지, 로그에 이모지를 쓰지 않습니다. 화면에 실제로 렌더링되는 디자인 요소만 예외입니다.
