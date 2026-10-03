"use client";

import type { ComponentPropsWithRef } from "react";
import { playEffect } from "@/lib/sound";

type ConfirmTone = "pink" | "brown";

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
};

interface ConfirmButtonProps extends ComponentPropsWithRef<"button"> {
  tone?: ConfirmTone;
}

// 문답 화면 아래에서 고른 답을 확정하는 버튼.
export const ConfirmButton = ({
  tone = "pink",
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
      className={`h-[87.16px] w-[608px] transition-transform duration-100 active:scale-[0.98] disabled:opacity-40 ${className}`}
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
          className={`absolute left-[5.73px] top-[3.76px] h-[79.63px] w-[596.55px] rounded-[6.48px] border-[0.26px] border-[#909090] ${toneClass.frame}`}
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
