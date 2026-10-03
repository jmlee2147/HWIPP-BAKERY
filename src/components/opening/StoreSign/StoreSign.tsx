import type { ComponentPropsWithRef } from "react";

const layer = "absolute block max-w-none";

// 가게 간판. 분홍 바탕은 뒤의 벽 색과 섞여 보이도록 hard-light로 겹친다.
export const StoreSign = ({
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      role="img"
      aria-label="HWIPP BAKERY"
      className={`h-[223.62px] w-[356.24px] ${className}`}
      {...props}
    >
      <div className="relative size-full">
        <img
          alt=""
          className={`${layer} left-[72.8px] top-[22.1px] h-[188.88px] w-[221.08px] opacity-40`}
          src="/assets/logo/heart-back.svg"
        />
        <img
          alt=""
          className={`${layer} inset-0 size-full mix-blend-hard-light drop-shadow-[3px_3px_2px_rgba(0,0,0,0.25)]`}
          src="/assets/logo/emblem-pink.png"
        />
        <img
          alt=""
          className={`${layer} left-[74.48px] top-[29.9px] h-[189.06px] w-[219.9px] mix-blend-hard-light`}
          src="/assets/logo/heart.svg"
        />
        <img
          alt=""
          className={`${layer} left-[82px] top-[136.64px] h-[42.02px] w-[195.88px]`}
          src="/assets/logo/bakery-dots.svg"
        />
        <img
          alt=""
          className={`${layer} left-[30.39px] top-[31.16px] h-[108px] w-[300px]`}
          src="/assets/logo/hwipp.svg"
        />
      </div>
    </div>
  );
};
