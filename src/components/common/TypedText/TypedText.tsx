"use client";

import { useEffect, useRef, useState } from "react";

interface TypedTextProps {
  text: string;
  // true면 타이핑을 건너뛰고 전체를 바로 보여 준다.
  instant?: boolean;
  intervalMs?: number;
  onDone?: () => void;
}

// 글자를 한 자씩 끊어서 드러낸다. 아직 안 나온 글자도 자리를 차지해 줄바꿈과 정렬이 흔들리지 않는다.
export const TypedText = ({
  text,
  instant = false,
  intervalMs = 65,
  onDone,
}: TypedTextProps) => {
  const characters = Array.from(text);
  const [count, setCount] = useState(0);
  const onDoneRef = useRef(onDone);
  const shown = instant ? characters.length : count;
  const done = shown >= characters.length;

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (done) {
      onDoneRef.current?.();
      return;
    }
    const timer = window.setInterval(
      () => setCount((current) => current + 1),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [done, intervalMs]);

  // 한 덩어리로 감싸야 바깥의 flex 배치에서 줄이 따로 놀지 않는다.
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{characters.slice(0, shown).join("")}</span>
      <span aria-hidden className="invisible">
        {characters.slice(shown).join("")}
      </span>
    </span>
  );
};
