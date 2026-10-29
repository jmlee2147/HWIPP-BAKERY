"use client";

import type { ComponentPropsWithRef } from "react";
import { playEffect } from "@/lib/sound";

type ChoiceTone = "pink" | "mint" | "lime" | "cocoa";

// 어두운 바탕은 덜 비치게 하고 글자를 밝게 바꾼다.
const TONES: Record<ChoiceTone, { fill: string; face: string; text: string }> =
  {
    pink: { fill: "bg-petal", face: "opacity-60", text: "text-cocoa" },
    mint: { fill: "bg-mint", face: "opacity-60", text: "text-cocoa" },
    lime: { fill: "bg-[#f2ffc7]", face: "opacity-60", text: "text-cocoa" },
    cocoa: { fill: "bg-cocoa", face: "opacity-80", text: "text-[#ffd8ed]" },
  };

// 전체 너비 버튼은 별이 좌우에 두 개씩, 둘이 나란히 놓이는 반 너비 버튼은 하나씩 놓인다.
// 정사각에 가까운 작은 버튼 옆에 붙는 넓은 버튼은 왼쪽에만 두 개 놓인다.
const WIDE_FACE = "inset-[4.32%_0.94%]";
const SIZES = {
  full: {
    width: "w-[957px]",
    face: WIDE_FACE,
    stars: [
      "left-[38.47px]",
      "left-[80.29px]",
      "right-[36.75px]",
      "right-[78.57px]",
    ],
  },
  half: {
    width: "w-[473px]",
    face: WIDE_FACE,
    stars: ["left-[38.4px]", "right-[37.8px]"],
  },
  wide: {
    width: "w-[796px]",
    face: WIDE_FACE,
    stars: ["left-[38.47px]", "left-[80.29px]"],
  },
  small: { width: "w-[142px]", face: "inset-[4.27%_4.05%]", stars: [] },
};

interface ChoiceButtonProps extends ComponentPropsWithRef<"button"> {
  tone?: ChoiceTone;
  size?: keyof typeof SIZES;
}

export const ChoiceButton = ({
  tone = "pink",
  size = "full",
  type = "button",
  className = "",
  children,
  onClick,
  ...props
}: ChoiceButtonProps) => {
  const { fill, face, text } = TONES[tone];
  const { width, face: inset, stars } = SIZES[size];

  return (
    <button
      type={type}
      className={`h-[133.15px] ${width} transition-transform duration-100 active:scale-[0.98] disabled:opacity-40 ${className}`}
      onClick={(event) => {
        playEffect("choice");
        onClick?.(event);
      }}
      {...props}
    >
      <span className="relative block size-full">
        <span className="absolute inset-0 rounded-[8.52px] bg-[#f2f2f2] opacity-70 shadow-[-0.682px_1.022px_19.957px_0px_rgba(255,255,255,0.63)]" />
        <span
          className={`absolute ${inset} rounded-[8.52px] border-[0.341px] border-[#909090] ${face}`}
        >
          <span className={`absolute inset-0 rounded-[8.52px] ${fill}`} />
          <span className="absolute inset-0 rounded-[inherit] shadow-[inset_3.749px_-2.979px_21.297px_0px_rgba(255,255,255,0.47)]" />
        </span>
        {stars.map((position) => (
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
