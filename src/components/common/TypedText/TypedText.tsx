"use client";

import { useEffect, useRef, useState } from "react";
import { playTalk } from "@/lib/sound";

interface TypedTextProps {
  text: string;
  // true면 타이핑을 건너뛰고 전체를 바로 보여 준다.
  instant?: boolean;
  intervalMs?: number;
  // 첫 글자가 나오기 전에 기다리는 시간.
  startDelayMs?: number;
  // true면 글자가 나올 때 말소리를 낸다.
  sound?: boolean;
  onDone?: () => void;
}

// 글자를 한 자씩 끊어서 드러낸다. 아직 안 나온 글자도 자리를 차지해 줄바꿈과 정렬이 흔들리지 않는다.
export const TypedText = ({
  text,
  instant = false,
  intervalMs = 50,
  startDelayMs = 0,
  sound = false,
  onDone,
}: TypedTextProps) => {
  const characters = Array.from(text);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(startDelayMs === 0);
  const onDoneRef = useRef(onDone);
  const shown = instant ? characters.length : count;
  const done = shown >= characters.length;

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (started) return;
    const timer = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(timer);
  }, [started, startDelayMs]);

  useEffect(() => {
    if (done) {
      onDoneRef.current?.();
      return;
    }
    if (!started) return;
    const timer = window.setInterval(
      () => setCount((current) => current + 1),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [done, started, intervalMs]);

  // 두 글자에 한 번, 공백이 아닌 글자에서만 소리를 낸다. 한 번에 다 보여 줄 때는 내지 않는다.
  const typedCharacter = count > 0 ? characters[count - 1] : undefined;
  useEffect(() => {
    if (!sound || instant || typedCharacter === undefined) return;
    if (count % 2 === 1 && typedCharacter.trim() !== "") playTalk();
  }, [sound, instant, count, typedCharacter]);

  // 한 덩어리로 감싸야 바깥의 flex 배치에서 줄이 따로 놀지 않는다.
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden data-testid="typed-text">
        {characters.slice(0, shown).join("")}
      </span>
      <span aria-hidden className="invisible">
        {characters.slice(shown).join("")}
      </span>
    </span>
  );
};
