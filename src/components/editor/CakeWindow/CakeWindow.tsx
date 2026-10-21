import type { ComponentPropsWithRef, ReactNode } from "react";
import { Cake } from "@/components/cake/Cake/Cake";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import {
  BROWSER_IMAGES,
  EDITOR_HISTORY_LABELS,
  EDITOR_QUIT,
  WINDOW_CAKE,
  windowCakeLift,
} from "@/data/editor";
import { cakeScale } from "@/lib/cake";

const layer = "absolute block max-w-none";
const FIELD =
  "absolute left-[185.8px] top-[33.8px] h-[51px] border-[1.2px] border-[#686868] bg-[linear-gradient(100deg,rgba(255,255,255,0.8)_27%,rgba(255,255,255,0)_97.5%)] shadow-[inset_3.6px_4.8px_3.6px_0px_rgba(0,0,0,0.05)]";
// 실행 취소와 다시 실행 화살표. 할 수 있으면 큰 분홍 원, 없으면 작은 회색 원이다.
// 두 원은 12px 띄워 놓고, 세로 가운데를 맞춘다. 그림은 테두리만큼 원보다 조금 크다.
const ARROW = {
  on: { size: 76, image: 77 },
  off: { size: 59.2, image: 60 },
};
const ARROW_LEFT = { on: 13.77, off: 17.77 };
const ARROW_GAP = 12;
const ARROW_MIDDLE = 59.8;
// 화살표의 터치 영역 높이. 너비는 두 화살표 사이를 반씩 나눠 갖는다.
const ARROW_TOUCH = 88;

// 13px 간격의 모눈.
const GRID =
  "bg-white bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-position:10.55px_12.55px] [background-size:13px_13px]";

interface CakeWindowProps extends ComponentPropsWithRef<"div"> {
  cake: CakeConfig;
  // 창의 X를 눌렀을 때.
  onClose: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  // 케이크 위에 겹쳐 그릴 것. 좌표는 창의 왼쪽 위가 기준이다.
  children?: ReactNode;
}

// 브라우저 창 모양의 미리보기. 케이크 구성만 받아 모눈 위에 그린다.
// 누를 수 있는 것은 실행 취소, 다시 실행 화살표와 X이고, 주소 칸은 장식이다.
export const CakeWindow = ({
  cake,
  onClose,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  children,
  className = "",
  ...props
}: CakeWindowProps) => {
  const back = ARROW[canUndo ? "on" : "off"];
  const forward = ARROW[canRedo ? "on" : "off"];
  const backLeft = ARROW_LEFT[canUndo ? "on" : "off"];
  const forwardLeft = backLeft + back.size + ARROW_GAP;
  const backCenter = backLeft + back.size / 2;
  const forwardCenter = forwardLeft + forward.size / 2;
  const split = (backCenter + forwardCenter) / 2;
  const arrows = [
    {
      label: EDITOR_HISTORY_LABELS.undo,
      enabled: canUndo,
      onClick: onUndo,
      left: 0,
      width: split,
      center: backCenter,
      image: back.image,
      src: canUndo ? BROWSER_IMAGES.backOn : BROWSER_IMAGES.backOff,
    },
    {
      label: EDITOR_HISTORY_LABELS.redo,
      enabled: canRedo,
      onClick: onRedo,
      left: split,
      width: ARROW_TOUCH,
      center: forwardCenter,
      image: forward.image,
      src: canRedo ? BROWSER_IMAGES.forwardOn : BROWSER_IMAGES.forwardOff,
    },
  ];

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
        {arrows.map((arrow) => (
          <button
            key={arrow.label}
            type="button"
            aria-label={arrow.label}
            disabled={!arrow.enabled}
            className="absolute transition-transform duration-100 enabled:active:scale-95"
            style={{
              left: arrow.left,
              top: ARROW_MIDDLE - ARROW_TOUCH / 2,
              width: arrow.width,
              height: ARROW_TOUCH,
            }}
            onClick={arrow.onClick}
          >
            <img
              alt=""
              draggable={false}
              className={layer}
              style={{
                left: arrow.center - arrow.left - arrow.image / 2,
                top: ARROW_TOUCH / 2 - arrow.image / 2,
                width: arrow.image,
                height: arrow.image,
              }}
              src={arrow.src}
            />
          </button>
        ))}
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
