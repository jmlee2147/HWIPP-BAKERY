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

describe("sound", () => {
  beforeEach(() => {
    vi.resetModules();
    FakeAudio.created = [];
    FakeAudioContext.started = [];
    window.__hwippBgm = undefined;
    vi.stubGlobal("Audio", FakeAudio);
    vi.stubGlobal("AudioContext", FakeAudioContext);
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
  ])("context가 %s 상태면 깨우고, 깨어나기 전의 효과음은 오디오 요소로 낸다", async (state) => {
    const { sound, context } = await preloaded();
    context.state = state;

    sound.playEffect("cardFlip");

    expect(context.resume).toHaveBeenCalled();
    expect(FakeAudioContext.started).toHaveLength(0);
    expect(effectElements()).toHaveLength(1);
    expect(effectElements()[0].play).toHaveBeenCalled();

    sound.playEffect("cardFlip");

    expect(FakeAudioContext.started).toHaveLength(1);
    expect(effectElements()).toHaveLength(1);
  });

  it("효과음을 아직 받지 못했으면 새 오디오 요소로 대신 낸다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    const { playEffect } = await loadSound();

    playEffect("cardFlip");
    playEffect("cardFlip");

    const elements = effectElements();
    expect(elements).toHaveLength(2);
    expect(elements[0]).not.toBe(elements[1]);
    for (const audio of elements) expect(audio.play).toHaveBeenCalledTimes(1);
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
