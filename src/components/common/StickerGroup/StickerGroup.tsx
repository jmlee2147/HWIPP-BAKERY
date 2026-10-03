import { Sticker } from "@/components/common/Sticker/Sticker";
import type { Sticker as StickerData } from "@/data/stickers";

const MOTION = {
  bob: "animate-bob",
  wobble: "animate-wobble",
};

interface StickerGroupProps {
  stickers: StickerData[];
  motion: keyof typeof MOTION;
  // 몇 번째로 나타나는지. 주지 않으면 처음부터 보인다.
  popOrder?: number;
  // 그룹마다 움직임이 어긋나 보이도록 주는 순번.
  phase: number;
}

const POP_GAP_MS = 180;

// 케이크와 거기 딸린 별을 한 덩어리로 움직인다.
export const StickerGroup = ({
  stickers,
  motion,
  popOrder,
  phase,
}: StickerGroupProps) => {
  const left = Math.min(...stickers.map((s) => s.centerX - s.width / 2));
  const top = Math.min(...stickers.map((s) => s.centerY - s.height / 2));
  const right = Math.max(...stickers.map((s) => s.centerX + s.width / 2));
  const bottom = Math.max(...stickers.map((s) => s.centerY + s.height / 2));

  return (
    <div
      className={`absolute ${popOrder === undefined ? "" : "animate-pop-in"}`}
      style={{
        left,
        top,
        width: right - left,
        height: bottom - top,
        animationDelay:
          popOrder === undefined ? undefined : `${popOrder * POP_GAP_MS}ms`,
      }}
    >
      <div
        className={`relative size-full ${MOTION[motion]}`}
        style={{
          animationDuration: `${2.8 + (phase % 3) * 0.5}s`,
          animationDelay: `${-phase * 0.7}s`,
        }}
      >
        {stickers.map((sticker) => (
          <Sticker
            key={`${sticker.centerX}-${sticker.centerY}`}
            sticker={sticker}
            offsetX={left}
            offsetY={top}
          />
        ))}
      </div>
    </div>
  );
};
