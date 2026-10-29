const EFFECTS = {
  doorBell: { src: "/assets/sounds/door-bell.m4a", volume: 0.7 },
  doorOpen: { src: "/assets/sounds/door-open.mp3", volume: 0.8 },
  choice: { src: "/assets/sounds/choice.mp3", volume: 0.4 },
  cardSlide: { src: "/assets/sounds/card-slide.m4a", volume: 0.5 },
  cardFlip: { src: "/assets/sounds/card-flip.m4a", volume: 0.6 },
  popUp: { src: "/assets/sounds/pop-up.m4a", volume: 0.5 },
  talk: { src: "/assets/sounds/talk.wav", volume: 0.5 },
};

type EffectName = keyof typeof EFFECTS;

const BGM = { src: "/assets/sounds/bgm.m4a", volume: 0.35 };
// 말소리는 아주 짧은 간격으로 이어서 나므로, 오디오 요소로 낼 때는 몇 개를 돌려 가며 쓴다.
const TALK_POOL_SIZE = 4;

// 배경음악은 페이지에 하나만 있어야 한다. 이 파일이 다시 불려도(개발 중 코드 갱신 등)
// 이미 재생 중인 것을 잃어버려 두 개가 겹치지 않도록 window에 보관한다.
declare global {
  interface Window {
    __hwippBgm?: HTMLAudioElement;
  }
}

// 효과음은 기기에 따라 두 방식으로 낸다.
// - 키오스크(webOS): Web Audio. 오디오 요소를 되감아 다시 틀면 소리가 났다 안 났다 하고,
//   요소가 많으면 배경음악까지 나오지 않는다.
// - 그 밖의 기기: 오디오 요소. iPhone은 Web Audio로 효과음을 내면 체험 중에 페이지가 종료된다.
const canUseWebAudio = () =>
  typeof AudioContext !== "undefined" &&
  /web0s|webos/i.test(navigator.userAgent);

let context: AudioContext | null = null;
const buffers: Partial<Record<EffectName, AudioBuffer>> = {};
const loading: Partial<Record<EffectName, boolean>> = {};
let listening = false;

const elements: Partial<Record<EffectName, HTMLAudioElement[]>> = {};
const elementIndex: Partial<Record<EffectName, number>> = {};

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

const getContext = () => {
  if (context) return context;
  try {
    context = new AudioContext();
  } catch {
    return null;
  }
  return context;
};

const loadBuffer = (name: EffectName) => {
  const audioContext = getContext();
  if (!audioContext || buffers[name] || loading[name]) return;
  loading[name] = true;
  fetch(EFFECTS[name].src)
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
      buffers[name] = buffer;
    })
    .catch(() => {
      // 받지 못한 효과음은 오디오 요소로 대신 낸다.
      loading[name] = false;
    });
};

// context는 첫 터치 전에 멈춰 있고, 터치 안에서만 깨울 수 있다.
const wakeContext = () => {
  if (context && context.state !== "running") {
    void context.resume().catch(() => {});
  }
};

// 깨어나기 전의 소리는 오디오 요소로 대신 낸다.
const playBuffer = (buffer: AudioBuffer, volume: number) => {
  if (!context || context.state !== "running") return false;
  try {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(context.destination);
    source.onended = () => gain.disconnect();
    source.start(0);
    return true;
  } catch {
    return false;
  }
};

// 오디오 요소는 효과음마다 정해진 수만 만들어 되감아 쓴다. 재생마다 새로 만들면 쌓인다.
const getElements = (name: EffectName) => {
  const cached = elements[name];
  if (cached) return cached;
  const size = name === "talk" ? TALK_POOL_SIZE : 1;
  const created = Array.from({ length: size }, () =>
    create(EFFECTS[name].src, EFFECTS[name].volume),
  );
  elements[name] = created;
  return created;
};

const playElement = (name: EffectName) => {
  const pool = getElements(name);
  const index = elementIndex[name] ?? 0;
  elementIndex[name] = index + 1;
  const audio = pool[index % pool.length];
  rewind(audio);
  play(audio);
};

const createBgm = () => {
  const audio = create(BGM.src, BGM.volume);
  audio.loop = true;
  window.__hwippBgm = audio;
  return audio;
};

// 누르는 순간 바로 소리가 나도록, 첫 화면에서 음원을 미리 받아 둔다.
export function preloadSounds() {
  if (!canPlay()) return;
  if (!window.__hwippBgm) createBgm();
  const names = Object.keys(EFFECTS) as EffectName[];
  if (!canUseWebAudio()) {
    for (const name of names) getElements(name);
    return;
  }
  for (const name of names) loadBuffer(name);
  if (!listening) {
    listening = true;
    for (const type of ["touchend", "click"]) {
      document.addEventListener(type, wakeContext, true);
    }
  }
}

export function playEffect(name: EffectName) {
  if (!canPlay()) return;
  if (canUseWebAudio()) {
    const buffer = buffers[name];
    if (buffer && playBuffer(buffer, EFFECTS[name].volume)) return;
    loadBuffer(name);
  }
  playElement(name);
}

export function playTalk() {
  playEffect("talk");
}

// 여러 번 불러도 배경음악은 하나만 재생된다.
export function startBgm() {
  if (!canPlay()) return;
  const audio = window.__hwippBgm ?? createBgm();
  if (audio.paused) play(audio);
}

// 멈춘 요소를 되감아 다시 틀지 않는다. 키오스크에서는 그렇게 다시 튼 소리가 나지 않을 때가 있어,
// 다음 관람객을 위해 처음부터 재생할 새 요소를 만들어 둔다.
export function stopBgm() {
  if (!canPlay() || !window.__hwippBgm) return;
  const audio = window.__hwippBgm;
  if (audio.paused && audio.currentTime === 0) return;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  createBgm();
}
