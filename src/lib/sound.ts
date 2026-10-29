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

// 배경음악은 페이지에 하나만 있어야 한다. 이 파일이 다시 불려도(개발 중 코드 갱신 등)
// 이미 재생 중인 것을 잃어버려 두 개가 겹치지 않도록 window에 보관한다.
declare global {
  interface Window {
    __hwippBgm?: HTMLAudioElement;
  }
}

// 효과음은 Web Audio로 낸다. 키오스크(StanbyME 2)는 오디오 요소를 되감아 다시 틀면
// 소리가 났다 안 났다 하고, 요소가 많으면 배경음악까지 나오지 않는다.
// 음원을 한 번 풀어 두고 누를 때마다 새로 재생하면 되감기도, 요소 사이의 다툼도 없다.
let context: AudioContext | null = null;
const buffers: Partial<Record<EffectName, AudioBuffer>> = {};
const loading: Partial<Record<EffectName, boolean>> = {};

const canPlay = () => typeof Audio !== "undefined";

const getContext = () => {
  if (context) return context;
  if (typeof AudioContext === "undefined") return null;
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

const playBuffer = (buffer: AudioBuffer, volume: number) => {
  if (!context) return false;
  try {
    // 첫 터치 전에 만든 context는 멈춰 있다. 터치 안에서 깨운다.
    if (context.state === "suspended") void context.resume();
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(context.destination);
    source.start(0);
    return true;
  } catch {
    return false;
  }
};

// 브라우저는 첫 터치 이후에만 소리를 낼 수 있다. 재생이 거부되어도 진행에는 영향을 주지 않는다.
const playElement = (src: string, volume: number) => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    void audio.play()?.catch(() => {});
  } catch {
    // 소리를 지원하지 않는 환경.
  }
};

const createBgm = () => {
  const audio = new Audio(BGM.src);
  audio.preload = "auto";
  audio.volume = BGM.volume;
  audio.loop = true;
  window.__hwippBgm = audio;
  return audio;
};

// 누르는 순간 바로 소리가 나도록, 첫 화면에서 음원을 미리 받아 둔다.
export function preloadSounds() {
  if (!canPlay()) return;
  if (!window.__hwippBgm) createBgm();
  for (const name of Object.keys(EFFECTS) as EffectName[]) loadBuffer(name);
}

export function playEffect(name: EffectName) {
  if (!canPlay()) return;
  const { src, volume } = EFFECTS[name];
  const buffer = buffers[name];
  if (buffer && playBuffer(buffer, volume)) return;
  loadBuffer(name);
  playElement(src, volume);
}

// 말소리는 아주 짧은 간격으로 이어서 나지만, 재생마다 새로 내므로 겹쳐도 끊기지 않는다.
export function playTalk() {
  playEffect("talk");
}

// 여러 번 불러도 배경음악은 하나만 재생된다.
export function startBgm() {
  if (!canPlay()) return;
  const audio = window.__hwippBgm ?? createBgm();
  if (!audio.paused) return;
  try {
    void audio.play()?.catch(() => {});
  } catch {
    // 소리를 지원하지 않는 환경.
  }
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
