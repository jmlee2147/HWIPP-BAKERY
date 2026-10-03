---
name: code-review
description: 변경된 코드를 프로젝트 규칙 기준으로 읽기 전용 리뷰하고, 실제 위험이 있는 finding만 보고합니다.
---

# code-review

코드를 수정하지 않고 리뷰 리포트만 출력합니다. 스타일 취향이 아니라 버그, 회귀, 유지보수 위험, 누락된 검증을 우선합니다.

## 읽을 문서

1. `AGENTS.md`
2. `.claude/rules/code-quality.md`
3. `.claude/rules/architecture.md`
4. `.claude/rules/llm.md`
5. `.claude/rules/testing.md`
6. `.claude/rules/verification.md`
7. `.claude/rules/project-constraints.md`
8. `.claude/rules/component-guide.md`
9. `.claude/rules/motion.md`
10. `.claude/rules/assets.md`

## Workflow

### 1단계: 리뷰 범위 확인

인자가 없으면 현재 worktree의 staged + unstaged diff를 리뷰합니다.

```bash
git diff --name-only
git diff --staged --name-only
git diff
git diff --staged
```

인자가 파일이면 해당 파일과 관련 diff를 리뷰합니다.
인자가 ref/branch면 `git diff <ref>...HEAD` 또는 사용자가 준 범위를 확인합니다.

### 2단계: 관련 규칙 로드

변경 파일과 관련된 규칙만 읽습니다. 읽지 않은 규칙을 근거로 단정하지 않습니다.

### 3단계: finding 작성

실제 위험이 있는 항목만 심각도순으로 출력합니다.

## Review Focus

- 실제 동작 버그 또는 회귀 가능성
- 키오스크 기준선(Chromium 108)에서 동작하지 않는 CSS/JS 사용 (`project-constraints.md`)
- 화면이 `Stage` 밖에서 뷰포트 단위나 반응형 분기로 크기를 잡는 경우
- 체험이 막힐 수 있는 경로: 실패/지연 시 대체 경로가 없는 LLM 호출, 되돌아갈 수 없는 상태
- API 키나 LLM 호출이 클라이언트 번들에 들어가는 경우
- LLM 응답을 스키마 검증 없이 화면 상태로 쓰는 경우
- `transform`/`opacity` 외 속성을 애니메이션해 키오스크에서 끊길 위험
- `any`, 불명확한 null/undefined 처리
- 터치로 조작할 수 없는 hover 전용 인터랙션
- 과도한 추상화 또는 요청 범위 밖 변경
- 테스트/검증 누락
- 컴포넌트가 과도하게 커졌거나 동일 구조의 JSX가 3회 이상 반복될 때, 분리 또는 배열+순회(map)로 정리할 수 있는지
- `architecture.md`의 import/파일 배치 규칙 위반
- 케이크 부품 조합을 데이터가 아닌 JSX 분기로 하드코딩한 경우

## Severity

| 등급 | 기준 |
| --- | --- |
| Critical | 보안 취약점, API 키 노출, 체험 플로우 중단 |
| Major | 실제 버그 가능성, 타입 안정성 문제, 접근성 주요 결함 |
| Minor | 유지보수성 저하, 제한적인 UX/성능 문제, 검증 누락 |
| Suggestion | 선택적 개선, 명확성 향상 |

## Output

```markdown
## Findings

### Major

- `src/path/file.tsx:42`
  - 문제: ...
  - 영향: ...
  - 권장: ...

## Verdict

- Request changes | Comment | Approve

## Verification Notes

- 확인한 것: ...
- 확인하지 못한 것: ...
```

- finding이 있으면 `파일:라인`, 문제, 영향, 권장 수정 방향을 포함합니다.
- finding이 없으면 명확히 "발견된 이슈 없음"이라고 말하고 남은 검증 공백만 적습니다.
- 확인하지 못한 내용은 추정이라고 표시합니다.
- 좋은 점 요약은 만들지 않습니다.
