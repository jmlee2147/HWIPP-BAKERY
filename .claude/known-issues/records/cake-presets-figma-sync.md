# 완성 케이크 예시를 Figma에 맞추며 생긴 차이

## 무엇이 다른지

- 완성 케이크 예시는 2026-10-25에 Figma 케이크 디자인 섹션(`89:39912`, 수정 시각 2026-10-21)에 맞춰 97개가 되었습니다. 45개를 새로 넣고(`cake-55`~`cake-99`), 디자이너가 고친 4개(`cake-04`, `cake-33`, `cake-42`, `cake-54`)를 바꿨고, Figma에서 사라진 2개(`cake-12`, `cake-25`)를 뺐습니다. 번호는 다시 매기지 않아 12번과 25번이 비어 있습니다.
- 새 예시의 장식 자리와 크기는 Figma 레이어 좌표를 판 좌표로 옮겨 계산했습니다. 기존 예시와 짝지어 배운 변환이라 몇 px 어긋날 수 있습니다. Figma 렌더와 나란히 놓고 한 번씩 확인했습니다.
- 몇몇 원본 그림은 해상도가 낮습니다. 네모 코팅 3종(`coating-*-square`, 519x449)과 곰 토퍼 2종(`topper-bear-groom`, `topper-bear-bride`, 79x102)은 케이크 위 크기보다 작아 조금 흐리게 보입니다.
- 고마워 글자 2종(`lettering-gomawo-black`, `lettering-gomawo-pink`), 연보라 거베라(`flower-gerbera-lilac`), 갈색 Happy Birthday(`lettering-happy-birthday-brown`)는 Figma에서 마스크나 색 필터를 걸어 만든 것이라 원본 그림이 따로 없습니다. Figma에서 내보낸 그림을 Display P3로 바꿔 넣어 다른 부품보다 색이 조금 다를 수 있습니다.
- `cake-95`(응원과 축하 글자가 함께 있고 장식이 6개)는 어느 파티 테마의 조건에도 맞지 않아 분석 결과로 나오지 않습니다(`.claude/decisions/records/004-cake-analysis-rules.md`).
- 새 예시에만 쓰인 장식 가운데 과자 4종, 흰 백합, 연보라 거베라, 새 글자 3종은 2026-10-25에 결과 수정 화면의 목록에 넣었습니다(#64). 곰 토퍼 2종, 분홍 매듭 리본, 갈색 Happy Birthday는 시안의 부품 프레임에 없어 예시에 얹힌 채로만 보입니다.

## 어디서 확인했는지

- Figma 케이크 디자인 섹션 `89:39912`, REST API `/v1/files/OiEpho0cSmDZ8DA0M1RV2w/nodes?ids=89:39912`
- `src/data/cakePresets.ts`, `src/data/cake.ts`, `public/assets/cake-parts/`
- 개발 서버의 `/dev/cake`

## 왜 지금 우리 코드에서 고치면 안 되는지

해상도와 원본 그림은 받은 파일의 한계입니다. 결과 수정 화면의 목록은 시안의 부품 프레임에 있는 것만 그 순서대로 넣습니다.

## 언제/누가 해결해야 하는지

- 디자이너가 고해상도 원본이나 마스크와 필터를 적용한 원본을 주면 같은 이름으로 바꿉니다.
- Figma의 예시가 다시 바뀌면 같은 방식으로 다시 맞춥니다. 커밋 직전에 섹션의 수정 시각을 확인합니다.
- 부품 프레임에 곰 토퍼, 매듭 리본, 갈색 Happy Birthday가 추가되면 `src/data/editor.ts`의 목록에 넣습니다.
