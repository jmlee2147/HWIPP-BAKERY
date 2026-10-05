@AGENTS.md

# 프로젝트 지침 (CLAUDE.md)

## 프로젝트 요약

HWIPP BAKERY는 전시용 인터랙티브 웹 작품입니다. 흐름은 오프닝 → 문답(관계, 스타일, 파티, 맛) → 분석 및 로딩 → 결과 → 결과 수정 → 소장 및 공유입니다. 시안은 1080x1920 세로 고정이며 `Stage` 컴포넌트가 뷰포트에 맞춰 배율을 정합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4
- **Motion**: motion (`motion/react`), CSS keyframes
- **Client State**: Zustand
- **Validation**: Zod
- **LLM**: 사용하지 않음. 케이크 분석은 규칙 기반 (`.claude/decisions/records/004-cake-analysis-rules.md`)
- **Lint/Format**: Biome
- **Test**: Vitest, Testing Library, happy-dom
- **Package Manager**: pnpm
- **배포**: Vercel

## 주요 명령어

- `pnpm dev`: 개발 서버 실행
- `pnpm build`: 프로덕션 빌드
- `pnpm lint`: 린트와 포맷 검사
- `pnpm format`: 포맷 적용
- `pnpm typecheck`: 타입 검사
- `pnpm test`: 테스트 실행

## 디자인 소스

Figma 파일 키 `OiEpho0cSmDZ8DA0M1RV2w`, 시안 페이지 `1:77703`. 섹션별 노드 id는 `.claude/rules/figma-workflow.md`에 있습니다.
