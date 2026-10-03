"use client";

import { type ReactNode, useState } from "react";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { Sticker } from "@/components/common/Sticker/Sticker";
import { TypedText } from "@/components/common/TypedText/TypedText";
import type { DialogSceneData } from "@/data/opening";

const FRAME_ANIMATION = ["animate-frame-first", "animate-frame-second"];

interface DialogSceneProps {
  scene: DialogSceneData;
  // 선택지가 없는 장면은 화면 어디를 눌러도 다음으로 넘어간다. 글자가 다 나오기 전에 누르면 글자부터 마저 보여 준다.
  onAdvance?: () => void;
  children?: ReactNode;
}

// 장면마다 key를 달아 써야 한다. 타이핑 상태가 다음 장면으로 넘어가지 않게 하기 위해서다.
export const DialogScene = ({
  scene,
  onAdvance,
  children,
}: DialogSceneProps) => {
  const [typed, setTyped] = useState(false);
  const [skipTyping, setSkipTyping] = useState(false);

  const handleTap = () => {
    if (typed) onAdvance?.();
    else setSkipTyping(true);
  };

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#ffeff3]">
      <img
        alt=""
        className="absolute max-w-none opacity-70"
        src="/assets/backgrounds/shop.jpg"
        style={scene.background}
      />
      <SpeechBubble className="absolute left-[59px] top-[62px]">
        <TypedText
          text={scene.text}
          instant={skipTyping}
          onDone={() => setTyped(true)}
        />
      </SpeechBubble>
      {scene.stickers.map((sticker) => (
        <Sticker
          key={`${sticker.centerX}-${sticker.centerY}`}
          sticker={sticker}
        />
      ))}
      {scene.baker.map((frame, index) => (
        <img
          key={frame.src}
          alt=""
          className={`absolute max-w-none ${scene.baker.length > 1 ? FRAME_ANIMATION[index] : ""}`}
          src={frame.src}
          style={{
            left: frame.left,
            top: frame.top,
            width: frame.width,
            height: frame.height,
          }}
        />
      ))}
      {onAdvance && (
        <button
          type="button"
          aria-label="다음"
          className="absolute inset-0"
          onClick={handleTap}
        />
      )}
      {children}
    </section>
  );
};
