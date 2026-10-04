import { notFound } from "next/navigation";
import { Cake } from "@/components/cake/Cake/Cake";
import {
  CAKE_BOARD,
  CAKE_COLORS,
  CAKE_SHAPES,
  CAKE_SIZES,
  type CakeConfig,
  DEFAULT_CAKE,
} from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";

const PREVIEW_SCALE = 0.4;

const Tile = ({ cake, label }: { cake: CakeConfig; label: string }) => (
  <figure>
    <div
      className="overflow-hidden bg-[#8d8d8d]"
      style={{
        width: CAKE_BOARD.width * PREVIEW_SCALE,
        height: CAKE_BOARD.height * PREVIEW_SCALE,
      }}
    >
      <div
        className="origin-top-left"
        style={{ transform: `scale(${PREVIEW_SCALE})` }}
      >
        <Cake cake={cake} />
      </div>
    </div>
    <figcaption className="font-pretendard text-[14px] text-cocoa">
      {label}
    </figcaption>
  </figure>
);

// 바탕 조합과 완성 케이크를 한눈에 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
export default function CakePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="fixed inset-0 overflow-auto bg-mist p-[24px]">
      {CAKE_SHAPES.map((shape) => (
        <div key={shape.id} className="mb-[24px] flex flex-wrap gap-[12px]">
          {CAKE_COLORS.map((color) => (
            <Tile
              key={color.id}
              cake={{ ...DEFAULT_CAKE, shape: shape.id, color: color.id }}
              label={`${shape.label} / ${color.label}`}
            />
          ))}
        </div>
      ))}
      <div className="mb-[24px] flex flex-wrap gap-[12px]">
        {CAKE_PRESETS.map((preset) => (
          <Tile key={preset.id} cake={preset.cake} label={preset.id} />
        ))}
      </div>
      <div className="flex flex-wrap gap-[12px]">
        {CAKE_SIZES.map((size) => (
          <Tile
            key={size.id}
            cake={{ ...DEFAULT_CAKE, color: "pink", size: size.id }}
            label={size.label}
          />
        ))}
      </div>
    </main>
  );
}
