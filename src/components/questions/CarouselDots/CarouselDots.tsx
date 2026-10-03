import type { ComponentPropsWithRef } from "react";

interface CarouselDotsProps
  extends Omit<ComponentPropsWithRef<"div">, "onSelect"> {
  // 점마다 붙는 이름. 화면을 읽어 주는 도구가 쓴다.
  labels: string[];
  active: number;
  onSelect: (index: number) => void;
  // 어두운 배경 위에서는 밝은 바탕을 쓴다.
  tone?: "dark" | "light";
}

// 카드가 몇 장이고 지금 몇 번째인지 보여 주는 점. 눌러서 그 카드로 바로 갈 수도 있다.
export const CarouselDots = ({
  labels,
  active,
  onSelect,
  tone = "dark",
  className = "",
  ...props
}: CarouselDotsProps) => {
  return (
    <div className={`h-[58.66px] w-[223.77px] ${className}`} {...props}>
      <div className="relative size-full">
        <div
          className={`absolute inset-0 rounded-full bg-taupe transition-opacity duration-500 motion-reduce:transition-none ${tone === "light" ? "opacity-0" : "opacity-80"}`}
        />
        <div
          className={`absolute inset-0 rounded-full bg-blush transition-opacity duration-500 motion-reduce:transition-none ${tone === "light" ? "opacity-80" : "opacity-0"}`}
        />
        {/* 점 사이가 좁아 누르는 영역을 옆으로는 넓힐 수 없다. 위아래로만 넓히고, 같은 조작은 화살표로도 할 수 있다. */}
        <div className="relative flex size-full items-center justify-center">
          {labels.map((label, index) => (
            <button
              key={label}
              type="button"
              aria-label={`${label} 카드 보기`}
              aria-current={index === active}
              className="-my-[14.67px] flex h-[88px] w-[39.73px] items-center justify-center"
              onClick={() => onSelect(index)}
            >
              <span
                className={`block size-[23.4px] rounded-full border-[0.59px] border-cocoa ${index === active ? "bg-cocoa" : "bg-mist"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
