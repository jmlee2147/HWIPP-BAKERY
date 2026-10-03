const EFFECTS = {
  doorBell: { src: "/assets/sounds/door-bell.m4a", volume: 0.7 },
  doorOpen: { src: "/assets/sounds/door-open.mp3", volume: 0.8 },
  choice: { src: "/assets/sounds/choice.mp3", volume: 0.4 },
};

const BGM = { src: "/assets/sounds/bgm.m4a", volume: 0.35 };

let bgm: HTMLAudioElement | null = null;

// 브라우저는 첫 터치 이후에만 소리를 낼 수 있다. 재생이 거부되어도 진행에는 영향을 주지 않는다.
const play = (audio: HTMLAudioElement) => {
  try {
    void audio.play()?.catch(() => {});
  } catch {
    // 소리를 지원하지 않는 환경.
  }
};

export function playEffect(name: keyof typeof EFFECTS) {
  if (typeof Audio === "undefined") return;
  const effect = EFFECTS[name];
  const audio = new Audio(effect.src);
  audio.volume = effect.volume;
  play(audio);
}

// 여러 번 불러도 배경음악은 하나만 재생된다.
export function startBgm() {
  if (typeof Audio === "undefined") return;
  if (!bgm) {
    bgm = new Audio(BGM.src);
    bgm.loop = true;
    bgm.volume = BGM.volume;
  }
  if (bgm.paused) play(bgm);
}
