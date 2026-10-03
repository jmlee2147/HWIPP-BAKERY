import type { ComponentPropsWithRef } from "react";

// 장식 레이어의 위치는 말풍선 크기에 대한 inset 비율이다.
// 크림 한 덩이를 11번 반복한다. 뒷줄(0.57%)이 먼저, 앞줄(0)이 그 위에 놓인다.
const CREAMS = [
  "inset-[0.57%_90.07%_78.7%_0]",
  "inset-[0.57%_36.21%_78.7%_53.86%]",
  "inset-[0.57%_72.01%_78.7%_18.06%]",
  "inset-[0.57%_18.15%_78.7%_71.92%]",
  "inset-[0.57%_54.11%_78.7%_35.96%]",
  "inset-[0_81.05%_79.27%_9.02%]",
  "inset-[0_27.19%_79.27%_62.88%]",
  "inset-[0_62.99%_79.27%_27.08%]",
  "inset-[0_9.13%_79.27%_80.94%]",
  "inset-[0_0.62%_79.27%_89.45%]",
  "inset-[0_45.09%_79.27%_44.98%]",
];

const STARS = [
  "inset-[85.12%_89.68%_4.92%_7.02%]",
  "inset-[85.12%_93.43%_4.92%_3.26%]",
];

const layerClass = "absolute block size-full max-w-none";

export const SpeechBubble = ({
  children,
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={`h-[319.14px] w-[962.45px] drop-shadow-[7.235px_10.129px_10.925px_rgba(185,172,172,0.8)] ${className}`}
      {...props}
    >
      <div className="relative size-full">
        <div className="absolute inset-[78.07%_0.93%_0_0.93%] border-[1.447px] border-cream bg-chocolate" />
        <div className="absolute inset-[14.4%_0.86%_19.52%_1%] border-[2.894px] border-cream bg-cream" />
        <div
          aria-hidden
          className="absolute left-[57.5px] right-[31px] top-[113.74px] h-[114.4px] bg-[radial-gradient(circle,theme(colors.blush)_10.98px,transparent_11.5px),radial-gradient(circle,theme(colors.blush)_10.98px,transparent_11.5px)] [background-position:-38.85px_-35px,11.65px_43.5px] [background-repeat:repeat,repeat-x] [background-size:100.1px_92.19px,100.1px_22px]"
        />
        <div className="absolute inset-[14.11%_0_71.5%_0]">
          <img
            alt=""
            className={`${layerClass} inset-0`}
            src="/assets/ui/bubble/cream-base.svg"
          />
        </div>
        {CREAMS.map((position) => (
          <div key={position} className={`absolute ${position}`}>
            <img
              alt=""
              className={`${layerClass} inset-0`}
              src="/assets/ui/bubble/cream.svg"
            />
          </div>
        ))}
        <div className="absolute inset-x-[80px] bottom-[70px] top-[91px] flex flex-col items-center justify-center whitespace-pre-line text-center font-stardust text-body leading-[49.2px] text-cocoa [text-shadow:2.097px_2.097px_2.621px_#d5abc2]">
          {children}
        </div>
        {STARS.map((star) => (
          <div key={star} className={`absolute ${star}`}>
            <img
              alt=""
              className="absolute inset-[0_2.45%_9.55%_2.45%] block h-[90.45%] w-[95.1%] max-w-none"
              src="/assets/ui/bubble/star.svg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
