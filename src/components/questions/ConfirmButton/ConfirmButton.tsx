"use client";

import type { ComponentPropsWithRef } from "react";
import { playEffect } from "@/lib/sound";

// 문답 화면 아래에서 고른 답을 확정하는 버튼.
export const ConfirmButton = ({
  type = "button",
  className = "",
  children,
  onClick,
  ...props
}: ComponentPropsWithRef<"button">) => {
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
        <span className="absolute inset-0 rounded-[6.48px] bg-[#f2f2f2] opacity-70 shadow-[-0.518px_0.777px_15.171px_0px_rgba(255,255,255,0.63)]" />
        <span className="absolute left-[5.73px] top-[3.76px] h-[79.63px] w-[596.55px] rounded-[6.48px] border-[0.26px] border-[#909090] opacity-70">
          <span className="absolute inset-0 rounded-[6.48px] bg-petal" />
          <span className="absolute inset-0 rounded-[inherit] shadow-[inset_2.85px_-2.264px_16.19px_0px_rgba(255,255,255,0.47)]" />
        </span>
        <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-stardust text-[31.7px] font-bold leading-[38.49px] tracking-[0.634px] text-[#5e3e23]">
          {children}
        </span>
      </span>
    </button>
  );
};
