# 폰트

Figma 디자인이 쓰는 폰트 2종. **woff2로 통일**되어 있다.

| 파일 | Figma 이름 | 용도 | 크기 |
| --- | --- | --- | --- |
| `pf-stardust-bold.woff2` | `PF Stardust` Bold | 본문·대화·선택지 (한글) | 69 KB |
| `starshines.woff2` | `Starshines` | 스텝 라벨 등 영문 장식 | 12 KB |

`app/fonts.css` 에서 `@font-face` 로 로드한다.

## 서브셋하지 않는다

합쳐 81 KB라 서브셋 이득이 거의 없고, **AI가 관계 한줄평·레터링 텍스트를 생성**하므로
어떤 글자가 화면에 나올지 미리 알 수 없다. 서브셋하면 빠진 글자가 두부(□)로 뜬다.
**서브셋 제안이 올라오면 이 문단으로 반박한다.**

## 라이선스 — 확인 필요

폰트 메타데이터상 **둘 다 "All Rights Reserved"** 이고 웹 임베딩 허용 여부가 명시되어 있지 않다.
이 앱은 공개 URL로 배포되므로 폰트 파일이 서버에 올라가고 브라우저가 내려받는다.
= **웹폰트 임베딩**에 해당하며, 개인 사용 허가와는 별개 권한인 경우가 많다.

| 폰트 | 저작권 | 문의처 |
| --- | --- | --- |
| PF Stardust | © Pinnata, 2018 | campanula913@naver.com |
| Starshines | © Darrell Flood, 2023 | — |

**확인 전에도 그대로 사용한다.** 디자인의 분위기가 이 폰트에 크게 의존하므로
시스템 폰트로 대체해 두면 화면을 제대로 판단할 수 없다.
확인 결과 불가로 밝혀지면 그때 무료 웹폰트로 교체한다.

## 원본에서 다시 만들기

원본은 저장소에 두지 않는다 (woff2가 완전한 폰트라 되돌릴 수 있다).

```bash
pip3 install --user "fonttools[woff]"
python3 - <<'PY'
from fontTools.ttLib import TTFont
f = TTFont("원본.ttf"); f.flavor = "woff2"; f.save("public/fonts/이름.woff2")
PY
```
