import type { ComponentPropsWithRef } from "react";

// 로고 본체. 582.45x365.62 기준으로 그리고, 다른 크기는 바깥에서 scale로 맞춘다.
export const LogoEmblem = ({
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      role="img"
      aria-label="HWIPP BAKERY"
      className={`h-[365.62px] w-[582.45px] ${className}`}
      {...props}
    >
      <div className="relative size-full">
        <img
          alt=""
          className="absolute left-[118.05px] top-[40.98px] h-[296.07px] w-[346.57px] max-w-none opacity-40"
          src="/assets/logo/heart-back.svg"
        />
        <img
          alt=""
          className="absolute inset-0 size-full max-w-none drop-shadow-[5.4px_9.45px_5.4px_rgba(0,0,0,0.15)]"
          src="/assets/logo/emblem.png"
        />
        <img
          alt=""
          className="absolute left-[128.31px] top-[48.66px] h-[296.26px] w-[346.57px] max-w-none"
          src="/assets/logo/heart.svg"
        />
        <img
          alt=""
          className="absolute left-[139.87px] top-[228.3px] h-[65.88px] w-[307.06px] max-w-none"
          src="/assets/logo/bakery-dots.svg"
        />
        <img
          alt=""
          className="absolute left-[55.53px] top-[62.94px] h-[169.31px] w-[470.33px] max-w-none"
          src="/assets/logo/hwipp.svg"
        />
      </div>
    </div>
  );
};
