// 받아 둔 이미지가 메모리에서 정리되어 다시 요청되지 않도록 붙잡아 둔다.
const kept: HTMLImageElement[] = [];

// 다음 화면에서 쓸 글꼴을 미리 받아 둔다. 글자가 다른 글꼴로 먼저 보였다가 바뀌는 것을 막는다.
export function preloadFonts(fonts: string[]) {
  if (typeof document === "undefined" || !document.fonts) return;
  for (const font of fonts) void document.fonts.load(font).catch(() => {});
}

// 다음 화면에서 쓸 이미지를 미리 받아 둔다. 화면이 바뀌는 중에 빈 자리가 보이지 않게 하기 위해서다.
export function preloadImages(sources: string[]) {
  if (typeof Image === "undefined") return;
  for (const src of sources) {
    if (kept.some((image) => image.getAttribute("src") === src)) continue;
    const image = new Image();
    image.src = src;
    kept.push(image);
  }
}

// 이미지를 모두 받아 그릴 준비가 될 때까지 기다린다. 못 받는 그림이 있어도 화면이 멈추지 않도록
// timeoutMs가 지나면 기다리지 않는다. 제때 모두 준비되었는지를 돌려준다.
export function loadImages(
  sources: string[],
  timeoutMs: number,
): Promise<boolean> {
  if (typeof Image === "undefined") return Promise.resolve(true);
  const loads = sources.map(
    (src) =>
      new Promise<void>((resolve) => {
        const known = kept.find((image) => image.getAttribute("src") === src);
        if (known?.complete) {
          resolve();
          return;
        }
        const image = new Image();
        image.onload = () => {
          // 받은 뒤에도 그림을 푸는 데 시간이 걸린다. 다 풀린 뒤에 보여 주어야 조각이 차례로 뜨지 않는다.
          if (typeof image.decode === "function") {
            image.decode().then(resolve, resolve);
          } else resolve();
        };
        image.onerror = () => resolve();
        image.src = src;
        kept.push(image);
      }),
  );
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeoutMs);
    void Promise.all(loads).then(() => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}
