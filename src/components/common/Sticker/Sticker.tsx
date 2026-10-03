import type { Sticker as StickerData } from "@/data/stickers";

const STAR_COLOR = {
  yellow: "bg-[#ffcd42]",
  cocoa: "bg-cocoa",
};

const STAR_SHAPE =
  "[clip-path:polygon(50%_0%,66.75%_26.94%,97.55%_34.55%,77.11%_58.81%,79.39%_90.45%,50%_78.5%,20.61%_90.45%,22.89%_58.81%,2.45%_34.55%,33.25%_26.94%)]";

interface StickerProps {
  sticker: StickerData;
}

// 중심 좌표와 회전값으로 놓는 이미지 한 장. 그림자는 회전하지 않도록 바깥 요소에 건다.
export const Sticker = ({ sticker }: StickerProps) => {
  const { centerX, centerY, width, height, rotate } = sticker;
  const box = {
    left: centerX - width / 2,
    top: centerY - height / 2,
    width,
    height,
  };

  if (sticker.kind === "star") {
    return (
      <div className="absolute" style={box}>
        <div
          className={`size-full ${STAR_SHAPE} ${STAR_COLOR[sticker.color]}`}
          style={{ transform: `rotate(${rotate}deg)` }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute drop-shadow-[5.4px_9.45px_5.4px_rgba(0,0,0,0.15)]"
      style={box}
    >
      <img
        alt=""
        className="size-full max-w-none"
        src={sticker.src}
        style={{ transform: `rotate(${rotate}deg)` }}
      />
    </div>
  );
};
