"use client";

import { type ComponentPropsWithRef, useEffect, useState } from "react";
import { CAKE_IMAGE, CAKE_SLICES } from "@/data/analysis";

// 조각 하나가 사라지는 간격.
const SLICE_MS = 600;

// 천천히 돌면서 조각이 하나씩 사라지는 케이크. 마지막 한 조각이 남으면 다시 채워져 끝없이 되풀이한다.
export const LoadingCake = ({
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  const [gone, setGone] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setGone((current) => (current + 1) % CAKE_SLICES.length),
      SLICE_MS,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div aria-hidden className={`size-[354.1px] ${className}`} {...props}>
      <div className="relative size-full animate-cake-spin motion-reduce:animate-none">
        {CAKE_SLICES.map((clipPath, index) => (
          <img
            key={clipPath}
            alt=""
            className={`absolute inset-0 size-full max-w-none transition-opacity duration-300 motion-reduce:transition-none ${index < gone ? "opacity-0" : "opacity-100"}`}
            src={CAKE_IMAGE}
            style={{ clipPath }}
          />
        ))}
      </div>
    </div>
  );
};
