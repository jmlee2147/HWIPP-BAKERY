"use client";

import type { ComponentPropsWithRef } from "react";
import { playEffect } from "@/lib/sound";

type ChoiceTone = "pink" | "mint" | "cocoa";

// 어두운 바탕은 덜 비치게 하고 글자를 밝게 바꾼다.
const TONES: Record<ChoiceTone, { fill: string; face: string; text: string }> =
  {
    pink: { fill: "bg-petal", face: "opacity-60", text: "text-cocoa" },
    mint: { fill: "bg-mint", face: "opacity-60", text: "text-cocoa" },
    cocoa: { fill: "bg-cocoa", face: "opacity-80", text: "text-[#ffd8ed]" },
  };

// 별은 좌우에 두 개씩 놓인다.
const STARS = [
  "left-[38.47px]",
  "left-[80.29px]",
  "right-[36.75px]",
  "right-[78.57px]",
];

interface ChoiceButtonProps extends ComponentPropsWithRef<"button"> {
  tone?: ChoiceTone;
}

export const ChoiceButton = ({
  tone = "pink",
  type = "button",
  className = "",
  children,
  onClick,
  ...props
}: ChoiceButtonProps) => {
  const { fill, face, text } = TONES[tone];

  return (
    <button
      type={type}
      className={`h-[133.15px] w-[957px] transition-transform duration-100 active:scale-[0.98] disabled:opacity-40 ${className}`}
      onClick={(event) => {
        playEffect("choice");
        onClick?.(event);
      }}
      {...props}
    >
      <span className="relative block size-full">
        <span className="absolute inset-0 rounded-[8.52px] bg-[#f2f2f2] opacity-70 shadow-[-0.682px_1.022px_19.957px_0px_rgba(255,255,255,0.63)]" />
        <span
          className={`absolute inset-[4.32%_0.94%] rounded-[8.52px] border-[0.341px] border-[#909090] ${face}`}
        >
          <span className={`absolute inset-0 rounded-[8.52px] ${fill}`} />
          <span className="absolute inset-0 rounded-[inherit] shadow-[inset_3.749px_-2.979px_21.297px_0px_rgba(255,255,255,0.47)]" />
        </span>
        {STARS.map((position) => (
          <span
            key={position}
            className={`absolute top-[50.46px] h-[32.22px] w-[32.16px] ${position}`}
          >
            <img
              alt=""
              className="absolute inset-[-13.87%_-11.42%_-4.32%_-11.42%] block h-[118.19%] w-[122.84%] max-w-none"
              src="/assets/ui/button/star.svg"
            />
          </span>
        ))}
        <span
          className={`absolute inset-0 flex items-center justify-center whitespace-nowrap font-stardust text-body ${text}`}
        >
          {children}
        </span>
      </span>
    </button>
  );
};
