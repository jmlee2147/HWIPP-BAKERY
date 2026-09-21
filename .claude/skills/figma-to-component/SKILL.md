---
name: figma-to-component
description: Figma 노드를 이 프로젝트의 컴포넌트로 옮깁니다. 값을 추측하지 않고 실측값만 씁니다.
---

# figma-to-component

Figma 디자인을 `components/ui/` 컴포넌트로 옮깁니다.
**이 프로젝트에서 실제로 저지른 실수들을 막는 것이 이 스킬의 목적입니다.**

## 읽을 문서

1. `.claude/rules/component-guide.md`
2. `.claude/rules/architecture.md` (고정 캔버스)
3. `.claude/rules/assets.md`
4. `.claude/rules/project-constraints.md`

## Workflow

### 1단계: 노드 좁히기

`get_metadata` 로 구조만 먼저 봅니다. 페이지 전체를 뜨면 1MB가 넘어 컨텍스트를 낭비합니다.
대상 노드 id를 확정한 뒤 `get_design_context` 를 그 노드에만 호출합니다.

### 2단계: 실측값 수집

`get_design_context` 응답에서 그대로 가져옵니다. **계산하거나 반올림하지 않습니다.**

- inset 퍼센트 (`inset-[35.64%_3.24%_28.51%_5.98%]`)
- 크기 (`w-[957px] h-[133.15px]`)
- 색상 hex, 그림자, 폰트 크기·자간·행간

### 3단계: 노드 이펙트 확인

**Figma 그림자·블러는 SVG 로 내보내지지 않습니다.** 에셋에는 모양만 들어옵니다.
렌더 이미지에 그림자가 보이는데 SVG 에 없으면, **Figma 속성 패널의 Shadows and blurs 값을
사용자에게 물어서** CSS 로 옮깁니다. 추측하지 않습니다.

`box-shadow` 와 `filter: drop-shadow` 는 blur 기준이 다릅니다 — Figma radius 30 은
box-shadow 30px, drop-shadow 15px 입니다.

### 4단계: 에셋 내려받고 정리

`.claude/rules/assets.md` 의 정리 절차를 따릅니다. 중복 검사 → 병합 → 보고.

**SVG 내부 값이 전부 기존 토큰이면 이미지를 쓰지 않고 div 로 그립니다.**
(`StepDots` 가 그 예 — 10장 받을 뻔했으나 0장으로 끝냈습니다.)

### 5단계: 구현

- 위치는 **inset 퍼센트를 그대로** 씁니다. px 로 환산하면 반올림 오차가 쌓입니다.
- **위치는 wrapper div 가, 채움은 img 가** 담당합니다.

```tsx
<div className="absolute" style={box}>
  <img className="block h-full w-full max-w-none" />
</div>
```

절대 위치 요소에 inset 과 `w-full h-full` 을 같이 주면 크기 선언이 이겨서
**요소가 부모 전체 크기가 됩니다.** Tailwind preflight 의 `img { max-width: 100% }`
때문에 `max-w-none` 도 필요합니다.

- 색상은 토큰만 씁니다. 디자인에 새 색이 나오면 `app/globals.css` 와 `tailwind.config.ts`
  양쪽에 추가하고, Figma 변수명을 주석으로 남깁니다.
- 변형은 객체 맵으로 관리합니다 (`component-guide.md`).

### 6단계: 검증

```bash
pnpm typecheck && pnpm lint && pnpm build
```

그다음 `app/(kiosk)/page.tsx` 에 임시로 올려 `pnpm dev --port 3001` 로 눈으로 확인합니다.
**확인 전에 완료라고 보고하지 않습니다.** 확인이 끝나면 임시 배치를 제거합니다.

## 자주 틀린 것

| 증상 | 원인 |
| --- | --- |
| 이미지가 거대해짐 | 절대 위치 요소에 inset + `w-full h-full` 동시 지정 |
| 크기가 미묘하게 안 맞음 | inset 퍼센트를 px 로 손계산 |
| 그림자가 없음 | Figma 노드 이펙트는 SVG 에 안 들어옴 |
| 같은 파일이 여러 개 | Figma 는 인스턴스마다 내보냄. `url(#...)` 까지 정규화해 비교 |

## 하지 않는 것

- Figma 에 쓰기 (`use_figma`). 디자인이 원본이고 코드가 사본입니다.
- 값 추측. 모르면 사용자에게 Figma 속성 패널 값을 요청합니다.
- 커밋 (`commit-convention.md` — 요청받았을 때만).
