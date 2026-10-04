import type { ComponentPropsWithRef } from "react";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import { type CakeLayer, cakeLayers, cakeScale } from "@/lib/cake";

// 돌리기와 뒤집기가 없는 그림에는 transform을 걸지 않는다.
function layerTransform(layer: CakeLayer): string | undefined {
  const parts = [
    layer.rotate ? `rotate(${layer.rotate}deg)` : "",
    layer.flip ? "scaleY(-1)" : "",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

interface CakeProps extends ComponentPropsWithRef<"div"> {
  cake: CakeConfig;
}

// 케이크 구성 데이터만 받아 부품을 겹쳐 그린다. 크기가 달라져도 차지하는 자리는 같고, 판의 아래쪽 가운데를 기준으로 줄어든다.
export const Cake = ({ cake, className = "", ...props }: CakeProps) => {
  return (
    <div
      aria-hidden
      className={className}
      style={{ width: CAKE_BOARD.width, height: CAKE_BOARD.height }}
      {...props}
    >
      <div
        className="relative size-full origin-bottom"
        style={{ transform: `scale(${cakeScale(cake.size)})` }}
      >
        {cakeLayers(cake).map((layer) => (
          <img
            key={layer.key}
            alt=""
            className="absolute max-w-none"
            src={layer.src}
            style={{
              left: layer.left,
              top: layer.top,
              width: layer.width,
              height: layer.height,
              transform: layerTransform(layer),
            }}
          />
        ))}
      </div>
    </div>
  );
};
