# 프로젝트 지침 (CLAUDE.md)

이 파일은 Claude Code 에이전트의 프로젝트 개요 및 설정 파일입니다.

## 사고 방식

- 사용자가 다르게 요청하지 않으면 한국어로 사고하고 응답합니다.
- 코드 식별자(변수/함수/파일명), 터미널 명령어, 라이브러리·패키지 고유명사를 제외하고 영어 문장을 한국어 응답에 섞지 않습니다.
- 구현 전에 관련 파일과 지침을 먼저 확인합니다.
- 작업은 작고 검증 가능한 단위로 나눕니다.

## 프로젝트 요약

**HWIPP BAKERY** — 졸업작품전시회에 설치되는 키오스크 체험물입니다.

관람객이 "누구에게 줄 케이크인가"를 문답으로 입력하면, AI가 관계성 데이터를 케이크
레시피(컬러·디자인·맛·레터링)로 변환해 보여주고, QR로 소장·확산시킵니다.

```
스탠바이미2 webOS 24 브라우저 ──Wi-Fi──▶ Vercel 배포 URL
  └ 렌더 + 터치 전부 자기가 처리            └ API · 결과 저장소
```

전시장에 컴퓨터를 두지 않습니다. 개발용 맥은 개발 장비일 뿐입니다.
설계 근거와 대안 검토는 `docs/ARCHITECTURE.md`를 참고합니다.

### 이 프로젝트를 지배하는 것

- **모션이 매우 많고 이미지가 매우 많습니다.** 일반 웹 상식이 자주 틀립니다.
- **렌더링이 TV SoC에서 돕니다.** 데스크톱 GPU 기준으로 예산을 잡으면 안 됩니다.
- **실서비스 기준으로 만듭니다.** 당일 운영자는 디자이너고 개발자는 현장에 없을 수 있습니다.
  사람이 고쳐줄 것을 전제한 설계는 반려합니다.

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS **v3** (v4 금지 — `.claude/rules/project-constraints.md`)
- **UI Motion**: Motion (`motion`)
- **Graphic Motion**: Lottie (`@lottiefiles/dotlottie-react`)
- **Client State**: Zustand
- **Validation**: Zod
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) / `claude-opus-5`
- **Deploy / Store**: Vercel + Vercel KV
- **Test**: Vitest
- **Runtime**: Node 22 (`.nvmrc`) · **Package Manager**: pnpm 12

## 주요 명령어

- `pnpm dev`: 개발 서버 실행
- `pnpm build`: 프로덕션 빌드
- `pnpm lint`: 코드 린트 검사
- `pnpm test`: 테스트 실행
- `pnpm typecheck`: 타입 검사
- `pnpm check:assets`: 에셋 예산 및 매핑↔에셋 정합성 검사 (5단계에서 추가 예정)

> Node 버전은 `.nvmrc`에 고정되어 있습니다. `nvm use`로 맞추고 작업합니다.
> pnpm은 `package.json`의 `packageManager` 필드가 corepack으로 고정합니다.

## 규칙 로딩

공통 개발 규칙 및 지침은 `.claude/rules/` 및 `AGENTS.md`를 따릅니다.

- **Tier 1 (항상)**: `working-rules.md`, `project-constraints.md`
- **Skills**: `.claude/skills/` — `figma-to-component`, `asset-cleanup`, `code-review`, `commit-kr`, `create-pr`
- **Tier 2 (필요 시)**: `architecture.md`, `component-guide.md`, `state-machine.md`, `motion.md`,
  `assets.md`, `ai-pipeline.md`, `operations.md`, `testing.md`, `commit-convention.md`
