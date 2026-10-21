"use client";

import type { ComponentPropsWithRef } from "react";
import { playEffect } from "@/lib/sound";

type ConfirmTone = "pink" | "brown" | "mint" | "gray";

const TONE_CLASS: Record<
  ConfirmTone,
  { plate: string; frame: string; fill: string; text: string }
> = {
  pink: {
    plate: "bg-[#f2f2f2]",
    frame: "opacity-70",
    fill: "bg-petal",
    text: "text-[#5e3e23]",
  },
  brown: {
    plate: "bg-[#e0ecf5]",
    frame: "opacity-80",
    fill: "bg-chocolate",
    text: "text-petal",
  },
  mint: {
    plate: "bg-[#e0ecf5]",
    frame: "opacity-70",
    fill: "bg-mint",
    text: "text-[#5e3e23]",
  },
  gray: {
    plate: "bg-[#f2f2f2]",
    frame: "opacity-70",
    fill: "bg-mist",
    text: "text-[#5e3e23]",
  },
};

// 화면 아래 버튼은 full, 팝업 안에 두 개 나란히 놓는 버튼은 half.
const SIZE_CLASS = { full: "w-[608px]", half: "w-[339px]" };

interface ConfirmButtonProps extends ComponentPropsWithRef<"button"> {
  tone?: ConfirmTone;
  size?: keyof typeof SIZE_CLASS;
}

// 문답 화면 아래에서 고른 답을 확정하는 버튼. 확인 팝업의 선택지로도 쓴다.
export const ConfirmButton = ({
  tone = "pink",
  size = "full",
  type = "button",
  className = "",
  children,
  onClick,
  ...props
}: ConfirmButtonProps) => {
  const toneClass = TONE_CLASS[tone];

  return (
    <button
      type={type}
      className={`h-[87.16px] ${SIZE_CLASS[size]} transition-transform duration-100 active:scale-[0.98] disabled:opacity-40 ${className}`}
      onClick={(event) => {
        playEffect("choice");
        onClick?.(event);
      }}
      {...props}
    >
      <span className="relative block size-full">
        <span
          className={`absolute inset-0 rounded-[6.48px] opacity-70 ${toneClass.plate} shadow-[-0.518px_0.777px_15.171px_0px_rgba(255,255,255,0.63)]`}
        />
        <span
          className={`absolute inset-x-[0.94%] inset-y-[3.76px] rounded-[6.48px] border-[0.26px] border-[#909090] ${toneClass.frame}`}
        >
          <span
            className={`absolute inset-0 rounded-[6.48px] ${toneClass.fill}`}
          />
          <span className="absolute inset-0 rounded-[inherit] shadow-[inset_2.85px_-2.264px_16.19px_0px_rgba(255,255,255,0.47)]" />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center whitespace-nowrap font-stardust text-[31.7px] font-bold leading-[38.49px] tracking-[0.634px] ${toneClass.text}`}
        >
          {children}
        </span>
      </span>
    </button>
  );
};
