"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef } from "react";
import {
  BOARD_TILT_DEG,
  CELL_HEIGHT,
  CELL_WIDTH,
  focusView,
  OVERVIEW_SCALE,
  PARTIES,
  type Party,
} from "@/data/parties";

// 축소했을 때 화면을 다 덮을 만큼의 줄 범위.
const COLUMN_LINES = [-2, -1, 0, 1, 2, 3, 4, 5];
const ROW_LINES = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
const LINE_WIDTH = 1.8;
const BOARD_LEFT = COLUMN_LINES[0] * CELL_WIDTH;
const BOARD_TOP = ROW_LINES[0] * CELL_HEIGHT;
const BOARD_WIDTH = (COLUMN_LINES.length - 1) * CELL_WIDTH;
const BOARD_HEIGHT = (ROW_LINES.length - 1) * CELL_HEIGHT;

// 보고 있던 카드를 가운데에 둔 채 축소되어 그리드가 보이고, 다음 카드 쪽으로 옮겨 간 뒤 확대된다.
const MOVE_SECONDS = 1.4;
const MOVE_TIMES = [0, 0.36, 0.64, 1];

interface PartyBoardProps {
  active: Party;
}

// 캘린더 그리드 판. 칸마다 카드가 놓여 있고, 판 전체를 옮기고 키워서 한 장씩 보여 준다.
export const PartyBoard = ({ active }: PartyBoardProps) => {
  const reduceMotion = useReducedMotion();
  const start = focusView(active.col, active.row);
  const x = useMotionValue(start.x);
  const y = useMotionValue(start.y);
  const scale = useMotionValue(start.scale);
  // 직전에 보던 카드. 축소할 때 이 카드를 가운데에 둔다.
  const previous = useRef(active);

  useEffect(() => {
    const from = previous.current;
    previous.current = active;
    if (from.id === active.id) return;

    const view = focusView(active.col, active.row);
    if (reduceMotion) {
      x.set(view.x);
      y.set(view.y);
      scale.set(view.scale);
      return;
    }

    const farFrom = focusView(from.col, from.row, OVERVIEW_SCALE);
    const farTo = focusView(active.col, active.row, OVERVIEW_SCALE);
    const options = {
      duration: MOVE_SECONDS,
      times: MOVE_TIMES,
      ease: "easeInOut",
    } as const;
    // 지금 값에서 출발하므로, 움직이는 중에 다시 넘겨도 끊기지 않고 이어진다.
    const controls = [
      animate(x, [x.get(), farFrom.x, farTo.x, view.x], options),
      animate(y, [y.get(), farFrom.y, farTo.y, view.y], options),
      animate(
        scale,
        [scale.get(), OVERVIEW_SCALE, OVERVIEW_SCALE, view.scale],
        options,
      ),
    ];
    return () => {
      for (const control of controls) control.stop();
    };
  }, [active, reduceMotion, x, y, scale]);

  return (
    <motion.div
      aria-hidden
      className="absolute left-0 top-0 will-change-transform"
      style={{ x, y, scale, rotate: BOARD_TILT_DEG, originX: 0, originY: 0 }}
    >
      {COLUMN_LINES.map((column) => (
        <div
          key={column}
          className="absolute bg-cocoa"
          style={{
            left: column * CELL_WIDTH - LINE_WIDTH / 2,
            top: BOARD_TOP,
            width: LINE_WIDTH,
            height: BOARD_HEIGHT,
          }}
        />
      ))}
      {ROW_LINES.map((row) => (
        <div
          key={row}
          className="absolute bg-cocoa"
          style={{
            left: BOARD_LEFT,
            top: row * CELL_HEIGHT - LINE_WIDTH / 2,
            width: BOARD_WIDTH,
            height: LINE_WIDTH,
          }}
        />
      ))}
      {PARTIES.map((item) => (
        <img
          key={item.id}
          alt=""
          className="absolute block max-w-none"
          src={item.image}
          style={{
            left: item.col * CELL_WIDTH,
            top: item.row * CELL_HEIGHT,
            width: CELL_WIDTH,
            height: CELL_HEIGHT,
          }}
        />
      ))}
    </motion.div>
  );
};
