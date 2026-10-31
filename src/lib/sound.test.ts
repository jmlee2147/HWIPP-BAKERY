import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class FakeAudio {
  static created: FakeAudio[] = [];
  paused = true;
  currentTime = 0;
  volume = 1;
  loop = false;
  preload = "";
  play = vi.fn(() => {
    this.paused = false;
    return Promise.resolve();
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
  load = vi.fn();
  removeAttribute = vi.fn();
  constructor(public src: string) {
    FakeAudio.created.push(this);
  }
}

class FakeAudioContext {
  static started: AudioBuffer[] = [];
  static last: FakeAudioContext | null = null;
  state = "suspended";
  destination = {};
  resume = vi.fn(() => {
    this.state = "running";
    return Promise.resolve();
  });
  decodeAudioData = vi.fn(() => Promise.resolve({} as AudioBuffer));
  constructor() {
    FakeAudioContext.last = this;
  }
  createGain() {
    return { gain: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() };
  }
  createBufferSource() {
    const source = {
      buffer: null as AudioBuffer | null,
      onended: null as (() => void) | null,
      connect: vi.fn(),
      start: vi.fn(() => {
        if (source.buffer) FakeAudioContext.started.push(source.buffer);
      }),
    };
    return source;
  }
}

const loadSound = () => import("./sound");

const WEBOS_UA =
  "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36";
// 전시에 쓰는 StanbyME 2. 1세대와 달리 Web0S 대신 NetCast가 들어간다.
const STANBYME2_UA =
  "Mozilla/5.0 (Linux; NetCast; U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 SmartTV/10.0 Colt/2.0";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

const setUserAgent = (value: string) => {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(value);
};

describe("sound", () => {
  beforeEach(() => {
    vi.resetModules();
    FakeAudio.created = [];
    FakeAudioContext.started = [];
    FakeAudioContext.last = null;
    window.__hwippBgm = undefined;
    vi.stubGlobal("Audio", FakeAudio);
    vi.stubGlobal("AudioContext", FakeAudioContext);
    setUserAgent(WEBOS_UA);
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const effectElements = () =>
    FakeAudio.created.filter((audio) => !audio.src.includes("bgm"));

  const preloaded = async () => {
    const sound = await loadSound();
    sound.preloadSounds();
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(7));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return { sound, context: FakeAudioContext.last as FakeAudioContext };
  };

  it("미리 받아 둔 효과음은 오디오 요소 없이 매번 새로 재생한다", async () => {
    const { sound, context } = await preloaded();
    context.state = "running";

    sound.playEffect("cardFlip");
    sound.playEffect("cardFlip");

    expect(FakeAudioContext.started).toHaveLength(2);
    expect(effectElements()).toHaveLength(0);
  });

  it.each([
    "suspended",
    "interrupted",
  ])("context가 %s 상태면 터치 때 깨우고, 깨어나기 전의 효과음은 오디오 요소로 낸다", async (state) => {
    const { sound, context } = await preloaded();
    context.state = state;

    sound.playEffect("cardFlip");

    expect(FakeAudioContext.started).toHaveLength(0);
    expect(effectElements()).toHaveLength(1);
    expect(effectElements()[0].play).toHaveBeenCalled();

    document.dispatchEvent(new Event("touchend"));
    expect(context.resume).toHaveBeenCalled();

    sound.playEffect("cardFlip");

    expect(FakeAudioContext.started).toHaveLength(1);
    expect(effectElements()).toHaveLength(1);
  });

  it("context가 멈춘 채로 말소리가 이어져도 오디오 요소가 쌓이지 않는다", async () => {
    const { sound, context } = await preloaded();
    context.state = "interrupted";

    for (let index = 0; index < 50; index += 1) sound.playTalk();

    expect(effectElements()).toHaveLength(4);
  });

  it("StanbyME 2도 Web Audio로 효과음을 내, 배경음악을 멈추지 않는다", async () => {
    setUserAgent(STANBYME2_UA);
    const { sound, context } = await preloaded();
    context.state = "running";

    sound.playEffect("cardFlip");
    sound.playEffect("cardFlip");

    expect(FakeAudioContext.started).toHaveLength(2);
    expect(effectElements()).toHaveLength(0);
  });

  it("말소리는 재생 중인 요소를 되감지 않고 건너뛴다", async () => {
    // 되감아 다시 틀면 재생이 밀려 쌓이고, 타이핑이 끝난 뒤 한꺼번에 터진다.
    setUserAgent(IPHONE_UA);
    const sound = await loadSound();
    sound.preloadSounds();

    // 풀에 있는 수보다 많이 불러도, 재생 중인 것은 다시 쓰지 않는다.
    for (let index = 0; index < 20; index += 1) sound.playTalk();

    const talks = effectElements().filter((audio) =>
      audio.src.includes("talk"),
    );
    const played = talks.filter((audio) => audio.play.mock.calls.length > 0);

    expect(talks).toHaveLength(4);
    expect(played).toHaveLength(4);
    for (const audio of talks) expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it("webOS가 아닌 기기는 Web Audio 없이 미리 만든 오디오 요소로만 효과음을 낸다", async () => {
    setUserAgent(IPHONE_UA);
    const sound = await loadSound();
    sound.preloadSounds();
    const preloadedCount = effectElements().length;

    sound.playEffect("cardFlip");
    sound.playEffect("cardFlip");
    for (let index = 0; index < 50; index += 1) sound.playTalk();

    expect(FakeAudioContext.last).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(effectElements()).toHaveLength(preloadedCount);
    const flip = effectElements().filter((audio) =>
      audio.src.includes("card-flip"),
    );
    expect(flip).toHaveLength(1);
    expect(flip[0].play).toHaveBeenCalledTimes(2);
  });

  it("효과음을 아직 받지 못했으면 오디오 요소로 대신 낸다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    const { playEffect } = await loadSound();

    playEffect("cardFlip");
    playEffect("cardFlip");

    const elements = effectElements();
    expect(elements).toHaveLength(1);
    expect(elements[0].play).toHaveBeenCalledTimes(2);
  });

  it("Web Audio가 없는 환경에서도 효과음을 오디오 요소로 낸다", async () => {
    vi.stubGlobal("AudioContext", undefined);
    const { playEffect } = await loadSound();

    playEffect("choice");

    expect(effectElements()).toHaveLength(1);
    expect(effectElements()[0].play).toHaveBeenCalled();
  });

  it("배경음악은 여러 번 시작해도 하나만 재생된다", async () => {
    const { preloadSounds, startBgm } = await loadSound();
    preloadSounds();

    startBgm();
    startBgm();

    const bgms = FakeAudio.created.filter((audio) => audio.src.includes("bgm"));
    expect(bgms).toHaveLength(1);
    expect(bgms[0].play).toHaveBeenCalledTimes(1);
  });

  it("배경음악을 멈춘 뒤 다시 시작하면 되감은 요소가 아니라 새 요소로 처음부터 재생한다", async () => {
    const { preloadSounds, startBgm, stopBgm } = await loadSound();
    preloadSounds();
    startBgm();
    const first = window.__hwippBgm as unknown as FakeAudio;
    first.currentTime = 12;

    stopBgm();
    startBgm();

    const second = window.__hwippBgm as unknown as FakeAudio;
    expect(first.pause).toHaveBeenCalled();
    expect(second).not.toBe(first);
    expect(second.currentTime).toBe(0);
    expect(second.play).toHaveBeenCalledTimes(1);
  });

  it("한 번도 틀지 않은 배경음악은 멈춰도 새로 만들지 않는다", async () => {
    const { preloadSounds, stopBgm } = await loadSound();
    preloadSounds();
    const first = window.__hwippBgm;

    stopBgm();

    expect(window.__hwippBgm).toBe(first);
  });
});
