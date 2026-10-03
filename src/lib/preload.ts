// 받아 둔 이미지가 메모리에서 정리되어 다시 요청되지 않도록 붙잡아 둔다.
const kept: HTMLImageElement[] = [];

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
