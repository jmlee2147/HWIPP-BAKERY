"use client";

import { type ReactNode, useLayoutEffect, useState } from "react";
import { computeStageScale, STAGE_HEIGHT, STAGE_WIDTH } from "@/lib/stage";

interface StageProps {
  children: ReactNode;
}

export const Stage = ({ children }: StageProps) => {
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const update = () =>
      setScale(computeStageScale(window.innerWidth, window.innerHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div
        className="relative shrink-0 overflow-hidden bg-white"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
          visibility: scale === 0 ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
};
