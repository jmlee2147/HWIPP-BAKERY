"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type TargetAndTransition,
} from "motion/react";
import { type ComponentPropsWithRef, useEffect, useState } from "react";
import { type RecipientStyle, STYLES, type StyleId } from "@/data/styles";

const WINDOW_DOT = "absolute rounded-full";
const MENU_LINE = "absolute rounded-full bg-black";
const NAV_TRIANGLE =
  "absolute top-[94.5px] block h-[15.65px] w-[17.74px] max-w-none";

// 강조되는 말이 다음 말로 넘어가는 간격.
const QUOTE_TURN_MS = 2500;

// 요약 창은 살짝 커지며 나타나고, 사라질 때는 작아지며 흐려진다.
// 크기를 크게 바꾸면 안의 글자를 프레임마다 다시 그려 끊겨 보이므로 변화 폭을 작게 둔다.
const SUMMARY_MOTION: Record<
  "initial" | "animate" | "exit",
  TargetAndTransition
> = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const NAME_SIZE = {
  large: "text-[79.6px] tracking-[-1.99px]",
  small: "text-[59.7px] tracking-[-1.49px]",
};

interface StyleWindowProps extends ComponentPropsWithRef<"div"> {
  recipient: RecipientStyle;
  summaryOpen: boolean;
  onToggleSummary: () => void;
  onSelectStyle: (id: StyleId) => void;
}

// 고른 스타일을 소개하는 창. 내용은 스타일 데이터만 보고 그린다.
export const StyleWindow = ({
  recipient,
  summaryOpen,
  onToggleSummary,
  onSelectStyle,
  className = "",
  ...props
}: StyleWindowProps) => {
  const quoteCount = recipient.quotes[0].length + recipient.quotes[1].length;
  const [activeQuote, setActiveQuote] = useState(0);

  // 자주 하는 말이 하나씩 차례로 강조된다. 화면이 가만히 멈춰 있지 않게 하기 위해서다.
  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveQuote((current) => (current + 1) % quoteCount),
      QUOTE_TURN_MS,
    );
    return () => window.clearInterval(timer);
  }, [quoteCount]);

  return (
    <div className={`h-[1015px] w-[962px] ${className}`} {...props}>
      <div className="relative size-full overflow-hidden rounded-[10.61px] bg-white font-pretendard shadow-[3.182px_9.547px_31.824px_0px_rgba(0,0,0,0.15)]">
        <div
          className={`${WINDOW_DOT} left-[25.46px] top-[25.46px] size-[21.09px] bg-candy`}
        />
        <div
          className={`${WINDOW_DOT} left-[57.16px] top-[25.46px] size-[21.09px] bg-[#ffe6a7]`}
        />
        <div
          className={`${WINDOW_DOT} left-[88.86px] top-[25.46px] size-[21.09px] bg-[#e6f4a4]`}
        />
        {[26.46, 34.95, 43.43].map((top) => (
          <div
            key={top}
            className={`${MENU_LINE} left-[905.93px] h-[2.12px] w-[27.58px]`}
            style={{ top }}
          />
        ))}
        <div className="absolute left-[24.4px] top-[72.6px] h-[1.59px] w-[914.41px] bg-[#e4e4e4]" />

        <div className="absolute left-[24.4px] top-[83.8px] h-[559.04px] w-[116.69px] rounded-[10.61px] bg-white shadow-[1.061px_3.182px_13.048px_0px_rgba(0,0,0,0.1)]">
          <div className="absolute left-[8.9px] top-[12.73px] h-[15.35px] w-[16.14px] bg-cocoa [mask-image:url(/assets/ui/bubble/star.svg)] [mask-repeat:no-repeat] [mask-size:100%_100%]" />
          <p className="absolute left-[31.83px] top-[4.24px] whitespace-nowrap text-[13.79px] font-semibold leading-[33.95px] tracking-[-0.34px] text-cocoa">
            즐겨찾기
          </p>
          {STYLES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${item.name} 즐겨찾기`}
              aria-pressed={item.id === recipient.id}
              className={`absolute left-[18.03px] size-[80.62px] bg-[#d9d9d9] ${item.id === recipient.id ? "border-[3px] border-candy" : ""}`}
              style={{ top: 46.67 + index * 102.9 }}
              onClick={() => onSelectStyle(item.id)}
            />
          ))}
        </div>

        <img
          alt=""
          className={`${NAV_TRIANGLE} left-[169.27px] -rotate-90`}
          src="/assets/ui/window/triangle.svg"
        />
        <div className="absolute left-[199.36px] top-[94.41px] h-[16.97px] w-[1.06px] bg-[#e4e4e4]" />
        <img
          alt=""
          className={`${NAV_TRIANGLE} left-[212.76px] rotate-90`}
          src="/assets/ui/window/triangle.svg"
        />
        <p className="absolute left-[247.62px] top-[84.86px] whitespace-nowrap text-[23.34px] font-semibold leading-[33.95px] tracking-[-0.58px] text-[#909090]">
          Recipient Style
        </p>

        <div className="absolute left-[166.55px] top-[138.96px] size-[247.17px] rounded-[10px] bg-[#d9d9d9]" />

        <div className="absolute left-[447.71px] top-[158px] flex h-[47.49px]">
          <button
            type="button"
            aria-expanded={summaryOpen}
            className={`-my-[20px] flex h-[87.49px] shrink-0 items-center whitespace-nowrap font-semibold leading-[47.49px] text-black ${NAME_SIZE[recipient.nameSize]}`}
            onClick={onToggleSummary}
          >
            <span className="relative block">
              {recipient.name}
              {/* 이름 위로 분홍 바탕이 형광펜처럼 왼쪽에서 천천히 그어졌다가 서서히 사라지기를 되풀이한다. */}
              {/* 바탕은 왼쪽에서 밀려 들어오고, 그 안의 흰 글자는 반대로 움직여 제자리에 머문다. */}
              <span
                aria-hidden
                className="absolute -inset-x-[8px] top-1/2 block h-[1.18em] -translate-y-1/2 animate-name-highlight-fade overflow-hidden motion-reduce:hidden"
              >
                <span className="block size-full animate-name-highlight-sweep overflow-hidden bg-candy">
                  <span className="flex size-full animate-name-highlight-hold items-center px-[8px] text-white">
                    {recipient.name}
                  </span>
                </span>
              </span>
            </span>
          </button>
        </div>
        <p className="absolute left-[447.71px] top-[236px] whitespace-pre text-[30px] font-medium leading-[39px] tracking-[-0.75px] text-black">
          {recipient.tagline}
        </p>

        <div className="absolute left-[167px] top-[406px] h-[237px] w-[772px] rounded-[10px] border border-[#d9d9d9]" />
        <p
          className="absolute left-[190px] top-[431px] whitespace-pre-line text-[28px] font-light leading-[42px] tracking-[-0.7px] text-black"
          style={{ width: recipient.descriptionWidth }}
        >
          {recipient.description}
        </p>

        <p className="absolute left-[24px] top-[668px] whitespace-nowrap text-[21px] font-medium leading-[30px] tracking-[-0.53px] text-[#909090]">
          자주 하는 말
        </p>
        {recipient.quotes.map((row, rowIndex) => (
          <div
            key={row[0]}
            className="absolute left-[25px] flex gap-[11px]"
            style={{ top: rowIndex === 0 ? 708.6 : 788.47 }}
          >
            {row.map((quote, index) => (
              <p
                key={quote}
                className={`flex h-[65px] shrink-0 items-center whitespace-nowrap rounded-[10px] bg-[#f2f2f2] px-[33.5px] text-[23.53px] font-medium leading-[32.21px] tracking-[-0.59px] ${rowIndex * recipient.quotes[0].length + index === activeQuote ? "text-candy" : "text-black/70"}`}
              >
                {`"${quote}"`}
              </p>
            ))}
          </div>
        ))}

        <div className="absolute left-[23px] top-[870px] flex h-[105.33px] w-[917px] items-center rounded-[10.78px] bg-blush pl-[33.26px]">
          <p className="w-[68.52px] shrink-0 text-[22.45px] font-bold leading-[29.74px] tracking-[-0.56px] text-candy">
            특징
          </p>
          <ul className="flex gap-[24px]">
            {recipient.traits.map((trait) => (
              <li
                key={trait}
                className="flex shrink-0 items-center gap-[9.35px] whitespace-nowrap text-[23.12px] font-medium leading-[33.4px] tracking-[-0.58px] text-black/70"
              >
                <span className="block h-[10.9px] w-[12px] rounded-full bg-black/70" />
                {trait}
              </li>
            ))}
          </ul>
        </div>

        <MotionConfig reducedMotion="user">
          <AnimatePresence>
            {summaryOpen && (
              <motion.button
                type="button"
                className="absolute left-[278px] top-[303px] h-[204.87px] w-[604.8px] rounded-[8.16px] bg-white will-change-transform shadow-[2.449px_7.346px_24.486px_0px_rgba(0,0,0,0.15)]"
                initial={SUMMARY_MOTION.initial}
                animate={SUMMARY_MOTION.animate}
                exit={SUMMARY_MOTION.exit}
                onClick={onToggleSummary}
              >
                <span
                  className={`${WINDOW_DOT} left-[18.77px] top-[18.77px] size-[16.23px] bg-candy`}
                />
                <span
                  className={`${WINDOW_DOT} left-[43.16px] top-[18.77px] size-[16.23px] bg-[#ffe6a7]`}
                />
                <span
                  className={`${WINDOW_DOT} left-[67.55px] top-[18.77px] size-[16.23px] bg-[#e6f4a4]`}
                />
                {[19.54, 26.07, 32.6].map((top) => (
                  <span
                    key={top}
                    className={`${MENU_LINE} left-[565.34px] h-[1.63px] w-[21.22px]`}
                    style={{ top }}
                  />
                ))}
                <span className="absolute left-[18.77px] top-[51.01px] h-[1.22px] w-[567.26px] bg-[#e4e4e4]" />
                <span
                  className="absolute left-[18.77px] top-[71.01px] flex h-[114.27px] w-[567.26px] items-center justify-center whitespace-nowrap rounded-[8.16px] bg-mint font-stardust font-bold leading-[34px] tracking-[-0.025em] text-[#00d8d8]"
                  style={{ fontSize: recipient.summarySize }}
                >
                  {recipient.summary}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  );
};
