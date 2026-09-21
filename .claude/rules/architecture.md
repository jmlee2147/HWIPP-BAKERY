# 아키텍처 규칙

## 프로젝트 형태

Next.js 15 App Router 앱입니다. 화면은 5개뿐이지만 각 STEP이 *상태 + 모션 + 데이터 스키마*를
함께 가지므로, 그 셋을 한곳에 두는 `features/` 구조를 씁니다.

## 고정 캔버스

표시 기기가 하나뿐입니다. 반응형 대신 **디자인 해상도 고정 + 전체 scale**을 씁니다.

```
캔버스 1080×1920 고정 (Figma 좌표 그대로)
  → 루트에 transform: scale( min(innerWidth/1080, innerHeight/1920) )
```

세로만 기준으로 하면 뷰포트가 정확히 9:16이 아닐 때 가로가 넘칩니다.
**전체화면 진입 전 idle 화면에서는 주소창이 세로를 깎아 비율이 어긋나므로**,
두 축 중 작은 값을 써서 항상 화면 안에 들어오게 합니다.
비율이 정확히 9:16이면 두 값이 같아 결과는 동일합니다.
구현은 `lib/config/canvas.ts`의 `getCanvasScale()`에 있습니다.

- Figma px 좌표를 환산 없이 그대로 씁니다.
- 브레이크포인트, 미디어 쿼리, 반응형 유틸리티를 쓰지 않습니다.
- flex/grid는 레이아웃 의도를 표현할 때만 쓰고, 크기 적응을 위해 쓰지 않습니다.
- Figma의 Auto Layout은 고정 간격으로 그대로 번역합니다.
- **배율을 하드코딩하지 않습니다.** 런타임 계산이어야 뷰포트가 1080이든 1440이든 동작합니다.

아트보드가 1080×1920이 아니거나 9:16이 아니면 좌표를 그대로 쓸 수 없습니다.
임의로 환산하지 말고 디자인 쪽 정리가 먼저입니다 — 그 사실을 보고하고 멈춥니다.

## 파일 배치

| 위치 | 용도 |
| --- | --- |
| `app/(kiosk)/` | 키오스크 레이아웃 (풀스크린·커서 숨김·유휴 리셋) |
| `app/r/[resultId]/` | 모바일 공유·다운로드 페이지 (QR 착지점) |
| `app/debug/` | 설치 시 1회용 하드웨어 확인 페이지 (개발자 전용) |
| `app/api/` | Route Handler — `analyze`, `result`, `og`, `heartbeat`, `log` |
| `features/{step}/` | STEP별 상태 + 스키마 + 화면 |
| `components/motion/` | 모션 프리미티브 (`.claude/rules/motion.md`) |
| `components/ui/` | 버튼·카드 등 재사용 UI |
| `lib/session/` | 세션 스토어 + 유휴 타임아웃 |
| `lib/assets/` | 프리로더·매니페스트 |
| `lib/claude/` | 프롬프트·스키마·클라이언트 |
| `lib/mapping/` | 결정적 매핑 테이블 (컬러/맛) — AI 밖 로직 |
| `public/img/`, `public/lottie/`, `public/fonts/` | 에셋 |
| `types/` | 도메인 타입 |

`features/`는 `target-select`, `questionnaire`, `analysis`, `result`, `share` 다섯 개입니다.
빈 폴더를 미리 만들지 않습니다.

## 경계

- `features/*`는 컴포넌트, 훅, API 호출을 조합할 수 있습니다.
- **각 STEP 컴포넌트는 화면 전환 모션을 알지 못합니다.** 전환은 `StepTransition`이 전담합니다.
- 컴포넌트가 API 경로를 직접 알게 하지 않습니다.
- `lib/*` 순수 로직은 React를 import하지 않습니다.
- 상태는 `lib/session`의 단일 스토어에만 둡니다. STEP별 로컬 상태를 만들지 않습니다.

## Import 규칙

가독성이 좋아지는 경우 alias(`@`, `@lib`, `@components`, `@features`)를 사용하고,
같은 폴더 안의 파일은 상대 import를 우선합니다.

## 데이터 패칭 — 서버 상태 라이브러리를 쓰지 않습니다

일반적인 프론트엔드 프로젝트와 다른 판단이므로 근거를 남깁니다.

| 라이브러리 | 쓰지 않는 이유 |
| --- | --- |
| **TanStack Query** | 서버 상태가 사실상 없습니다. 한 세션에 `/api/analyze` 1회, `/api/result` 1회뿐이고 재조회·캐싱·무효화가 일어나지 않습니다. 세션이 끝나면 데이터도 버립니다 |
| **React Hook Form** | 문답이 선택지 탭 기반이라 폼 검증·필드 에러 매핑이 필요 없습니다. 값은 세션 스토어에 직접 들어갑니다 |

서버 호출은 `lib/` 아래 요청 함수로 두고, 컴포넌트가 엔드포인트 경로를 직접 알지 못하게 합니다.
응답은 Zod로 검증합니다(`ai-pipeline.md`).

**요구사항이 바뀌어 재조회·낙관적 업데이트가 필요해지면 이 판단을 다시 합니다.**
지금 넣으면 한 번 쓰고 버리는 추상화입니다.

## 배포 구조

앱은 Vercel에 배포되고 전시장 기기는 URL에 접속만 합니다. **전시장에 서버를 두지 않습니다.**

- QR 공유 페이지가 관람객 휴대폰에서 열려야 하므로 공개 URL은 어차피 필요합니다.
- 로컬 서버를 둬도 와이파이가 죽으면 똑같이 멈추므로 실익이 거의 없습니다.
- preview 환경은 **KV 네임스페이스를 production과 분리**합니다.

---

## 코드 스타일

### TypeScript

- `strict`를 켜고 씁니다.
- 외부 경계(AI 응답, KV 레코드, 요청 바디, 환경변수)는 **Zod로 런타임 검증**합니다.
  타입은 컴파일 타임에만 존재합니다 (`.claude/rules/ai-pipeline.md`).
- 불필요한 `any`를 피하고, 실제로 형태를 모를 때는 `unknown`을 사용합니다.
- 재사용되기 전까지 타입은 기능 근처에 둡니다. 공용 도메인 타입만 `types/`에 둡니다.

### React

- 함수 컴포넌트를 사용합니다.
- `features/*`의 STEP 컴포넌트는 조합과 데이터 흐름에 집중합니다.
- 재사용되거나 의미 있는 복잡도가 생긴 뒤에 컴포넌트를 분리합니다.
- 상태는 `lib/session`의 단일 스토어에 둡니다. STEP별 로컬 상태를 만들지 않습니다.

### 네이밍

- 컴포넌트 파일: PascalCase, 예: `StepTransition.tsx`
- 훅 파일: `use` 접두사의 camelCase, 예: `useIdleTimeout.ts`
- 테스트 파일: 대상 파일과 같은 위치에 `.test.ts` 또는 `.test.tsx`
- 에셋 파일: 매핑 키와 일치, 예: `cake_{design}_{color}.webp`

### 스타일링

- Tailwind `className`을 사용합니다. **v3 문법만** 씁니다.
- inline style은 피합니다.
- 색상·간격은 `app/globals.css`의 CSS 변수(디자인 토큰)를 우선 사용합니다.
- 애니메이션 값은 `components/motion/variants.ts`에만 둡니다.

### 상수

- 매직넘버를 쓰지 않습니다. 타임아웃·예산·배율은 전부 상수 또는 환경변수로 둡니다.
- 예: `KIOSK_IDLE_TIMEOUT_MS`, `ANALYSIS_MIN_DURATION_MS`, `SHARE_IDLE_TIMEOUT_MS`

### 정리

- 죽은 코드·주석 처리된 코드는 머지하지 않습니다. git이 기억합니다.
- TODO는 이슈로 남깁니다. 코드에 남기려면 `// TODO(#12):`처럼 추적 가능하게 씁니다.
