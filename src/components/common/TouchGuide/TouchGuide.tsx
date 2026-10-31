import type { ComponentPropsWithRef } from "react";

// 화면을 누르면 다음으로 넘어간다고 알려 주는 문구.
export const TouchGuide = ({
  className = "",
  ...props
}: ComponentPropsWithRef<"p">) => (
  <p
    className={`w-full text-center font-stardust text-[40px] font-bold leading-[93px] tracking-[-0.025em] text-white [text-shadow:1px_1px_7.7px_#c12f7d] ${className}`}
    {...props}
  />
);
