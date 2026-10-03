import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown"] as const;

// 관람객이 체험 도중 자리를 떠나도 다음 관람객이 처음부터 시작할 수 있게 한다.
export function useIdleReset(
  timeoutMs: number,
  onIdle: () => void,
  enabled: boolean,
) {
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  useEffect(() => {
    if (!enabled) return;

    let timer = window.setTimeout(() => onIdleRef.current(), timeoutMs);
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, restart);
    }
    return () => {
      window.clearTimeout(timer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, restart);
      }
    };
  }, [timeoutMs, enabled]);
}
