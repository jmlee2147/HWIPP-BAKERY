"use client";

import { useEffect, useState } from "react";
import { LoadingCake } from "@/components/analysis/LoadingCake/LoadingCake";
import { Baker } from "@/components/common/Baker/Baker";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import {
  KITCHEN,
  KITCHEN_IMAGE,
  LOADING_BAKER,
  LOADING_TEXT,
} from "@/data/analysis";
import { loadingPercent } from "@/lib/loading";

// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;
const TICK_MS = 100;
// 100%를 보여 준 뒤 넘어가기까지의 뜸.
const DONE_HOLD_MS = 700;

interface LoadingSceneProps {
  // 진행률이 0%에서 100%까지 오르는 데 걸리는 시간.
  durationMs: number;
  onDone: () => void;
}

// 관람객이 아무것도 누르지 않아도 정해 둔 시간이 지나면 반드시 onDone을 부른다.
export const LoadingScene = ({ durationMs, onDone }: LoadingSceneProps) => {
  const [percent, setPercent] = useState(0);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(
      () => setPercent(loadingPercent(Date.now() - startedAt, durationMs)),
      TICK_MS,
    );
    return () => window.clearInterval(timer);
  }, [durationMs]);

  const done = percent >= 100;
  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(onDone, DONE_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [done, onDone]);

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#ffeff3]">
      <img
        alt=""
        className="absolute max-w-none opacity-[0.65]"
        src={KITCHEN_IMAGE}
        style={KITCHEN}
      />
      <SpeechBubble className="absolute left-[51.55px] top-[149px]">
        <span>
          <TypedText
            text={LOADING_TEXT}
            startDelayMs={TYPING_DELAY_MS}
            sound
            onDone={() => setTyped(true)}
          />
          {/* 숫자는 계속 바뀌므로 타이핑에 넣지 않고, 문장이 다 나온 뒤에 보여 준다. */}
          <span className={typed ? "" : "invisible"}>{percent}%</span>
        </span>
      </SpeechBubble>
      <ProgressBar step={4} className="absolute left-[75px] top-[58px]" />
      <LoadingCake className="absolute left-[347px] top-[717px]" />
      <Baker frames={LOADING_BAKER} />
    </section>
  );
};
