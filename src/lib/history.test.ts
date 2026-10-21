import { describe, expect, it } from "vitest";
import { emptyHistory, HISTORY_LIMIT, record, redo, undo } from "./history";

// 1에서 시작해 2, 3으로 바꾼 이력. 지금 값은 3이다.
const edited = () => record(record(emptyHistory<number>(), 1), 2);

describe("history", () => {
  it("처음에는 되돌릴 것도 다시 적용할 것도 없다", () => {
    expect(undo(emptyHistory<number>(), 1)).toBeNull();
    expect(redo(emptyHistory<number>(), 1)).toBeNull();
  });

  it("한 단계씩 되돌리고, 되돌린 순서의 반대로 다시 적용한다", () => {
    const first = undo(edited(), 3);
    expect(first?.value).toBe(2);
    const second = first && undo(first.history, first.value);
    expect(second?.value).toBe(1);
    if (!second) throw new Error("되돌리지 못했다");
    expect(undo(second.history, second.value)).toBeNull();

    const again = redo(second.history, second.value);
    expect(again?.value).toBe(2);
    const last = again && redo(again.history, again.value);
    expect(last?.value).toBe(3);
    if (!last) throw new Error("다시 적용하지 못했다");
    expect(redo(last.history, last.value)).toBeNull();
  });

  it("되돌린 뒤 새로 바꾸면 다시 적용할 이력이 사라진다", () => {
    const back = undo(edited(), 3);
    if (!back) throw new Error("되돌리지 못했다");

    const changed = record(back.history, back.value);

    expect(redo(changed, 4)).toBeNull();
    expect(undo(changed, 4)?.value).toBe(2);
  });

  it("정해 둔 단계 수보다 오래된 이력은 버린다", () => {
    let history = emptyHistory<number>();
    for (let value = 0; value < HISTORY_LIMIT + 5; value += 1) {
      history = record(history, value);
    }

    expect(history.past).toHaveLength(HISTORY_LIMIT);
    expect(history.past[0]).toBe(5);
  });
});
