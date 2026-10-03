---
name: implement-screen
description: Figma 시안의 화면 하나를 1080x1920 스테이지 기준으로 구현하고 시안과 비교 검증합니다. 인자로 Figma 노드 id 또는 구간 이름을 받습니다.
---

# implement-screen

Figma 화면 하나를 정적 구현 → 상태 연결 → 모션 → 비교 검증 순서로 만듭니다.

## 읽을 문서

1. `.claude/rules/figma-workflow.md`
2. `.claude/rules/project-constraints.md`
3. `.claude/rules/architecture.md`
4. `.claude/rules/component-guide.md`
5. `.claude/rules/motion.md`
6. `.claude/rules/assets.md`

## Workflow

### 1단계: 시안 확인

- 인자가 노드 id면 그 프레임을, 구간 이름이면 `figma-workflow.md`의 섹션 표에서 노드를 찾습니다.
- 프레임 스크린샷과 디자인 컨텍스트를 가져옵니다.
- 같은 화면의 상태 변형 프레임과 주변 디자이너 메모를 함께 확인합니다.
- 화면 하나와 그 상태 목록, 모션 요구를 정리합니다.

### 2단계: 에셋 준비

- 필요한 이미지를 `public/assets` 규칙대로 내려받아 이름을 붙입니다.
- 이미 있는 공용 컴포넌트와 에셋을 먼저 찾아 재사용합니다.

### 3단계: 정적 구현

- `Stage` 안에 시안의 px 값 그대로 배치합니다.
- 반복 항목은 `src/data` 배열로 렌더링합니다.
- 이 단계에서는 모션을 넣지 않습니다.

### 4단계: 상태 연결

- 선택, 다음 진행, 이전 이동을 store에 연결합니다.
- 터치만으로 모든 조작이 가능한지 확인합니다.

### 5단계: 모션

- `motion.md`의 도구 선택표를 따릅니다.
- `transform`과 `opacity`만 애니메이션합니다.

### 6단계: 검증

- 개발 서버를 띄워 1080x1920 뷰포트로 캡처하고 시안과 나란히 비교합니다.
- 휴대폰 크기에서 스테이지가 잘리지 않는지 확인합니다.
- `pnpm lint`, `pnpm typecheck`, 관련 테스트를 실행합니다.

## Output

```markdown
## 화면 구현 결과

- 대상: <구간> / <Figma 노드 id>
- 구현한 상태: ...
- 넣은 모션 / 미룬 모션: ...
- 시안과 다른 점: ...
- 검증: ...
- 키오스크 실기기에서 확인이 필요한 항목: ...
```

## Rules

- 시안에 없는 화면, 문구, 기능을 만들지 않습니다.
- 시안과 다르게 구현한 부분은 숨기지 않고 보고합니다.
- 새 production dependency가 필요하면 먼저 확인을 받습니다.
- 커밋하지 않습니다.
