"use client";

import { type ComponentPropsWithRef, useState } from "react";
import { ConfirmButton } from "@/components/common/ConfirmButton/ConfirmButton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import { playEffect } from "@/lib/sound";

const MESSAGE = "케이크 제작을 끝내고 처음으로 돌아갈까요?";

interface HomeButtonProps extends ComponentPropsWithRef<"button"> {
  onHome: () => void;
}

// 처음으로 돌아가는 버튼. 누르면 확인 팝업을 띄우고, 처음으로를 골라야 돌아간다.
export const HomeButton = ({
  onHome,
  className = "",
  ...props
}: HomeButtonProps) => {
  const [asking, setAsking] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="처음으로 돌아가기"
        className={`size-[91.47px] rounded-full border-[1.97px] border-[#867b76] bg-mint/80 transition-transform duration-100 active:scale-95 ${className}`}
        onClick={() => {
          playEffect("popUp");
          setAsking(true);
        }}
        {...props}
      >
        <img
          alt=""
          className="absolute left-[21.35px] top-[18.9px] block size-[44.19px] max-w-none"
          src="/assets/ui/button/home.svg"
        />
      </button>
      {asking && (
        // 팝업이 떠 있는 동안에는 뒤 화면을 누를 수 없다.
        <div className="absolute inset-0 z-20">
          <ConfirmDialog
            message={MESSAGE}
            className="absolute left-[129px] top-[777px] origin-[-18px_1041px] animate-window-pop motion-reduce:animate-none"
          >
            <ConfirmButton tone="gray" size="half" onClick={onHome}>
              처음으로
            </ConfirmButton>
            <ConfirmButton
              tone="pink"
              size="half"
              onClick={() => setAsking(false)}
            >
              계속하기
            </ConfirmButton>
          </ConfirmDialog>
        </div>
      )}
    </>
  );
};
