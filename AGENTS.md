<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## HWIPP BAKERY 에이전트 지침

이 파일은 AI 코딩 에이전트의 진입점입니다. 프로젝트 공통 규칙과 skill 위치를 안내합니다.

### 프로젝트

전시용 인터랙티브 웹 작품입니다. 관람객이 선물할 사람에 대한 문답에 답하면 맞춤 케이크가 만들어지고, 직접 수정한 뒤 소장하거나 공유합니다. 세로 터치 키오스크에서 무인으로 구동되고 관람객 휴대폰에서도 열립니다.

### 사고 방식

- 사용자가 다르게 요청하지 않으면 한국어로 사고하고 응답합니다.
- 코드 식별자(변수/함수/파일명), 터미널 명령어, 라이브러리·패키지 고유명사를 제외하고 영어 문장을 한국어 응답에 섞지 않습니다.
- 구현 전에 관련 파일과 지침을 먼저 확인합니다.
- 작업은 작고 검증 가능한 단위로 나눕니다.
- `pnpm`만 사용하고 `npm`/`yarn`은 사용하지 않습니다.
- 기존 사용자 변경을 보존하고 관련 없는 작업을 되돌리지 않습니다.
- 사용자가 요청하기 전에는 커밋하지 않습니다.
- 주석, 문서, 커밋 메시지에 이모지를 쓰지 않습니다.
- 검증 결과와 검증하지 못한 항목을 최종 보고에 명시합니다.

### 규칙 로딩

#### Tier 1: 코드 변경 시 항상 로드

| 파일 | 목적 |
| --- | --- |
| `.claude/rules/code-quality.md` | 코드 품질 원칙 |
| `.claude/rules/project-constraints.md` | 구동 환경, 브라우저 기준선, 금지/제약 조건 |
| `.claude/rules/workflow.md` | 기본 inspect-edit-verify 작업 흐름 |
| `.claude/rules/verification.md` | 검증 명령 선택 기준 |

단순 질문이나 설명 요청에서는 이 `AGENTS.md`만으로 답합니다.

#### Tier 2: 작업에 필요한 경우에만 로드

| 작업 | 로드할 문서 |
| --- | --- |
| 파일 배치, import, 구조 판단 | `.claude/rules/architecture.md` |
| TypeScript, React, 네이밍, 스타일 판단 | `.claude/rules/code-style.md` |
| UI 컴포넌트 생성 또는 수정 | `.claude/rules/component-guide.md` |
| Figma 시안 조회, 화면 구현 | `.claude/rules/figma-workflow.md` |
| 애니메이션, 화면 전환, 효과음 | `.claude/rules/motion.md` |
| 이미지, 폰트, 케이크 부품 작업 | `.claude/rules/assets.md` |
| 케이크 분석, LLM 호출, route handler | `.claude/rules/llm.md` |
| 테스트 추가 또는 수정 | `.claude/rules/testing.md` |
| PR/커밋 문구 작성 | `.claude/rules/workflow.md`, `.claude/rules/commit-convention.md` |
| 구조, 라이브러리, 규칙 변경 결정 | `.claude/rules/decisions.md` |
| 외부 요인 이슈 기록 | `.claude/rules/known-issues.md` |

### Skills

| Skill | 용도 |
| --- | --- |
| `implement-screen` | Figma 화면 하나를 시안대로 구현하고 비교 검증 |
| `code-review` | 변경 코드 리뷰 |
| `gen-test` | Vitest + Testing Library 테스트 생성 |
| `commit-kr` | 한국어 커밋 메시지 제안 |
| `create-pr` | PR 제목과 본문 초안 작성 |
| `refactor` | 동작 변경 없는 리팩터링 후보 분석과 적용 |

Skill 파일은 `.claude/skills/<skill-name>/SKILL.md`에 있습니다.

### 기록

- 결정 기록: `.claude/decisions/records/`
- 외부 요인 이슈: `.claude/known-issues/records/`

### 금지 패턴

- 모든 규칙 파일을 기본으로 로드하지 않습니다. Tier 기준을 따릅니다.
- Chromium 108에서 동작하지 않는 CSS/JS를 쓰지 않습니다.
- Tailwind v4로 올리거나 v4 문법을 섞지 않습니다.
- 화면 안에서 뷰포트 단위나 반응형 분기로 크기를 잡지 않습니다.
- API 키나 LLM 호출을 클라이언트 코드에 두지 않습니다.
- three.js 등 WebGL 라이브러리, UI 라이브러리, 다른 패키지 매니저를 도입하지 않습니다.
- 현장 운영자가 고쳐줄 것을 전제한 설계를 하지 않습니다.
