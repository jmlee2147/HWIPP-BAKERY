export type StyleId =
  | "trendsetter"
  | "aesthetic-curator"
  | "cute-collector"
  | "minimalist"
  | "subculture-digger";

export type FolderColor = "pink" | "orange" | "yellow" | "green" | "purple";

export interface RecipientStyle {
  id: StyleId;
  name: string;
  folder: FolderColor;
  // 이름이 길면 작게, 짧으면 크게 쓴다.
  nameSize: "large" | "small";
  tagline: string;
  description: string;
  // 설명 글이 줄바꿈되는 너비. 스타일마다 조금씩 다르다.
  descriptionWidth: number;
  // 작은 창에 뜨는 요약. 한 줄에 다 들어가지 않는 문구는 두 줄로 나눠 적는다.
  summary: string;
  // 두 줄로 놓인다. 창보다 길면 오른쪽이 잘린다.
  quotes: [string[], string[]];
  traits: string[];
}

// 폴더가 왼쪽부터 놓이는 순서다.
export const STYLES: RecipientStyle[] = [
  {
    id: "trendsetter",
    name: "Trendsetter",
    folder: "pink",
    nameSize: "large",
    tagline: "트렌드를 가장 먼저\n경험하고 기록하는 FOMO",
    description:
      "트렌드에 누구보다 민감하며 새로운 경험을 즐기는 사람.\n카페, 팝업, 브랜드를 빠르게 소비하고 감도 있는 피드로\n자신의 취향을 기록한다.",
    descriptionWidth: 749,
    summary: "트렌드에 민감하고 사진 찍기를 좋아해요",
    quotes: [
      ["야 이거 해봤어?", "릴스에서 엄청 뜨더라.", "이거 지금 제일 핫하잖아."],
      [
        "안 해봤다고 하면 대화가 안 돼.",
        "저장만 해놓고 아직 못 감.",
        "이거 요즘 다 들고 다니던데.",
      ],
    ],
    traits: [
      "SNS 트렌드에 민감",
      "릴스·숏폼 헤비 유저",
      "얼리어답터",
      "팝업 성지순례",
    ],
  },
  {
    id: "aesthetic-curator",
    name: "Aesthetic Curator",
    folder: "orange",
    nameSize: "small",
    tagline: "작은 디테일에서도\n영감을 발견하는 느좋남녀",
    description:
      "유행을 무작정 따라가기보다 자신의 취향에 맞는 공간과 브랜드를 발견하는 데 즐거움을 느낀다. 작은 디테일과 분위기에서 영감을 얻고, 자신만의 감도로 일상을 기록한다.",
    descriptionWidth: 736,
    summary: "세련된 분위기와 감성적인 미감을\n중요하게 여겨요",
    quotes: [
      [
        "난 결국 디테일을 보게 되더라.",
        "요즘 미감이 너무 획일화됐어.",
        "이 공간,결이 괜찮네(찰칵)",
      ],
      ["아,나 이따가 독서모임 가야돼.", "ㅋㅋ난 거기 유명해지기 전부터 갔는데"],
    ],
    traits: [
      "밤티를 견딜 수 없음",
      "줄이어폰",
      "독서 및 교양 필수",
      "성수 자주 출몰",
    ],
  },
  {
    id: "cute-collector",
    name: "Cute Collector",
    folder: "yellow",
    nameSize: "small",
    tagline: "주머니 속 작은 캐릭터 하나로\n온종일 행복!",
    description:
      "캐릭터와 아기자기한 소품을 좋아하며, 일상 속에서도 자신의 취향을 드러낼 수 있는 물건을 찾아다닌다. 단순히 유명한 것을 따라가기보다 좋아하는 캐릭터와 디자인을 발견하고, 굿즈나 소품을 하나씩 모으는 과정에서 즐거움을 느낀다.",
    descriptionWidth: 724,
    summary: "아기자기하고 귀여운 아이템에\n쉽게 마음을 빼앗겨요",
    quotes: [
      [
        "헐 이거 진짜 너무 귀엽다ㅠㅠ",
        "쓸모는 없지만 내 마음을 치유해줌",
        "아 개귀여워 ㅠㅠㅠ",
      ],
      [
        "나 진짜 이것만 사고 거지 될게 진짜 마지막임",
        "님들 이거 교환 하실 분..",
      ],
    ],
    traits: [
      "에어팟/가방에 키링 최소 3개",
      "캐릭터 굿즈 수집",
      "아기자기한 디자인 선호",
    ],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    folder: "green",
    nameSize: "large",
    tagline: "비울수록 채워지는\n감성의 미니멀리스트",
    description:
      "불필요한 군더더기는 덜어내고 자신만의 확실한 기호와 본질에 집중한다. 무채색이 주는 정갈함과 군더더기 없는 디테일에서 마음의 평온을 얻는다. 복잡한 유행을 좇기보다 오랫동안 질리지 않을 깔끔하고 질 좋은 아이템 하나를 신중하게 고르는 편이다.",
    descriptionWidth: 717,
    summary: "군더더기 없이 깔끔하고\n정갈한 스타일을 선호해요",
    quotes: [
      [
        "난 깔끔한 게 제일 예쁘더라.",
        "물건 많아지면 머리 아파서 다 당근함",
        "뭐 없는 게 좋은데.",
      ],
      [
        "로고 크게 박힌 건 좀 그래... 티 안 나는 게 예쁨",
        "어차피 질려서 안 씀, 기본이 진리임",
      ],
    ],
    traits: [
      "SNS 트렌드에 민감",
      "릴스·숏폼 헤비 유저",
      "얼리어답터",
      "팝업 성지순례",
    ],
  },
  {
    id: "subculture-digger",
    name: "Subculture Digger",
    folder: "purple",
    nameSize: "small",
    tagline: "독창성과 유니크함에\n집착하는 4차원 취향가",
    description:
      "남들이 다 좋아하는 평범하고 무난한 스타일에는 절대 흥미를 느끼지 못한다. 자신만의 독특한 세계관과 감성이 확실하며, 약간은 기이하거나 키치하고 삐뚤빼뚤한 디테일에서 진정한 매력을 발견한다. '특이하다'는 말이 이들에게는 가장 기분 좋은 찬사다.",
    descriptionWidth: 724,
    summary: "뻔하지 않은 유니크함과\n딥한 마이너 취향을 탐닉해요",
    quotes: [
      [
        "남들 다 하는 건 좀 재미없잖아",
        "이거 약간 기괴한데 그래서 더 맘에 듦",
        "독특한 게 좋아",
      ],
      [
        "나는 감정없는 싸이코라 그런가 이런 거 보면 미동도 안 함. 오히려 웃음이 나온달까?",
      ],
    ],
    traits: ["B급, 서브컬처 감성 애호", "자신만의 확실한 마이너한 취향 존재"],
  },
];

export const folderImage = (color: FolderColor, open: boolean) =>
  `/assets/ui/folder/${color}-${open ? "open" : "closed"}.svg`;

export const STYLE_IMAGES = STYLES.flatMap((style) => [
  folderImage(style.folder, false),
  folderImage(style.folder, true),
]);

// 스타일 창에 쓰이는 글꼴 굵기. 앞 화면에서 미리 받아 둔다.
export const STYLE_FONTS = [300, 500, 600, 700].map(
  (weight) => `${weight} 16px Pretendard`,
);
