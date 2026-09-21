# 모션 규칙

이 프로젝트는 모션이 매우 많고, **TV SoC**에서 하루 종일 60fps로 돌아야 합니다.

모션이 많은 프로젝트의 실패는 대부분 **개별 컴포넌트가 각자 애니메이션을 정의**해서
타이밍이 제각각이 되고 전환 중 언마운트가 꼬이는 데서 옵니다.

## 3계층을 섞지 않습니다

| 계층 | 담당 | 유일한 구현 위치 |
| --- | --- | --- |
| 전환 | STEP ↔ STEP 화면 이동 | `components/motion/StepTransition.tsx` |
| 연출 | 반죽 믹싱, 결과 카드 등장 등 씬 단위 | `components/motion/LottieStage.tsx` 또는 Motion 시퀀스 |
| 피드백 | 버튼 탭, 선택 토글 | `components/ui/` 프리미티브 내부 |

각 STEP 컴포넌트(`features/*`)는 **화면 전환 모션을 알지 못합니다.**
STEP 안에서 페이지 진입/이탈 애니메이션을 정의하고 있으면 그것은 버그입니다 —
`StepTransition`으로 올립니다.

## 모션 토큰

애니메이션 값을 컴포넌트에 직접 쓰지 않고 `components/motion/variants.ts`에 중앙화합니다.

```
duration:  instant 120 / quick 240 / base 400 / slow 700 / scene 1200 (ms)
easing:    enter(out-expo) / exit(in-quad) / move(inOut-cubic) / bounce(spring)
```

새 값이 필요하면 토큰을 추가하고 `docs/MOTION.md`에 근거를 남깁니다.

## 성능 규칙

캔버스는 1080×1920이지만 **실제 출력은 1440×2560으로 픽셀이 1.8배 많습니다.**
래스터화·합성 비용은 출력 픽셀 기준으로 발생하고, 이게 데스크톱 GPU가 아닌 TV SoC에서 돕니다.

- 애니메이션 속성은 **`transform`과 `opacity`만**.
  `width`/`height`/`top`/`left`/`filter`/`box-shadow` 애니메이션은 거부하고 transform 기반 대안을 제시합니다.
- **동시 재생 Lottie 최대 1개.** 화면 이탈 시 인스턴스를 반드시 해제합니다
  (hot 이미지와 정반대 정책 — 그쪽은 의도적으로 상주시킵니다).
- **풀스크린 Lottie를 피합니다.** 벡터 래스터화 비용은 면적에 비례합니다.
  믹싱 모션처럼 일부만 움직이는 연출은 **필요한 영역 크기로만** 렌더하고 나머지는 정적 배경으로 둡니다.
- Lottie가 500KB를 넘으면 벡터 연산이 CPU에 몰립니다. AE 시퀀스 PNG/WebM 대체를 먼저 제안합니다.
- **`will-change`를 습관적으로 붙이지 않습니다.** 이 해상도에서 합성 레이어 1장 ≈ 14MB GPU 텍스처입니다.
  실제로 애니메이션되는 요소에만 붙이고, 끝나면 뗍니다.
- `prefers-reduced-motion`은 전시물 특성상 **의도적으로 무시**합니다(연출이 콘텐츠입니다).
  코드에 그 의도를 주석으로 남깁니다.

## 터치 환경

- **hover가 존재하지 않습니다.** hover 피드백 모션을 어포던스로 쓰지 않습니다.
  "누를 수 있음"은 정적으로 보여야 합니다. hover 전용 모션은 화면에서 영영 보이지 않는 코드입니다.
- 탭 피드백은 `pointerdown` 시점에 즉시 반응해야 합니다. 터치는 반응 지연에 민감합니다.

## STEP.3 로딩 연출의 계약

AI 응답 대기 시간을 가리는 것이 이 모션의 목적입니다. 응답이 빨라도 모션을 끊지 않습니다.

```
Promise.all([ analyze(), minDelay(ANALYSIS_MIN_DURATION_MS /* 3500 */) ])
```

분석이 실패해도 모션을 멈추지 않습니다 — 재시도 1회 후 안내와 함께 STEP.2로 복귀시킵니다.

## 검증

변경 후 **실측**합니다. DevTools Performance로 전환 구간을 녹화하되
**반드시 CPU 6x 스로틀**을 걸고 측정합니다 — 개발 맥에서 60fps인 것은 TV SoC에서 돈다는
증거가 아닙니다. 결과를 수치로 보고합니다.
