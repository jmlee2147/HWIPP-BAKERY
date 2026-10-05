import type { ComponentPropsWithRef } from "react";

const ITEMS = [
  {
    src: "size-1.svg",
    className: "left-[0.94px] top-0 h-[70.81px] w-[90.51px]",
  },
  {
    src: "size-1-text.svg",
    className: "left-0 top-[88px] h-[13.79px] w-[91.6px]",
  },
  {
    src: "size-2.svg",
    className: "left-[119.18px] top-0 h-[70.81px] w-[74.68px]",
  },
  {
    src: "size-2-text.svg",
    className: "left-[112.86px] top-[88px] h-[13.79px] w-[91.6px]",
  },
  {
    src: "size-heart.svg",
    className: "left-[221.6px] top-[3.83px] h-[68.66px] w-[82px]",
  },
  {
    src: "size-heart-text.svg",
    className: "left-[235.07px] top-[89.94px] h-[13.5px] w-[61.63px]",
  },
];

// 케이크 크기 안내. 크기 그림 세 개와 그 아래의 이름표다.
export const SizeGuide = ({
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      aria-hidden
      className={`h-[103.44px] w-[303.6px] ${className}`}
      {...props}
    >
      <div className="relative size-full">
        {ITEMS.map((item) => (
          <img
            key={item.src}
            alt=""
            className={`absolute block max-w-none ${item.className}`}
            src={`/assets/title/${item.src}`}
          />
        ))}
      </div>
    </div>
  );
};
