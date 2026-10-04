import type { BakerFrame } from "@/data/opening";

const FRAME_ANIMATION = ["animate-frame-first", "animate-frame-second"];

interface BakerProps {
  // 두 장이면 일정한 간격으로 번갈아 보여 준다.
  frames: BakerFrame[];
}

export const Baker = ({ frames }: BakerProps) => {
  return frames.map((frame, index) => (
    <img
      key={frame.src}
      alt=""
      className={`absolute max-w-none ${frames.length > 1 ? FRAME_ANIMATION[index] : ""}`}
      src={frame.src}
      style={{
        left: frame.left,
        top: frame.top,
        width: frame.width,
        height: frame.height,
      }}
    />
  ));
};
