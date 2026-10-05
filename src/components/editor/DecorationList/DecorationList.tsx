"use client";

import type { ComponentPropsWithRef } from "react";
import {
  type DecorationChoice,
  LIST_CLOSE_IMAGE,
  LIST_CLOSE_LABEL,
} from "@/data/editor";
import { playEffect } from "@/lib/sound";

// 장식 그림 사이의 간격. 폭이 좁은 장식(초)은 터치 영역을 88px까지 넓힌다.
const GAP = 50;
const TOUCH_MIN = 88;

interface DecorationListProps extends ComponentPropsWithRef<"div"> {
  choices: DecorationChoice[];
  onPick: (id: string) => void;
  onClose: () => void;
}

// 한 분류의 장식 목록. 칸과 닫기 버튼은 제자리에 있고 안의 장식만 좌우로 밀어 본다.
export const DecorationList = ({
  choices,
  onPick,
  onClose,
  className = "",
  ...props
}: DecorationListProps) => {
  return (
    <div className={`h-[275px] w-[944px] ${className}`} {...props}>
      <div className="relative size-full">
        <ul className="flex size-full items-center overflow-x-auto overflow-y-hidden rounded-[5.75px] border-2 border-[#8b4b5e] bg-[linear-gradient(107.18deg,rgba(255,255,255,0.56)_43.69%,rgba(255,255,255,0.14)_101.04%)] px-[13px] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden">
          {choices.map((choice) => (
            <li key={choice.id} className="h-full shrink-0">
              <button
                type="button"
                aria-label={choice.id}
                className="flex h-full items-center justify-center transition-transform duration-100 active:scale-[0.97]"
                style={{ width: Math.max(TOUCH_MIN, choice.width + GAP) }}
                onClick={() => {
                  playEffect("choice");
                  onPick(choice.id);
                }}
              >
                <img
                  alt=""
                  draggable={false}
                  className="block max-w-none"
                  src={choice.src}
                  style={{ width: choice.width, height: choice.height }}
                />
              </button>
            </li>
          ))}
        </ul>
        {/* 보이는 크기는 47x27이고, 터치 영역만 88px로 넓혔다. */}
        <button
          type="button"
          aria-label={LIST_CLOSE_LABEL}
          className="absolute left-[860.8px] top-[-15.6px] flex size-[88px] items-center justify-center transition-transform duration-100 active:scale-[0.97]"
          onClick={() => {
            playEffect("choice");
            onClose();
          }}
        >
          <span className="flex h-[26.81px] w-[46.91px] items-center justify-center rounded-[3.35px] border-[0.84px] border-[#8a8080] bg-[linear-gradient(to_bottom,#ff9ec2,#ff50aa_60.9%,#ffd8ed)] shadow-[inset_3.35px_1.68px_8.04px_0px_rgba(255,255,255,0.59)]">
            <img
              alt=""
              className="block h-[13.76px] w-[14.53px] max-w-none"
              src={LIST_CLOSE_IMAGE}
            />
          </span>
        </button>
      </div>
    </div>
  );
};
