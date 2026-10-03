---
name: gen-test
description: Vitest + Testing Library 기준으로 컴포넌트, hook, 유틸리티 테스트를 생성합니다.
---

# gen-test

대상 파일을 읽고 현재 구현의 회귀 가능성이 있는 동작을 테스트합니다.

## 읽을 문서

1. `.claude/rules/testing.md`
2. `.claude/rules/code-quality.md`
3. `.claude/rules/verification.md`

## Workflow

### 1단계: 대상 분석

대상 파일을 읽고 public behavior를 정리합니다.

| 대상 | 확인할 것 |
| --- | --- |
| 컴포넌트 | props, 렌더링 분기, 사용자 인터랙션, 접근성 |
| hook/store | 상태 전환, parameter, side effect |
| API 함수 | request parameter, response 변환, error 처리 |
| 유틸리티 | 입력/출력, edge case |

### 2단계: 테스트 방식 결정

| 대상 | 방식 |
| --- | --- |
| 컴포넌트 | render -> userEvent -> visible output 검증 |
| hook | `renderHook` + `act` 또는 기존 hook 테스트 패턴 |
| 유틸리티 | 입력/출력 검증 |
| LLM 응답 처리 | 스키마 검증, 실패 시 대체 경로 |

### 3단계: 테스트 파일 작성

대상 파일 옆에 `.test.ts` 또는 `.test.tsx`를 둡니다.

### 4단계: 실행 및 반복

가장 좁은 테스트를 먼저 실행합니다.

```bash
pnpm test <테스트-파일-경로>
```

실패하면 원인을 읽고 테스트 또는 코드 중 잘못된 쪽을 수정합니다. 실패하는 테스트를 남기지 않습니다.

## Placement

```text
src/components/common/Stage/Stage.tsx -> src/components/common/Stage/Stage.test.tsx
src/lib/stage.ts -> src/lib/stage.test.ts
```

## Rules

- 쿼리 우선순위는 `getByRole` -> `getByLabelText` -> `getByText` -> `getByTestId`입니다.
- CSS class나 Tailwind utility 자체를 테스트하지 않습니다.
- private 구현 세부사항보다 사용자 관찰 가능 동작을 테스트합니다.
- `it()` 하나에는 동작 하나를 검증합니다.
- loading, empty, error 상태가 있는 UI는 최소 하나 이상 명시적으로 검증합니다.
- 비동기 UI는 `findBy*` 또는 `waitFor`를 사용합니다.
- 실패하는 테스트를 숨기지 않습니다.
- `pnpm test` 계열 명령만 사용합니다.
