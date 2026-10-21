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
import {
  cakeScale,
  type DecorationChange,
  type DecorationHandle,
  decorationHandles,
} from "@/lib/cake";
import { playEffect } from "@/lib/sound";

// 손잡이는 지름 40px의 원이고, 터치 영역만 88px로 넓힌다.
// 좁은 상자에서 손잡이끼리 겹치지 않도록 터치 영역은 상자 바깥쪽으로 치우쳐 있다.
const HANDLE_TOUCH = 88;
const HANDLE_INSIDE = 26;
// 손잡이 원의 반지름. 원의 가운데가 상자의 모서리에 놓인다.
const KNOB_RADIUS = 20;
const HANDLE =
  "absolute flex touch-none items-center justify-center [-webkit-tap-highlight-color:transparent]";

type Mode = "move" | "scale" | "rotate";

interface Drag {
  handle: Item;
  mode: Mode;
  pointerId: number;
  // 화면의 1px이 창 좌표로 몇 px인지.
  perPixel: number;
  origin: { x: number; y: number };
  from: { x: number; y: number };
}

// 창 좌표로 옮긴 고르기 상자.
interface Item extends DecorationHandle {
  center: { x: number; y: number };
  width: number;
  height: number;
}

interface DecorationControlsProps {
  cake: CakeConfig;
  // 고른 상자의 열쇠.
  selected: string | null;
  onSelect: (key: string | null) => void;
  onAdjust: (index: number, change: DecorationChange) => void;
  onMove: (moves: { index: number; x: number; y: number }[]) => void;
  // 장식을 끌기 시작할 때와 손을 뗄 때.
  onAdjustStart: () => void;
  onAdjustEnd: () => void;
  onRemove: (indices: number[]) => void;
}

// 케이크 창 위에 겹쳐, 장식을 고르고 고치게 한다. 좌표는 케이크 창의 왼쪽 위가 기준이다.
// 낱개 장식은 옮기고 크기와 기울기를 고치고, 물방울 묶음은 함께 옮기고, 케이크 모양을 따라 그린 장식은 지우기만 한다.
export const DecorationControls = ({
  cake,
  selected,
  onSelect,
  onAdjust,
  onMove,
  onAdjustStart,
  onAdjustEnd,
  onRemove,
}: DecorationControlsProps) => {
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const ratio = WINDOW_CAKE.scale * cakeScale(cake.size);
  const bottom = WINDOW_CAKE.bottom - windowCakeLift(cakeScale(cake.size));
  const boardBottom = { x: CAKE_BOARD.width / 2, y: CAKE_BOARD.height };

  const items: Item[] = decorationHandles(cake).map((handle) => ({
    ...handle,
    center: {
      x:
        WINDOW_CAKE.centerX +
        (handle.box.left + handle.box.width / 2 - boardBottom.x) * ratio,
      y:
        bottom +
        (handle.box.top + handle.box.height / 2 - boardBottom.y) * ratio,
    },
    width: handle.box.width * ratio,
    height: handle.box.height * ratio,
  }));

  const begin = (
    event: PointerEvent<HTMLButtonElement>,
    item: Item,
    mode: Mode,
  ) => {
    onSelect(item.key);
    // 케이크 모양을 따라 그린 장식은 고르기만 한다.
    if (item.mode === "fixed") return;
    const box = root.current?.getBoundingClientRect();
    const width = root.current?.offsetWidth;
    const perPixel = box && width && box.width > 0 ? width / box.width : 1;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = {
      handle: item,
      mode,
      pointerId: event.pointerId,
      perPixel,
      origin: { x: box?.left ?? 0, y: box?.top ?? 0 },
      from: { x: event.clientX, y: event.clientY },
    };
    onAdjustStart();
  };

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const now = drag.current;
    if (!now || now.pointerId !== event.pointerId) return;
    // 손가락이 움직이지 않았으면 고칠 것이 없다. 다시 계산하며 생기는 작은 오차가 이력에 남지 않게 한다.
    if (event.clientX === now.from.x && event.clientY === now.from.y) return;
    if (now.mode === "move") {
      const clamp = (value: number, low: number, high: number) =>
        Math.min(high, Math.max(low, value));
      const x = clamp(
        now.handle.center.x + (event.clientX - now.from.x) * now.perPixel,
        WINDOW_GRID.left,
        WINDOW_GRID.left + WINDOW_GRID.width,
      );
      const y = clamp(
        now.handle.center.y + (event.clientY - now.from.y) * now.perPixel,
        WINDOW_GRID.top,
        WINDOW_GRID.top + WINDOW_GRID.height,
      );
      // 묶음은 그림들이 같은 거리만큼 함께 옮겨진다.
      const shift = {
        x: (x - now.handle.center.x) / ratio,
        y: (y - now.handle.center.y) / ratio,
      };
      onMove(
        now.handle.members.map((member) => ({
          index: member.index,
          x: member.x + shift.x,
          y: member.y + shift.y,
        })),
      );
      return;
    }
    const [{ index }] = now.handle.members;
    // 크기와 기울기는 장식의 가운데에서 손가락까지의 거리와 방향이 얼마나 달라졌는지로 정한다.
    const arm = (clientX: number, clientY: number) => ({
      x: (clientX - now.origin.x) * now.perPixel - now.handle.center.x,
      y: (clientY - now.origin.y) * now.perPixel - now.handle.center.y,
    });
    const before = arm(now.from.x, now.from.y);
    const after = arm(event.clientX, event.clientY);
    if (now.mode === "scale") {
      const grown =
        Math.hypot(after.x, after.y) /
        Math.max(1, Math.hypot(before.x, before.y));
      onAdjust(index, {
        scale: Math.min(
          DECORATION_SCALE.max,
          Math.max(DECORATION_SCALE.min, now.handle.scale * grown),
        ),
      });
      return;
    }
    const turned =
      Math.atan2(after.y, after.x) - Math.atan2(before.y, before.x);
    onAdjust(index, {
      rotate: now.handle.rotate + (turned * 180) / Math.PI,
    });
  };

  const end = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    onAdjustEnd();
  };

  const dragging = (item: Item, mode: Mode) => ({
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
        const chosen = item.key === selected;
        const width = item.width + CONTROL_BOX.gapX * 2;
        const height = item.height + CONTROL_BOX.gapY * 2;
        return (
          <div
            key={item.key}
            className="absolute left-0 top-0"
            style={{
              width,
              height,
              transform: `translate(${item.center.x - width / 2}px, ${item.center.y - height / 2}px) rotate(${item.rotate}deg)`,
            }}
          >
            {item.mode === "group" ? (
              <>
                {/* 묶음은 그림 하나하나를 눌러 고르고, 고르면 묶음 전체에 상자를 두른다. */}
                {chosen && (
                  <div className="pointer-events-none absolute inset-0 border-2 border-[#ff8cc7]" />
                )}
                {item.members.map((member) => (
                  <button
                    key={member.index}
                    type="button"
                    aria-label={CONTROL_LABELS.move}
                    aria-pressed={chosen}
                    className="absolute touch-none [-webkit-tap-highlight-color:transparent]"
                    style={{
                      left:
                        (member.x - member.width / 2 - item.box.left) * ratio +
                        CONTROL_BOX.gapX,
                      top:
                        (member.y - member.height / 2 - item.box.top) * ratio +
                        CONTROL_BOX.gapY,
                      width: member.width * ratio,
                      height: member.height * ratio,
                    }}
                    {...dragging(item, "move")}
                  />
                ))}
              </>
            ) : (
              <button
                type="button"
                aria-label={CONTROL_LABELS.move}
                aria-pressed={chosen}
                className={`absolute inset-0 touch-none [-webkit-tap-highlight-color:transparent] ${chosen ? "border-2 border-[#ff8cc7]" : ""}`}
                {...dragging(item, "move")}
              />
            )}
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
                    padding: `${HANDLE_TOUCH - HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_TOUCH - HANDLE_INSIDE - KNOB_RADIUS}px`,
                  }}
                  onClick={() => {
                    playEffect("choice");
                    onRemove(item.members.map((member) => member.index));
                    onSelect(null);
                  }}
                >
                  <img
                    alt=""
                    draggable={false}
                    className="block size-[40px] max-w-none"
                    src={CONTROL_IMAGES.remove}
                  />
                </button>
                {item.mode === "free" && (
                  <>
                    <button
                      type="button"
                      aria-label={CONTROL_LABELS.scale}
                      className={HANDLE}
                      style={{
                        width: HANDLE_TOUCH,
                        height: HANDLE_TOUCH,
                        right: HANDLE_INSIDE - HANDLE_TOUCH,
                        top: HANDLE_INSIDE - HANDLE_TOUCH,
                        padding: `${HANDLE_TOUCH - HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_TOUCH - HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_INSIDE - KNOB_RADIUS}px`,
                      }}
                      {...dragging(item, "scale")}
                    >
                      <img
                        alt=""
                        draggable={false}
                        className="block size-[40px] max-w-none"
                        src={CONTROL_IMAGES.scale}
                      />
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
                        padding: `${HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_TOUCH - HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_TOUCH - HANDLE_INSIDE - KNOB_RADIUS}px ${HANDLE_INSIDE - KNOB_RADIUS}px`,
                      }}
                      {...dragging(item, "rotate")}
                    >
                      <img
                        alt=""
                        draggable={false}
                        className="block size-[40px] max-w-none"
                        src={CONTROL_IMAGES.rotate}
                      />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
