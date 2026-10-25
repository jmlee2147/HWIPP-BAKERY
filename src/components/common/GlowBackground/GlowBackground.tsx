import type { Glow } from "@/data/result";

interface GlowBackgroundProps {
  glows: Glow[];
}

// 원마다 주기를 달리해, 서로 어긋나며 떠다니게 한다.
const DURATIONS = [13, 17, 11, 19];

// 연분홍 바탕 위에 흐린 원을 겹치고 천천히 떠다니게 한다.
export const GlowBackground = ({ glows }: GlowBackgroundProps) => {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#ffeff3]">
      {glows.map((glow, index) => (
        <img
          key={`${glow.src}-${glow.left}`}
          alt=""
          className="absolute block max-w-none animate-glow-drift motion-reduce:animate-none"
          src={glow.src}
          style={{
            left: glow.left,
            top: glow.top,
            width: glow.size,
            height: glow.size,
            animationDuration: `${DURATIONS[index % DURATIONS.length]}s`,
            animationDelay: `${index * -4.5}s`,
            animationDirection: index % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
    </div>
  );
};
