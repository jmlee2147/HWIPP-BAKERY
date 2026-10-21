import type { ComponentPropsWithRef, ReactNode } from "react";
import { Cake } from "@/components/cake/Cake/Cake";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import {
  BROWSER_IMAGES,
  EDITOR_QUIT,
  WINDOW_CAKE,
  windowCakeLift,
} from "@/data/editor";
import { cakeScale } from "@/lib/cake";

const layer = "absolute block max-w-none";
const FIELD =
  "absolute left-[185.8px] top-[33.8px] h-[51px] border-[1.2px] border-[#686868] bg-[linear-gradient(100deg,rgba(255,255,255,0.8)_27%,rgba(255,255,255,0)_97.5%)] shadow-[inset_3.6px_4.8px_3.6px_0px_rgba(0,0,0,0.05)]";
// 13px 간격의 모눈.
const GRID =
  "bg-white bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-position:10.55px_12.55px] [background-size:13px_13px]";

interface CakeWindowProps extends ComponentPropsWithRef<"div"> {
  cake: CakeConfig;
  // 창의 X를 눌렀을 때.
  onClose: () => void;
  // 케이크 위에 겹쳐 그릴 것. 좌표는 창의 왼쪽 위가 기준이다.
  children?: ReactNode;
}

// 브라우저 창 모양의 미리보기. 케이크 구성만 받아 모눈 위에 그린다. 누를 수 있는 것은 X뿐이고, 주소 칸과 화살표는 장식이다.
export const CakeWindow = ({
  cake,
  onClose,
  children,
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
          className={`${layer} left-[21.8px] top-[29.8px] size-[60px]`}
          src={BROWSER_IMAGES.back}
        />
        <img
          alt=""
          className={`${layer} left-[101.8px] top-[29.8px] size-[60px]`}
          src={BROWSER_IMAGES.forward}
        />
        <div className={`${FIELD} w-[615px]`} />
        <div className={`${FIELD} w-[570.1px]`} />
        <p className="absolute left-[313.8px] top-[34.8px] -translate-x-1/2 whitespace-nowrap font-dinaru text-[20px] leading-[49.2px] tracking-[0.4px] text-[#a2a2a2]">
          www.WHIPPBAKERY.com
        </p>
        <img
          alt=""
          className={`${layer} left-[706.6px] top-[45.8px] size-[28.4px]`}
          src={BROWSER_IMAGES.clear}
        />
        <div
          className={`absolute left-[37px] top-[191px] h-[545px] w-[877px] border-[1.45px] border-[#cacaca] shadow-[inset_4.47px_4.47px_11.62px_0px_rgba(0,0,0,0.1)] ${GRID}`}
        />

        <div
          className="absolute origin-bottom"
          style={{
            left: WINDOW_CAKE.centerX - CAKE_BOARD.width / 2,
            top:
              WINDOW_CAKE.bottom -
              CAKE_BOARD.height -
              windowCakeLift(cakeScale(cake.size)),
            transform: `scale(${WINDOW_CAKE.scale})`,
          }}
        >
          <Cake cake={cake} />
        </div>
        {children}
        {/* 장식 조절 상자보다 위에 둔다. 보이는 높이는 52px이고, 터치 영역만 위아래로 18px씩 넓혔다. */}
        <button
          type="button"
          aria-label={EDITOR_QUIT.label}
          className="absolute left-[813.8px] top-[15.8px] flex h-[88px] w-[113px] items-center transition-transform duration-100 active:scale-95"
          onClick={onClose}
        >
          <img
            alt=""
            draggable={false}
            className="block h-[52px] w-[113px] max-w-none"
            src={BROWSER_IMAGES.close}
          />
        </button>
      </div>
    </div>
  );
};
