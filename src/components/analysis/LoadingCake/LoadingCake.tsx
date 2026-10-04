"use client";

import { useReducedMotion } from "motion/react";
import { type ComponentPropsWithRef, useEffect, useState } from "react";
import { CAKE_IMAGE, CAKE_SLICES } from "@/data/analysis";

// 조각 하나가 사라지거나 채워지는 간격.
const SLICE_MS = 600;

// 제자리에서 조각이 하나씩 사라지는 케이크. 전부 사라지면 사라진 순서대로 하나씩 다시 채워져 끝없이 되풀이한다.
export const LoadingCake = ({
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  const reduceMotion = useReducedMotion();
  // 앞 절반은 조각이 사라지는 박자, 뒤 절반은 다시 채워지는 박자다.
  const [beat, setBeat] = useState(0);
  // 움직임 줄이기를 켠 기기에서는 조각을 깜빡이지 않고 온전한 케이크를 보여 준다.
  const shownBeat = reduceMotion ? 0 : beat;

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(
      () => setBeat((current) => (current + 1) % (CAKE_SLICES.length * 2)),
      SLICE_MS,
    );
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div aria-hidden className={`size-[354.1px] ${className}`} {...props}>
      <div className="relative size-full">
        {CAKE_SLICES.map((clipPath, index) => (
          <img
            key={clipPath}
            alt=""
            className={`absolute inset-0 size-full max-w-none transition-opacity duration-300 motion-reduce:transition-none ${index < shownBeat && shownBeat <= index + CAKE_SLICES.length ? "opacity-0" : "opacity-100"}`}
            src={CAKE_IMAGE}
            style={{ clipPath }}
          />
        ))}
      </div>
    </div>
  );
};
