# 코드 스타일 규칙

## TypeScript

- 문답 답변, 케이크 구성, LLM 응답에는 명시적인 도메인 타입을 씁니다.
- 불필요한 `any`를 피하고, 실제로 형태를 모를 때는 `unknown`을 사용합니다.
- 재사용되기 전까지 타입은 기능 근처에 둡니다.
- UI에서 아직 쓰지 않는 필드까지 과하게 모델링하지 않습니다.

## React

- 함수 컴포넌트를 사용합니다.
- 재사용되거나 의미 있는 복잡도가 생긴 뒤에 컴포넌트를 분리합니다.
- 화면 사이에 공유되는 상태는 Zustand store에, 한 화면 안의 일시 상태는 `useState`에 둡니다.

## 네이밍

- 컴포넌트 파일: PascalCase, 예: `RelationCard.tsx`
- 훅 파일: `use` 접두사의 camelCase, 예: `useIdleReset.ts`
- store 파일: `use` 접두사와 `Store` 접미사, 예: `useExperienceStore.ts`
- 테스트 파일: 대상 파일과 같은 위치에 `.test.ts` 또는 `.test.tsx`

## 스타일링

- Tailwind `className`을 사용합니다.
- 시안의 px 값은 arbitrary value(`w-[945px]`)로 그대로 씁니다. 화면은 1080x1920 고정 좌표계입니다.
- 반복되는 색상과 글꼴은 `tailwind.config.ts` 토큰으로 올립니다. 현재 토큰은 아래 표와 같습니다.
- inline style은 런타임에 계산되는 값(배율, 케이크 부품 위치)에만 씁니다.
- 이미지는 `<img>`로 씁니다. 고정 스테이지에 로컬 SVG/PNG를 시안 크기 그대로 겹치므로 `next/image`의 최적화가 필요 없고, Biome의 `noImgElement` 규칙은 꺼 두었습니다.

### 색상 토큰

| 토큰 | 값 | Figma 스타일 | 용도 |
| --- | --- | --- | --- |
| `cocoa` | `#5b4a43` | 색상 2 | 본문 글자 |
| `taupe` | `#bfb1a8` | 색상 | 보조 글자, 장식 |
| `candy` | `#ff9ccf` | 색상 3 | 강조 분홍, 진행 바 채움 |
| `blush` | `#fff2f9` | 메인2 | 연분홍 바탕 |
| `mist` | `#ebebed` | 메인1 | 연회색 바탕 |
| `mint` | `#f1ffff` | - | 진행 바 바탕, 민트 버튼 |
| `petal` | `#ffcbe7` | - | 분홍 버튼 |
| `chocolate` | `#644542` | - | 말풍선 하단 띠 |
| `cream` | `#fff9fc` | - | 말풍선 바탕 |

- 본문 글자 크기는 `text-body`(34.73px, 줄 높이 34px, 자간 -0.87px)입니다.
- 창 그림자는 `drop-shadow-window`입니다.
- 한 곳에서만 쓰는 색은 토큰으로 올리지 않고 arbitrary value로 둡니다. 두 곳 이상에서 쓰이면 토큰으로 올리고 이 표에 추가합니다.

## 주석

- 코드 주석과 테스트 이름에 "시안"이라는 말과 Figma 노드 id를 쓰지 않습니다. 코드가 무엇을 왜 하는지만 적습니다.
- 디자인 출처는 이슈와 PR 본문에 적습니다.

## 포맷과 린트

- Biome를 사용합니다. `pnpm format`, `pnpm lint`
