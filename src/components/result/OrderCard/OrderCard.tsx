import type { ComponentPropsWithRef } from "react";
import { Cake } from "@/components/cake/Cake/Cake";
import { Awning } from "@/components/common/Awning/Awning";
import { SizeGuide } from "@/components/common/SizeGuide/SizeGuide";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import {
  CARD_CAKE,
  CARD_CAKE_SIZES,
  CARD_DOT_GROUPS,
  CARD_HEARTS,
  CARD_LABELS,
  CARD_PLUS_ONES,
  CLOVER_IMAGE,
  DOT_SHADOW,
  DOT_SIZE,
  LOGO_IMAGES,
  PLUS_STAR_IMAGE,
} from "@/data/result";
import { cakeScale } from "@/lib/cake";

const layer = "absolute block max-w-none";
const stamp =
  "absolute whitespace-nowrap font-stardust text-[26.05px] font-bold leading-[25.5px] tracking-[-0.65px] text-cocoa";

interface OrderCardProps extends ComponentPropsWithRef<"div"> {
  cake: CakeConfig;
  date: string;
  orderNumber: string;
}

// 주문서 모양의 카드. 케이크, 날짜, 번호만 바뀌고 나머지는 늘 같은 장식이다.
export const OrderCard = ({
  cake,
  date,
  orderNumber,
  className = "",
  ...props
}: OrderCardProps) => {
  return (
    <div
      className={`h-[1005.09px] w-[695.7px] bg-mist shadow-[4px_7px_8px_0px_rgba(0,0,0,0.15)] ${className}`}
      {...props}
    >
      <div className="relative size-full">
        <div className="absolute left-[27px] top-[24px] h-[950px] w-[640px] overflow-hidden border-[0.73px] border-[#c2c2c2] bg-[#fdfcf9]">
          {CARD_DOT_GROUPS.map((group) => (
            <div
              key={`${group.left}-${group.top}`}
              aria-hidden
              className="absolute rounded-full"
              style={{
                // 종이의 테두리 안쪽이 기준이라 카드 좌표에서 종이의 위치를 뺀다.
                left: group.left - 27,
                top: group.top - 24,
                width: DOT_SIZE,
                height: DOT_SIZE,
                boxShadow: DOT_SHADOW,
              }}
            />
          ))}
        </div>

        <div className="absolute left-[27px] top-[24px] h-[114px] w-[640px] border-[0.73px] border-[#c2c2c2] bg-blush" />

        <Awning className="absolute left-[27.15px] top-[631.51px] h-[341.33px] w-[640.16px] text-blush" />

        {CARD_LABELS.map((label) => (
          <div key={label.src} aria-hidden>
            <div
              className={`absolute h-[28.97px] border-[0.48px] border-cocoa bg-blush ${label.faded ? "opacity-70" : ""}`}
              style={label.tag}
            />
            <img alt="" className={layer} src={label.src} style={label.text} />
          </div>
        ))}

        {CARD_HEARTS.map((heart) => (
          <div
            key={`${heart.left}-${heart.top}`}
            aria-hidden
            className="absolute flex size-[31.78px] items-center justify-center rounded-full border-[0.69px] border-[#867b76] bg-mint font-stardust text-[18.55px] leading-none text-cocoa"
            style={heart}
          >
            ♥
          </div>
        ))}

        {CARD_PLUS_ONES.map((item) => (
          <div key={item.star.size} aria-hidden>
            <img
              alt=""
              className={layer}
              src={PLUS_STAR_IMAGE}
              style={{
                left: item.star.left,
                top: item.star.top,
                width: item.star.size,
                height: item.star.size,
              }}
            />
            <span
              className="absolute whitespace-nowrap font-stardust leading-none tracking-[-0.04em] text-cocoa"
              style={{
                left: item.text.left,
                top: item.text.top,
                fontSize: item.text.size,
              }}
            >
              +1
            </span>
          </div>
        ))}

        <p className={`${stamp} left-[50px] top-[163px]`}>{date}</p>
        <p className={`${stamp} left-[51.5px] top-[197.5px]`}>{orderNumber}</p>
        <p aria-hidden className={`${stamp} left-[355px] top-[163px]`}>
          HAVE A GOOD DAY!
        </p>
        <img
          alt=""
          className={`${layer} left-[623px] top-[162px] size-[24px]`}
          src={CLOVER_IMAGE}
        />

        <div className="absolute left-[50px] top-[44px] origin-top-left scale-[0.6188]">
          <SizeGuide />
        </div>
        <img
          alt=""
          className={`${layer} left-[498px] top-[38px] h-[62px] w-[154px]`}
          src={LOGO_IMAGES.hwipp}
        />
        <img
          alt=""
          className={`${layer} left-[517.83px] top-[95.51px] h-[23.15px] w-[107.91px]`}
          src={LOGO_IMAGES.bakery}
        />

        {/* 케이크는 크기에 따라 스스로 줄어든다. 그 배율을 카드용 배율로 바꿔 끼우고, 종이 밖으로 나간 장식은 자른다. */}
        <div className="absolute left-[27px] top-[24px] h-[950px] w-[640px] overflow-hidden">
          <div
            className="absolute origin-bottom"
            style={{
              left: CARD_CAKE.centerX - CAKE_BOARD.width / 2 - 27,
              top: CARD_CAKE.bottom - CAKE_BOARD.height - 24,
              transform: `scale(${(CARD_CAKE.scale * CARD_CAKE_SIZES[cake.size]) / cakeScale(cake.size)})`,
            }}
          >
            <Cake cake={cake} />
          </div>
        </div>
      </div>
    </div>
  );
};
