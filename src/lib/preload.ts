// 이미 받기 시작한 주소. 같은 그림을 두 번 받지 않으려고 기억한다.
const requested = new Set<string>();

// 받아 둔 그림을 붙잡고 있으면 다음 화면이 빈 자리 없이 뜨지만, 끝없이 쌓으면
// 푼 그림이 메모리를 채워 휴대폰 브라우저가 페이지를 닫는다.
// 그래서 다음 화면 한 장면에 쓸 만큼만 붙잡고 오래된 것부터 놓아준다.
// 결과 화면이 미리 받는 62장이 지금 한 번에 가장 많이 받는 양이다.
const KEEP_LIMIT = 64;
const kept: HTMLImageElement[] = [];

const keep = (image: HTMLImageElement) => {
  kept.push(image);
  if (kept.length > KEEP_LIMIT) kept.splice(0, kept.length - KEEP_LIMIT);
};

// 붙잡고 있는 그림 수. 한도가 지켜지는지 확인하는 테스트에서 쓴다.
export function keptCount() {
  return kept.length;
}

// 지금까지 받기 시작한 그림의 수. 화면에 붙지 않은 것까지 센다.
// 계측에서 체험이 이어지는 동안 얼마나 쌓였는지 보는 데 쓴다.
export function requestedCount() {
  return requested.size;
}

// 다음 화면에서 쓸 글꼴을 미리 받아 둔다. 글자가 다른 글꼴로 먼저 보였다가 바뀌는 것을 막는다.
export function preloadFonts(fonts: string[]) {
  if (typeof document === "undefined" || !document.fonts) return;
  for (const font of fonts) void document.fonts.load(font).catch(() => {});
}

// 다음 화면에서 쓸 이미지를 미리 받아 둔다. 화면이 바뀌는 중에 빈 자리가 보이지 않게 하기 위해서다.
export function preloadImages(sources: string[]) {
  if (typeof Image === "undefined") return;
  for (const src of sources) {
    if (requested.has(src)) continue;
    requested.add(src);
    const image = new Image();
    image.src = src;
    keep(image);
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
        const image = new Image();
        image.onload = () => {
          requested.add(src);
          // 받은 뒤에도 그림을 푸는 데 시간이 걸린다. 다 풀린 뒤에 보여 주어야 조각이 차례로 뜨지 않는다.
          if (typeof image.decode === "function") {
            image.decode().then(resolve, resolve);
          } else resolve();
        };
        image.onerror = () => resolve();
        image.src = src;
        keep(image);
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
