// 실행 취소와 다시 실행을 위한 이력. past는 오래된 것부터, future는 바로 다음에 다시 적용할 것이 끝에 온다.
export interface History<T> {
  past: T[];
  future: T[];
}

// 키오스크 메모리를 생각해 되돌릴 수 있는 단계 수를 묶어 둔다.
export const HISTORY_LIMIT = 50;

export const emptyHistory = <T>(): History<T> => ({ past: [], future: [] });

// 바뀌기 전의 값을 쌓는다. 새로 바꾸면 다시 실행할 이력은 사라진다.
export function record<T>(history: History<T>, before: T): History<T> {
  return {
    past: [...history.past, before].slice(-HISTORY_LIMIT),
    future: [],
  };
}

// 한 단계 되돌린다. 되돌릴 것이 없으면 null이다.
export function undo<T>(
  history: History<T>,
  current: T,
): { history: History<T>; value: T } | null {
  const value = history.past.at(-1);
  if (value === undefined) return null;
  return {
    history: {
      past: history.past.slice(0, -1),
      future: [...history.future, current],
    },
    value,
  };
}

// 되돌린 것을 한 단계 다시 적용한다. 다시 적용할 것이 없으면 null이다.
export function redo<T>(
  history: History<T>,
  current: T,
): { history: History<T>; value: T } | null {
  const value = history.future.at(-1);
  if (value === undefined) return null;
  return {
    history: {
      past: [...history.past, current],
      future: history.future.slice(0, -1),
    },
    value,
  };
}
