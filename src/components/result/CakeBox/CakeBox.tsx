import type { ComponentPropsWithRef } from "react";
import { Cake } from "@/components/cake/Cake/Cake";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import {
  BOX_CAKE,
  BOX_CAKE_SIZES,
  BOX_STAMP_FRAME,
  BOX_STAMPS,
  CAKE_BOX,
  CAKE_BOX_IMAGE,
} from "@/data/result";
import { cakeScale } from "@/lib/cake";

// 뒷판의 기울기. 눕힌 좌표계 안에서 돌리고, 세로로 살짝 누르고, 비튼다.
const STAMP_SLANT = "rotate(75deg) scaleY(0.97) skewX(-15deg)";

interface CakeBoxProps extends ComponentPropsWithRef<"div"> {
  cake: CakeConfig;
  date: string;
  orderNumber: string;
}

// 뚜껑이 열린 케이크 상자. 케이크, 날짜, 번호만 바뀌고 나머지는 상자 그림 한 장이다.
export const CakeBox = ({
  cake,
  date,
  orderNumber,
  className = "",
  style,
  ...props
}: CakeBoxProps) => {
  const stamps = [
    { key: "date", text: date, ...BOX_STAMPS.date },
    { key: "orderNumber", text: orderNumber, ...BOX_STAMPS.orderNumber },
  ];

  return (
    <div
      className={className}
      // 바깥에서 자리를 style로 넘겨도 상자의 크기는 지킨다.
      style={{ ...style, width: CAKE_BOX.width, height: CAKE_BOX.height }}
      {...props}
    >
      <div className="relative size-full">
        <img
          alt=""
          className="absolute inset-0 block size-full max-w-none"
          src={CAKE_BOX_IMAGE}
        />

        {/* 화면을 오른쪽으로 눕힌 좌표계를 상자 위에 다시 세운다. 글자의 자리와 기울기는 이 안에서 잡는다. */}
        <div
          className="pointer-events-none absolute h-[1080px] w-[1920px] origin-top-left"
          style={{
            left: BOX_STAMP_FRAME.left,
            top: BOX_STAMP_FRAME.top,
            transform: "translateY(1920px) rotate(-90deg)",
          }}
        >
          {stamps.map((stamp) => (
            <div
              key={stamp.key}
              className="absolute flex items-center justify-center"
              style={{
                left: stamp.centerX - stamp.width / 2,
                top: stamp.top,
                width: stamp.width,
                height: stamp.height,
              }}
            >
              <p
                className="shrink-0 whitespace-nowrap text-center font-stardust text-[19.088px] font-bold leading-[18.686px] tracking-[-0.4772px] text-cocoa"
                style={{ transform: STAMP_SLANT }}
              >
                {stamp.text}
              </p>
            </div>
          ))}
        </div>

        {/* 케이크는 크기에 따라 스스로 줄어든다. 그 배율을 상자용 배율로 바꿔 끼운다. */}
        <div
          className="absolute origin-bottom"
          style={{
            left: BOX_CAKE.centerX - CAKE_BOARD.width / 2,
            top: BOX_CAKE.bottom - CAKE_BOARD.height,
            transform: `scale(${(BOX_CAKE.scale * BOX_CAKE_SIZES[cake.size]) / cakeScale(cake.size)})`,
          }}
        >
          <Cake cake={cake} />
        </div>
      </div>
    </div>
  );
};
