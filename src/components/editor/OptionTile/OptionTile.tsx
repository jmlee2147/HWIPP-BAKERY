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
  // 장식 분류 타일은 폭이 좁고 바탕이 희다.
  size?: "wide" | "narrow";
}

// 수정 화면의 선택지 하나. 고른 것은 분홍 바탕에 하트가 붙는다.
export const OptionTile = ({
  label,
  icon,
  iconScale = 1,
  tint,
  selected,
  size = "wide",
  type = "button",
  className = "",
  onClick,
  ...props
}: OptionTileProps) => {
  const width = icon.width * iconScale;
  const height = icon.height * iconScale;
  const narrow = size === "narrow";

  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`h-[275px] shrink-0 border-2 transition-transform duration-100 active:scale-[0.97] ${narrow ? "w-[270px]" : "w-[297px]"} ${selected ? "border-cocoa bg-candy" : narrow ? "border-mist bg-white" : "border-[#d9d9d9] bg-[#fdfcfc]"} ${className}`}
      onClick={(event) => {
        playEffect("choice");
        onClick?.(event);
      }}
      {...props}
    >
      <span className="relative block size-full">
        <span
          className="absolute left-1/2 block -translate-x-1/2 -translate-y-1/2"
          style={{ width, height, top: icon.centerY ?? 109 }}
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
        {/* 두 줄짜리 이름은 줄 간격을 좁혀 한 줄짜리와 같은 자리에 놓는다. */}
        <span
          className={`absolute inset-x-0 text-center font-pretendard text-[40px] font-light tracking-[-1px] text-black ${label.includes("\n") ? "top-[178px] whitespace-pre leading-[41px]" : "top-[166px] whitespace-nowrap leading-[104.39px]"}`}
        >
          {label}
        </span>
        {selected && (
          <span
            aria-hidden
            className={`absolute flex size-[44.53px] items-center justify-center rounded-full border-[0.96px] border-[#867b76] bg-mint font-stardust text-[26px] leading-none text-cocoa ${narrow ? "left-[208px] top-[13px]" : "left-[233px] top-[12px]"}`}
          >
            ♥
          </span>
        )}
      </span>
    </button>
  );
};
