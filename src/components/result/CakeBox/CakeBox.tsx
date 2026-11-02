import type { ComponentPropsWithRef } from "react";
import { Cake } from "@/components/cake/Cake/Cake";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import {
  BOX_CAKE,
  BOX_CAKE_AREA,
  BOX_CAKE_SIZES,
  BOX_FLOOR,
  BOX_STAMP_FRAME,
  BOX_STAMPS,
  CAKE_BOX,
  CAKE_BOX_IMAGE,
} from "@/data/result";
import { cakeBaseBox, cakeExtent, cakeScale } from "@/lib/cake";

// 뒷판의 기울기. 눕힌 좌표계 안에서 돌리고, 세로로 살짝 누르고, 비튼다.
const STAMP_SLANT = "rotate(75deg) scaleY(0.97) skewX(-15deg)";

// 상자에 담을 때의 배율. 판의 아래쪽 가운데를 기준으로 줄이므로,
// 그 기준점에서 끝까지의 거리가 상자 안쪽까지의 거리를 넘지 않게 한다.
// 좌우는 바탕이 바닥면 안에 놓이는지로, 위아래는 그림 전체가 상자를 넘는지로 본다.
// 장식은 바닥면 밖으로 뻗어도 괜찮다. 바닥면 위의 빈 자리이기 때문이다.
export function boxCakeScale(cake: CakeConfig): number {
  const extent = cakeExtent(cake);
  const base = cakeBaseBox(cake);
  const centerX = CAKE_BOARD.width / 2;
  const room = [
    [BOX_CAKE.centerX - BOX_FLOOR.left, centerX - base.left],
    [BOX_FLOOR.right - BOX_CAKE.centerX, base.left + base.width - centerX],
    [BOX_CAKE.bottom - BOX_CAKE_AREA.top, CAKE_BOARD.height - extent.top],
    [
      BOX_CAKE_AREA.bottom - BOX_CAKE.bottom,
      extent.top + extent.height - CAKE_BOARD.height,
    ],
  ];
  // 기준점에서 그 방향으로 뻗지 않으면 그 쪽은 넘칠 일이 없다.
  const limits = room
    .filter(([, reach]) => reach > 0)
    .map(([space, reach]) => space / reach);
  return Math.min(BOX_CAKE.scale * BOX_CAKE_SIZES[cake.size], ...limits);
}

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
            transform: `scale(${boxCakeScale(cake) / cakeScale(cake.size)})`,
          }}
        >
          <Cake cake={cake} />
        </div>
      </div>
    </div>
  );
};
