"use client";

import { type PointerEvent, useRef } from "react";
import { CAKE_BOARD, type CakeConfig } from "@/data/cake";
import {
  CONTROL_BOX,
  CONTROL_IMAGES,
  CONTROL_LABELS,
  DECORATION_SCALE,
  WINDOW_CAKE,
  WINDOW_GRID,
  windowCakeLift,
} from "@/data/editor";
import { cakeLayers, cakeScale, type DecorationChange } from "@/lib/cake";
import { playEffect } from "@/lib/sound";

// 손잡이는 지름 18px의 원이고, 터치 영역만 88px로 넓힌다.
// 좁은 상자에서 손잡이끼리 겹치지 않도록 터치 영역은 상자 바깥쪽으로 치우쳐 있다.
const HANDLE_TOUCH = 88;
const HANDLE_INSIDE = 26;
const HANDLE =
  "absolute flex touch-none items-center justify-center [-webkit-tap-highlight-color:transparent]";
const KNOB =
  "flex size-[18px] items-center justify-center rounded-full bg-[#ff8cc7]";

type Mode = "move" | "scale" | "rotate";

interface Drag {
  index: number;
  mode: Mode;
  pointerId: number;
  // 화면의 1px이 창 좌표로 몇 px인지.
  perPixel: number;
  origin: { x: number; y: number };
  from: { x: number; y: number };
  center: { x: number; y: number };
  scale: number;
  rotate: number;
}

interface DecorationControlsProps {
  cake: CakeConfig;
  // 고른 장식의, 케이크 장식 목록에서의 차례.
  selected: number | null;
  onSelect: (index: number | null) => void;
  onAdjust: (index: number, change: DecorationChange) => void;
  onRemove: (index: number) => void;
}

// 케이크 창 위에 겹쳐, 직접 놓은 장식을 고르고 옮기고 크기와 기울기를 고치게 한다.
// 좌표는 케이크 창의 왼쪽 위가 기준이다. 예시에 처음부터 있던 장식은 다루지 않는다.
export const DecorationControls = ({
  cake,
  selected,
  onSelect,
  onAdjust,
  onRemove,
}: DecorationControlsProps) => {
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const ratio = WINDOW_CAKE.scale * cakeScale(cake.size);
  const bottom = WINDOW_CAKE.bottom - windowCakeLift(cakeScale(cake.size));
  const boardBottom = { x: CAKE_BOARD.width / 2, y: CAKE_BOARD.height };

  const items = cakeLayers(cake).flatMap((layer) => {
    if (layer.index === undefined) return [];
    const item = cake.decorations[layer.index];
    return [
      {
        index: layer.index,
        center: {
          x:
            WINDOW_CAKE.centerX +
            (layer.left + layer.width / 2 - boardBottom.x) * ratio,
          y: bottom + (layer.top + layer.height / 2 - boardBottom.y) * ratio,
        },
        width: layer.width * ratio,
        height: layer.height * ratio,
        scale: item.scale ?? 1,
        rotate: item.rotate ?? 0,
      },
    ];
  });

  const begin = (
    event: PointerEvent<HTMLButtonElement>,
    item: (typeof items)[number],
    mode: Mode,
  ) => {
    const box = root.current?.getBoundingClientRect();
    const width = root.current?.offsetWidth;
    const perPixel = box && width && box.width > 0 ? width / box.width : 1;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = {
      index: item.index,
      mode,
      pointerId: event.pointerId,
      perPixel,
      origin: { x: box?.left ?? 0, y: box?.top ?? 0 },
      from: { x: event.clientX, y: event.clientY },
      center: item.center,
      scale: item.scale,
      rotate: item.rotate,
    };
    onSelect(item.index);
  };

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const now = drag.current;
    if (!now || now.pointerId !== event.pointerId) return;
    if (now.mode === "move") {
      const clamp = (value: number, low: number, high: number) =>
        Math.min(high, Math.max(low, value));
      const x = clamp(
        now.center.x + (event.clientX - now.from.x) * now.perPixel,
        WINDOW_GRID.left,
        WINDOW_GRID.left + WINDOW_GRID.width,
      );
      const y = clamp(
        now.center.y + (event.clientY - now.from.y) * now.perPixel,
        WINDOW_GRID.top,
        WINDOW_GRID.top + WINDOW_GRID.height,
      );
      onAdjust(now.index, {
        x: boardBottom.x + (x - WINDOW_CAKE.centerX) / ratio,
        y: boardBottom.y + (y - bottom) / ratio,
      });
      return;
    }
    // 크기와 기울기는 장식의 가운데에서 손가락까지의 거리와 방향이 얼마나 달라졌는지로 정한다.
    const arm = (clientX: number, clientY: number) => ({
      x: (clientX - now.origin.x) * now.perPixel - now.center.x,
      y: (clientY - now.origin.y) * now.perPixel - now.center.y,
    });
    const before = arm(now.from.x, now.from.y);
    const after = arm(event.clientX, event.clientY);
    if (now.mode === "scale") {
      const grown =
        Math.hypot(after.x, after.y) /
        Math.max(1, Math.hypot(before.x, before.y));
      onAdjust(now.index, {
        scale: Math.min(
          DECORATION_SCALE.max,
          Math.max(DECORATION_SCALE.min, now.scale * grown),
        ),
      });
      return;
    }
    const turned =
      Math.atan2(after.y, after.x) - Math.atan2(before.y, before.x);
    onAdjust(now.index, { rotate: now.rotate + (turned * 180) / Math.PI });
  };

  const end = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  };

  const dragging = (item: (typeof items)[number], mode: Mode) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) =>
      begin(event, item, mode),
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: end,
  });

  return (
    <div ref={root} className="absolute inset-0">
      {selected !== null && (
        <button
          type="button"
          aria-label={CONTROL_LABELS.release}
          className="absolute inset-0 cursor-default"
          onClick={() => onSelect(null)}
        />
      )}
      {items.map((item) => {
        const chosen = item.index === selected;
        const width = item.width + CONTROL_BOX.gapX * 2;
        const height = item.height + CONTROL_BOX.gapY * 2;
        return (
          <div
            key={item.index}
            className="absolute left-0 top-0"
            style={{
              width,
              height,
              transform: `translate(${item.center.x - width / 2}px, ${item.center.y - height / 2}px) rotate(${item.rotate}deg)`,
            }}
          >
            <button
              type="button"
              aria-label={CONTROL_LABELS.move}
              aria-pressed={chosen}
              className={`absolute inset-0 touch-none [-webkit-tap-highlight-color:transparent] ${chosen ? "border-2 border-[#ff8cc7]" : ""}`}
              {...dragging(item, "move")}
            />
            {chosen && (
              <>
                <button
                  type="button"
                  aria-label={CONTROL_LABELS.remove}
                  className={HANDLE}
                  style={{
                    width: HANDLE_TOUCH,
                    height: HANDLE_TOUCH,
                    left: HANDLE_INSIDE - HANDLE_TOUCH,
                    top: HANDLE_INSIDE - HANDLE_TOUCH,
                    padding: `${HANDLE_TOUCH - HANDLE_INSIDE - 9}px ${HANDLE_INSIDE - 9}px ${HANDLE_INSIDE - 9}px ${HANDLE_TOUCH - HANDLE_INSIDE - 9}px`,
                  }}
                  onClick={() => {
                    playEffect("choice");
                    onRemove(item.index);
                    onSelect(null);
                  }}
                >
                  <img
                    alt=""
                    draggable={false}
                    className="block size-[18px] max-w-none"
                    src={CONTROL_IMAGES.remove}
                  />
                </button>
                <button
                  type="button"
                  aria-label={CONTROL_LABELS.scale}
                  className={HANDLE}
                  style={{
                    width: HANDLE_TOUCH,
                    height: HANDLE_TOUCH,
                    right: HANDLE_INSIDE - HANDLE_TOUCH,
                    top: HANDLE_INSIDE - HANDLE_TOUCH,
                    padding: `${HANDLE_TOUCH - HANDLE_INSIDE - 9}px ${HANDLE_TOUCH - HANDLE_INSIDE - 9}px ${HANDLE_INSIDE - 9}px ${HANDLE_INSIDE - 9}px`,
                  }}
                  {...dragging(item, "scale")}
                >
                  <span className={KNOB}>
                    <img
                      alt=""
                      draggable={false}
                      className="block size-[12px] max-w-none"
                      src={CONTROL_IMAGES.scale}
                    />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={CONTROL_LABELS.rotate}
                  className={HANDLE}
                  style={{
                    width: HANDLE_TOUCH,
                    height: HANDLE_TOUCH,
                    right: HANDLE_INSIDE - HANDLE_TOUCH,
                    bottom: HANDLE_INSIDE - HANDLE_TOUCH,
                    padding: `${HANDLE_INSIDE - 9}px ${HANDLE_TOUCH - HANDLE_INSIDE - 9}px ${HANDLE_TOUCH - HANDLE_INSIDE - 9}px ${HANDLE_INSIDE - 9}px`,
                  }}
                  {...dragging(item, "rotate")}
                >
                  <span className={KNOB}>
                    <img
                      alt=""
                      draggable={false}
                      className="block h-[9.63px] w-[9.62px] max-w-none"
                      src={CONTROL_IMAGES.rotate}
                    />
                  </span>
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
