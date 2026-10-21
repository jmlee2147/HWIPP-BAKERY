import type { ComponentPropsWithRef } from "react";

const WINDOW_DOT = "absolute top-[23.46px] size-[21.09px] rounded-full";

interface ConfirmDialogProps extends ComponentPropsWithRef<"div"> {
  message: string;
}

// 창 모양의 확인 팝업. 선택지 버튼은 children으로 받아 아래에 나란히 놓는다.
// 안쪽 요소의 위치는 2px 테두리 안쪽 기준이다.
export const ConfirmDialog = ({
  message,
  children,
  className = "",
  ...props
}: ConfirmDialogProps) => {
  return (
    <div
      role="alertdialog"
      aria-label={message}
      className={`h-[365px] w-[822px] ${className}`}
      {...props}
    >
      <div className="relative size-full border-2 border-taupe bg-white shadow-[3px_9px_30.9px_0px_rgba(0,0,0,0.43)]">
        <span className={`${WINDOW_DOT} left-[23.46px] bg-candy`} />
        <span className={`${WINDOW_DOT} left-[55.16px] bg-[#ffe6a7]`} />
        <span className={`${WINDOW_DOT} left-[86.86px] bg-[#e6f4a4]`} />
        {[25, 33.48, 41.97].map((top) => (
          <span
            key={top}
            className="absolute left-[769px] h-[2.12px] w-[25.46px] rounded-full bg-black"
            style={{ top }}
          />
        ))}
        <span className="absolute left-[22px] top-[71.2px] h-[1.59px] w-[772px] bg-[#e4e4e4]" />
        {/* 문구는 위쪽 띠와 선택지 사이의 가운데에 놓는다. 줄바꿈은 그대로 살린다. */}
        <p className="absolute inset-x-0 top-[74px] flex h-[163px] items-center justify-center whitespace-pre-line text-center font-stardust text-body font-bold leading-[49.2px] text-cocoa">
          {message}
        </p>
        <div className="absolute left-[55px] top-[237px] flex gap-[30px]">
          {children}
        </div>
      </div>
    </div>
  );
};
