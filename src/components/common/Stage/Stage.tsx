"use client";

import { MotionConfig } from "motion/react";
import { type ReactNode, useLayoutEffect, useState } from "react";
import { TouchEffect } from "@/components/common/TouchEffect/TouchEffect";
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
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white">
      <div
        className="relative shrink-0 overflow-hidden bg-white"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
          visibility: scale === 0 ? "hidden" : "visible",
        }}
      >
        {/* 스테이지가 줄거나 커져 있어도 끄는 거리가 손가락과 맞도록, 화면 좌표를 스테이지 좌표로 바꿔 준다. */}
        <MotionConfig
          transformPagePoint={(point) => ({
            x: point.x / (scale || 1),
            y: point.y / (scale || 1),
          })}
        >
          {children}
        </MotionConfig>
        <TouchEffect />
      </div>
    </div>
  );
};
