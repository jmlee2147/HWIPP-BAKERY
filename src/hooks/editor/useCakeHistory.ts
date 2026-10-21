"use client";

import { useRef, useState } from "react";
import { type CakeConfig, DEFAULT_CAKE } from "@/data/cake";
import { emptyHistory, type History, record, redo, undo } from "@/lib/history";
import { useExperienceStore } from "@/stores/useExperienceStore";

const currentCake = () => useExperienceStore.getState().cake ?? DEFAULT_CAKE;

// 장식 자리의 기준 모양은 처음 고칠 때 적히기만 하고 보이는 케이크는 그대로라, 비교할 때는 채워 넣고 본다.
const sameCake = (a: CakeConfig, b: CakeConfig) => {
  const seen = (cake: CakeConfig) =>
    JSON.stringify({ ...cake, layoutShape: cake.layoutShape ?? cake.shape });
  return seen(a) === seen(b);
};

// 수정 화면에서 케이크를 바꾼 이력. 화면을 떠나면 사라진다.
// 실제로 바뀐 것만 쌓고, 장식을 끌어 옮기거나 돌리는 것은 손을 뗄 때 한 단계로 쌓는다.
export function useCakeHistory() {
  const setCake = useExperienceStore((state) => state.setCake);
  const [history, setHistory] = useState<History<CakeConfig>>(emptyHistory);
  // 끌기 시작할 때의 케이크.
  const dragFrom = useRef<CakeConfig | null>(null);

  const keep = (before: CakeConfig) => {
    if (sameCake(before, currentCake())) return;
    setHistory((now) => record(now, before));
  };

  // 케이크를 바꾸는 일을 실행하고, 바뀌었으면 바뀌기 전을 이력에 쌓는다.
  const track = (change: () => void) => {
    const before = currentCake();
    change();
    keep(before);
  };

  const startDrag = () => {
    dragFrom.current = currentCake();
  };

  const endDrag = () => {
    if (dragFrom.current) keep(dragFrom.current);
    dragFrom.current = null;
  };

  const step = (move: typeof undo) => {
    const moved = move(history, currentCake());
    if (!moved) return;
    setHistory(moved.history);
    setCake(moved.value);
  };

  return {
    track,
    startDrag,
    endDrag,
    undo: () => step(undo),
    redo: () => step(redo),
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
