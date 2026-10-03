# 에셋 규칙

## 위치

```text
public/assets/
├── cake/         # 케이크 부품 (형태, 색상, 장식)
├── characters/   # 캐릭터 프레임
├── backgrounds/  # 배경 이미지
├── ui/           # 버튼, 카드, 프레임 등 화면 부품
├── fonts/        # 웹폰트
└── sounds/       # 효과음
```

폴더는 해당 에셋을 처음 넣을 때 만듭니다.

## 이름

- 소문자 kebab-case를 씁니다. Figma 레이어 이름(`IMG_1368 5`, `Group 2043688096`)을 그대로 쓰지 않습니다.
- 케이크 부품은 `{분류}-{이름}-{형태}.png` 형식입니다. 예: `ribbon-top-heart.png`
- 2프레임 반복 이미지는 `-1`, `-2`로 끝냅니다.

## 케이크 부품

- 케이크는 형태(원형, 하트, 사각형), 크기, 색상, 장식 레이어를 겹쳐 그립니다.
- 리본처럼 케이크 형태에 따라 모양이 달라지는 장식은 형태별 파일을 따로 둡니다.
- 부품 목록과 겹침 순서, 위치는 `src/data`의 데이터로 관리합니다. JSX 분기로 하드코딩하지 않습니다.
- 부품 PNG는 여백이 일정하지 않습니다. 시안의 기준 사각형 규격으로 맞추되, 중앙이 어긋나면 데이터의 offset으로 보정합니다.

## 용량

- 키오스크 메모리가 작습니다. 화면에 표시되는 크기의 2배를 넘는 해상도로 내보내지 않습니다.
- 사진류 배경은 WebP, 투명 배경 부품은 PNG 또는 WebP를 씁니다.
- 다음 화면에서 쓸 이미지는 미리 불러와 전환 중 빈 화면이 보이지 않게 합니다.

## 폰트

- 폰트 파일은 woff2로 변환해 `public/assets/fonts`에 두고, `src/app/globals.css`의 `@font-face`로 등록합니다.
- `next/font`를 쓰지 않습니다. 폰트가 여러 종이고 용량이 커서, 화면에 실제로 쓰인 폰트만 내려받게 하기 위해서입니다.
- Tailwind 토큰은 `tailwind.config.ts`의 `fontFamily`에 있습니다: `font-stardust`(PF 스타더스트, 굵게는 `font-bold`), `font-meow`(온글잎 애옹글), `font-jinpall`(온글잎 진팔이), `font-dinaru`(은 디나루), `font-essay`(별모래 에세이), `font-kiwi`(Kiwi Soda).
- Kiwi Soda는 CC BY 4.0이라 출처 표기가 필요합니다. 표기는 저장소 루트의 `CREDITS.md`에 있습니다. 출처 표기가 필요한 에셋을 추가하면 이 파일에 함께 적습니다.
- Starshines는 라이선스가 폰트 파일의 변환 재배포를 금지하므로 저장소에 넣지 않습니다. 진행 바 이름표처럼 글자가 고정된 곳에만 쓰고, 글자를 윤곽선 SVG로 만들어 넣습니다 (`public/assets/ui/progress/text-*.svg`).
