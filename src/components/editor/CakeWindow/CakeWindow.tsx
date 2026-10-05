import type { ComponentPropsWithRef } from "react";
import { Cake } from "@/components/cake/Cake/Cake";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import { BROWSER_IMAGES, WINDOW_CAKE } from "@/data/editor";

const layer = "absolute block max-w-none";
const FIELD =
  "absolute top-[55px] h-[44.4px] border-[1.2px] border-[#686868] bg-[linear-gradient(100deg,rgba(255,255,255,0.8)_27%,rgba(255,255,255,0)_97.5%)] shadow-[inset_3.6px_4.8px_3.6px_0px_rgba(0,0,0,0.05)]";
const TITLE_BUTTON = "top-[17.87px] h-[26.81px] w-[46.91px]";
// 13px 간격의 모눈.
const GRID =
  "bg-white bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-position:10.55px_12.55px] [background-size:13px_13px]";

interface CakeWindowProps extends ComponentPropsWithRef<"div"> {
  cake: CakeConfig;
}

// 브라우저 창 모양의 미리보기. 케이크 구성만 받아 모눈 위에 그린다. 창의 단추와 주소 칸은 장식이라 누를 수 없다.
export const CakeWindow = ({
  cake,
  className = "",
  ...props
}: CakeWindowProps) => {
  return (
    <div
      className={`h-[790px] w-[945px] overflow-hidden rounded-[5.75px] border-[2.23px] border-[#8b4b5e] bg-[linear-gradient(166.36deg,rgba(255,241,249,0.8)_31.6%,rgba(250,250,250,0.4)_65.9%)] ${className}`}
      {...props}
    >
      <div className="relative size-full">
        <div className="absolute left-[13.77px] top-[111.77px] h-[1141px] w-[913px] border-[3px] border-[#edf6ff] bg-[linear-gradient(156.62deg,rgba(255,255,255,0.8)_14%,rgba(255,242,249,0)_91.2%)]">
          <div className="absolute left-[23px] top-[29px] h-[20px] w-[415px] bg-[#f2ffc7]" />
          <p className="absolute left-[229.5px] top-[6px] -translate-x-1/2 whitespace-nowrap font-kiwi text-[46.17px] leading-[65.41px] text-cocoa">
            Customize it your way
          </p>
          <img
            alt=""
            className={`${layer} left-[447.5px] top-[30.2px] h-[21px] w-[103px]`}
            src={BROWSER_IMAGES.face}
          />
        </div>

        <img
          alt=""
          className={`${layer} left-[13.77px] top-[48.76px] h-[51.36px] w-[95.59px]`}
          src={BROWSER_IMAGES.nav}
        />
        <div className={`${FIELD} left-[118px] w-[465.6px]`} />
        <p className="absolute left-[224.77px] top-[49.77px] -translate-x-1/2 whitespace-nowrap font-dinaru text-[18px] leading-[49.2px] tracking-[0.36px] text-[#a2a2a2]">
          www.WHIPPBAKERY.com
        </p>
        <div className={`${FIELD} left-[590.8px] w-[218.4px]`} />
        <div className={`${FIELD} left-[590.8px] w-[176.4px]`} />
        <img
          alt=""
          className={`${layer} left-[736px] top-[65.8px] size-[24px]`}
          src={BROWSER_IMAGES.clear}
        />

        <div
          className={`absolute left-[775.14px] rounded-[3.35px] border-[0.84px] border-[#8a8080] bg-[linear-gradient(to_bottom,#ffd8ed,#fda6d5_60.9%,#ffd8ed)] shadow-[inset_3.35px_1.68px_8.04px_0px_rgba(255,255,255,0.59)] ${TITLE_BUTTON}`}
        >
          <div className="absolute left-[14.23px] top-[15.92px] h-[5.03px] w-[16.75px] border-[0.84px] border-[#8a8080] bg-white" />
        </div>
        <img
          alt=""
          className={`${layer} left-[827.63px] ${TITLE_BUTTON}`}
          src={BROWSER_IMAGES.maximize}
        />
        <img
          alt=""
          className={`${layer} left-[880.13px] ${TITLE_BUTTON}`}
          src={BROWSER_IMAGES.close}
        />

        <div
          className={`absolute left-[37px] top-[191px] h-[545px] w-[877px] border-[1.45px] border-[#cacaca] shadow-[inset_4.47px_4.47px_11.62px_0px_rgba(0,0,0,0.1)] ${GRID}`}
        />

        <div
          className="absolute origin-bottom"
          style={{
            left: WINDOW_CAKE.centerX - CAKE_BOARD.width / 2,
            top: WINDOW_CAKE.bottom - CAKE_BOARD.height,
            transform: `scale(${WINDOW_CAKE.scale})`,
          }}
        >
          <Cake cake={cake} />
        </div>
      </div>
    </div>
  );
};
