const EFFECTS = {
  doorBell: { src: "/assets/sounds/door-bell.m4a", volume: 0.7 },
  doorOpen: { src: "/assets/sounds/door-open.mp3", volume: 0.8 },
  choice: { src: "/assets/sounds/choice.mp3", volume: 0.4 },
  cardSlide: { src: "/assets/sounds/card-slide.m4a", volume: 0.5 },
  cardFlip: { src: "/assets/sounds/card-flip.m4a", volume: 0.6 },
  popUp: { src: "/assets/sounds/pop-up.m4a", volume: 0.5 },
};

type EffectName = keyof typeof EFFECTS;

const BGM = { src: "/assets/sounds/bgm.m4a", volume: 0.35 };
const TALK = { src: "/assets/sounds/talk.wav", volume: 0.5 };

// 배경음악은 페이지에 하나만 있어야 한다. 이 파일이 다시 불려도(개발 중 코드 갱신 등)
// 이미 재생 중인 것을 잃어버려 두 개가 겹치지 않도록 window에 보관한다.
declare global {
  interface Window {
    __hwippBgm?: HTMLAudioElement;
  }
}

const effects: Partial<Record<EffectName, HTMLAudioElement>> = {};
let talkPool: HTMLAudioElement[] = [];
let talkIndex = 0;

const canPlay = () => typeof Audio !== "undefined";

const create = (src: string, volume: number) => {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = volume;
  return audio;
};

// 브라우저는 첫 터치 이후에만 소리를 낼 수 있다. 재생이 거부되어도 진행에는 영향을 주지 않는다.
const play = (audio: HTMLAudioElement) => {
  try {
    void audio.play()?.catch(() => {});
  } catch {
    // 소리를 지원하지 않는 환경.
  }
};

const rewind = (audio: HTMLAudioElement) => {
  try {
    audio.currentTime = 0;
  } catch {
    // 아직 불러오지 못한 상태.
  }
};

const getEffect = (name: EffectName) => {
  const cached = effects[name];
  if (cached) return cached;
  const audio = create(EFFECTS[name].src, EFFECTS[name].volume);
  effects[name] = audio;
  return audio;
};

const getTalkPool = () => {
  if (talkPool.length === 0) {
    talkPool = Array.from({ length: 4 }, () => create(TALK.src, TALK.volume));
  }
  return talkPool;
};

const getBgm = () => {
  if (!window.__hwippBgm) {
    const audio = create(BGM.src, BGM.volume);
    audio.loop = true;
    window.__hwippBgm = audio;
  }
  return window.__hwippBgm;
};

// 누르는 순간 바로 소리가 나도록, 첫 화면에서 음원을 미리 받아 둔다.
export function preloadSounds() {
  if (!canPlay()) return;
  getBgm();
  getTalkPool();
  for (const name of Object.keys(EFFECTS) as EffectName[]) getEffect(name);
}

export function playEffect(name: EffectName) {
  if (!canPlay()) return;
  const audio = getEffect(name);
  rewind(audio);
  play(audio);
}

// 말소리는 아주 짧은 간격으로 이어서 나므로, 미리 만들어 둔 몇 개를 돌려 가며 쓴다.
export function playTalk() {
  if (!canPlay()) return;
  const pool = getTalkPool();
  const audio = pool[talkIndex % pool.length];
  talkIndex += 1;
  rewind(audio);
  play(audio);
}

// 여러 번 불러도 배경음악은 하나만 재생된다.
export function startBgm() {
  if (!canPlay()) return;
  const audio = getBgm();
  if (audio.paused) play(audio);
}

// 다음에 시작할 때 처음부터 나오도록 되감아 둔다.
export function stopBgm() {
  if (!canPlay() || !window.__hwippBgm) return;
  window.__hwippBgm.pause();
  rewind(window.__hwippBgm);
}
