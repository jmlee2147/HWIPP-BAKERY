# 003. three.js 미도입

## 상태

- Accepted

## 맥락

시안에 카드 뒤집기, 캘린더 그리드 확대/축소 이동, 컨페티, 회전하는 로딩 케이크 같은 모션이 있어 three.js 도입을 검토했습니다.

## 결정

three.js를 포함한 WebGL 라이브러리를 도입하지 않습니다.

## 근거

- 카드 뒤집기는 CSS 3D transform(`rotateY`, `backface-visibility`, `perspective`)으로 구현되며 Chromium 108에서 지원됩니다.
- 그리드 확대/이동은 2D `transform`의 scale과 translate 조합입니다.
- 케이크와 장식 에셋은 전부 2D PNG입니다. 3D 모델이 없어 WebGL로 얻는 것이 없습니다.
- 키오스크는 TV급 칩셋이라 WebGL 컨텍스트와 텍스처 메모리가 부담이고, 번들도 수백 KB 늘어납니다.

## 대안

- three.js + React Three Fiber: 위 근거로 선택하지 않았습니다.
- 컨페티만 2D canvas 파티클로 처리: 필요 시 소형 라이브러리 또는 직접 구현으로 충분합니다.

## 영향

- 모션 도구 선택은 `.claude/rules/motion.md`를 따릅니다.
- 케이크를 실제 3D로 돌려 보는 요구가 시안에 추가되면 이 결정을 다시 검토합니다.
