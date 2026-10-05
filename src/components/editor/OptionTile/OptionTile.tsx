"use client";

import type { ComponentPropsWithRef } from "react";
import type { TileIcon } from "@/data/editor";
import { playEffect } from "@/lib/sound";

interface OptionTileProps extends ComponentPropsWithRef<"button"> {
  label: string;
  icon: TileIcon;
  // 그림을 줄여 그리는 배율. 없으면 1이다.
  iconScale?: number;
  // 주면 그림의 흰 면에 이 색을 입힌다.
  tint?: string;
  selected: boolean;
}

// 수정 화면의 선택지 하나. 고른 것은 분홍 바탕에 하트가 붙는다.
export const OptionTile = ({
  label,
  icon,
  iconScale = 1,
  tint,
  selected,
  type = "button",
  className = "",
  onClick,
  ...props
}: OptionTileProps) => {
  const width = icon.width * iconScale;
  const height = icon.height * iconScale;

  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`h-[275px] w-[297px] shrink-0 border-2 transition-transform duration-100 active:scale-[0.97] ${selected ? "border-cocoa bg-candy" : "border-[#d9d9d9] bg-[#fdfcfc]"} ${className}`}
      onClick={(event) => {
        playEffect("choice");
        onClick?.(event);
      }}
      {...props}
    >
      <span className="relative block size-full">
        <span
          className="absolute left-1/2 top-[109px] block -translate-x-1/2 -translate-y-1/2"
          style={{ width, height }}
        >
          {tint && (
            <span
              className="absolute inset-0 [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]"
              style={{
                backgroundColor: tint,
                WebkitMaskImage: `url(${icon.src})`,
              }}
            />
          )}
          {/* 그림의 면은 흰색이라, 곱하기로 겹치면 아래에 깐 색이 그대로 비친다. */}
          <img
            alt=""
            className={`absolute inset-0 block size-full max-w-none ${tint ? "mix-blend-multiply" : ""}`}
            src={icon.src}
          />
        </span>
        <span className="absolute inset-x-0 top-[166px] whitespace-nowrap text-center font-pretendard text-[40px] font-light leading-[104.39px] tracking-[-1px] text-black">
          {label}
        </span>
        {selected && (
          <span
            aria-hidden
            className="absolute left-[233px] top-[12px] flex size-[44.53px] items-center justify-center rounded-full border-[0.96px] border-[#867b76] bg-mint font-stardust text-[26px] leading-none text-cocoa"
          >
            ♥
          </span>
        )}
      </span>
    </button>
  );
};
