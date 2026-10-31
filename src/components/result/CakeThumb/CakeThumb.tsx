"use client";

import { type ComponentPropsWithRef, useEffect, useRef } from "react";
import type { CakeConfig } from "@/data/cake";
import { type CakeCanvasPlacement, drawCake } from "@/lib/cakeCanvas";

// 캔버스를 화면보다 이만큼 촘촘하게 그린다. 키오스크는 스테이지를 키워 보여 주므로 1배로는 거칠다.
const PIXEL_RATIO = 2;

interface CakeThumbProps extends ComponentPropsWithRef<"canvas"> {
  cake: CakeConfig;
  // 칸의 크기. 캔버스가 차지하는 자리다.
  width: number;
  height: number;
  place: CakeCanvasPlacement;
}

// 케이크 하나를 캔버스 한 장에 그린다. 부품마다 img를 두면 메뉴판처럼 여러 개를 늘어놓는 곳에서
// 그림이 수백 장이 되어 휴대폰이 그 화면을 그리다 페이지를 닫는다.
export const CakeThumb = ({
  cake,
  width,
  height,
  place,
  className = "",
  ...props
}: CakeThumbProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  // 자리 값은 렌더마다 새 객체로 오므로, 값 하나하나를 보고 다시 그릴지 가린다.
  const { centerX, centerY, scale, baseCenterX, baseCenterY } = place;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let alive = true;
    void drawCake(
      canvas,
      cake,
      { centerX, centerY, scale, baseCenterX, baseCenterY },
      () => alive,
    );
    return () => {
      alive = false;
    };
  }, [cake, centerX, centerY, scale, baseCenterX, baseCenterY]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      width={width * PIXEL_RATIO}
      height={height * PIXEL_RATIO}
      className={className}
      style={{ width, height }}
      {...props}
    />
  );
};
