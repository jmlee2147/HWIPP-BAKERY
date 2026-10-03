import type { ComponentPropsWithRef } from "react";

const WIDTH = 812.69;
const HEIGHT = 390.83;
const TILT = 5.5;
const STAR_SIZE = 28;

// 별은 판이 기울어도 똑바로 서 있고, 한 줄 걸러 반 칸씩 엇갈린다. 좌표는 판의 왼쪽 위 기준이다.
// 반 칸 옆, 한 줄 위로 흘러가면 원래 무늬와 겹쳐서 끊김 없이 반복된다.
const COLUMN_GAP = 114.3;
const ROW_GAP = 74.42;
const FIRST = { left: -108.73, top: -95.96 };

const STARS = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 11 }, (_, column) => ({
    key: `${row}-${column}`,
    left: FIRST.left + column * COLUMN_GAP + (row % 2) * (COLUMN_GAP / 2),
    top: FIRST.top + row * ROW_GAP,
  })),
).flat();

// 로고 뒤에 깔리는 별무늬 판.
export const LogoPlate = ({
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={`drop-shadow-[5.4px_9.45px_5.4px_rgba(0,0,0,0.15)] ${className}`}
      style={{ width: WIDTH, height: HEIGHT }}
      {...props}
    >
      <div
        className="relative size-full overflow-hidden rounded-[9.45px] bg-chocolate"
        style={{ transform: `rotate(${TILT}deg)` }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: `rotate(${-TILT}deg)` }}
        >
          <div className="absolute inset-0 animate-plate-drift">
            {STARS.map((star) => (
              <img
                key={star.key}
                alt=""
                className="absolute max-w-none"
                src="/assets/logo/plate-star.svg"
                style={{
                  left: star.left - STAR_SIZE / 2,
                  top: star.top - STAR_SIZE / 2,
                  width: STAR_SIZE,
                  height: STAR_SIZE,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
