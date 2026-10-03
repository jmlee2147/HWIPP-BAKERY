# 아키텍처 규칙

## 프로젝트 형태

Next.js App Router 기반입니다. 체험 전체는 한 페이지(`/`) 안에서 클라이언트 상태로 화면을 전환하고, 서버는 케이크 분석용 route handler만 가집니다. `/device`는 키오스크 브라우저 확인용 진단 화면으로, 체험 흐름에 속하지 않습니다. 더 강한 계층화가 필요해지기 전까지는 단순한 구조를 유지합니다.

## 체험 흐름

```text
오프닝 → 문답(관계 → 스타일 → 파티 → 맛) → 분석 및 로딩 → 결과 → 결과 수정(크기/모양/색상/장식) → 소장 및 공유
```

- 화면 전환은 URL 라우팅이 아니라 store의 단계 값으로 합니다. 새로고침이나 뒤로 가기로 중간 화면에 떨어지지 않게 하기 위해서입니다.
- 문답 답변과 케이크 구성은 하나의 store에서 관리합니다.

## 파일 배치

| 위치 | 용도 |
| --- | --- |
| `src/app` | 라우트 진입점, layout, route handler(`api`) |
| `src/components` | UI 컴포넌트 (`common` 또는 `{domain}`) |
| `src/hooks` | 커스텀 훅 (`common` 또는 `{domain}`) |
| `src/stores` | Zustand store |
| `src/lib` | 공통 유틸리티, 순수 함수 |
| `src/data` | 문답 선택지, 케이크 부품 목록 같은 정적 데이터 |
| `public/assets` | 이미지, 폰트, 효과음 |

## 도메인 폴더

- `{domain}`은 체험 구간 기준입니다: `opening`, `questions`, `analysis`, `result`, `editor`, `share`, `cake`.
- 도메인 폴더는 해당 기능 구현을 시작할 때 생성합니다. 빈 폴더를 미리 만들지 않습니다.

## Import 규칙

다른 폴더는 alias(`@/`)로, 같은 폴더 안의 파일은 상대 import로 가져옵니다.

## 경계

- `src/app`의 페이지는 컴포넌트, 훅, store를 조합합니다.
- 컴포넌트는 LLM 엔드포인트 경로를 직접 알지 않습니다. 호출은 `src/lib`의 요청 함수 하나로 모읍니다.
- `src/lib`와 `src/data`는 React 컴포넌트를 import하지 않습니다.
- 케이크 렌더링은 케이크 구성 데이터만 받아 그립니다. 문답이나 편집기 상태를 직접 읽지 않습니다.
- `"use client"`는 상태나 브라우저 API가 필요한 컴포넌트에만 붙입니다.

## 컴포넌트/훅 폴더 구조

```text
src/components/
├── common/
│   └── Stage/
│       └── Stage.tsx
└── {domain}/

src/hooks/
├── common/
└── {domain}/
```

- 컴포넌트는 `src/components/{domain}/{ComponentName}/{ComponentName}.tsx`처럼 컴포넌트별 폴더에 두고, 테스트를 쓸 때는 `.test.tsx`를 같은 폴더에 둡니다.
- barrel `index.ts`는 만들지 않습니다.
