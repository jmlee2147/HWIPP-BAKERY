import { afterEach, describe, expect, it, vi } from "vitest";
import { keptCount, loadImages, preloadImages } from "./preload";

describe("loadImages", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("받을 그림이 없으면 바로 준비된 것으로 본다", async () => {
    await expect(loadImages([], 1000)).resolves.toBe(true);
  });

  it("그림을 제때 받지 못하면 기다리지 않고 준비되지 않았다고 알린다", async () => {
    vi.useFakeTimers();
    const loading = loadImages(["/never-loads.webp"], 1000);

    await vi.advanceTimersByTimeAsync(1000);

    await expect(loading).resolves.toBe(false);
  });
});

describe("preloadImages", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const fakeImages = () => {
    const made: { src: string }[] = [];
    class FakeImage {
      src = "";
      constructor() {
        made.push(this);
      }
    }
    vi.stubGlobal("Image", FakeImage);
    return made;
  };

  it("같은 주소는 다시 받지 않는다", () => {
    const made = fakeImages();

    preloadImages(["/a.webp", "/b.webp"]);
    preloadImages(["/a.webp", "/b.webp"]);

    expect(made).toHaveLength(2);
  });

  it("붙잡아 두는 그림 수에 한도가 있다", () => {
    // 한도가 없으면 체험을 한 바퀴 돌 즈음 푼 그림이 쌓여 휴대폰 브라우저가 페이지를 닫는다.
    fakeImages();
    const many = Array.from(
      { length: 500 },
      (_, index) => `/cap-${index}.webp`,
    );

    preloadImages(many);

    expect(keptCount()).toBeLessThanOrEqual(64);
  });
});
