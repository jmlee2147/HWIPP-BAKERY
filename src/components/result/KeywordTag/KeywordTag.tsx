import type { ComponentPropsWithRef } from "react";
import type { KeywordTone } from "@/data/result";

const TONES: Record<KeywordTone, string> = {
  mint: "bg-mint text-cocoa",
  lime: "bg-[#f2ffc7] text-cocoa",
  white: "bg-white text-cocoa",
  cocoa: "bg-cocoa text-candy",
};

interface KeywordTagProps extends ComponentPropsWithRef<"p"> {
  tone: KeywordTone;
}

// 답변에서 뽑은 키워드를 적는 이름표. 너비는 글자 길이를 따라간다.
export const KeywordTag = ({
  tone,
  className = "",
  children,
  ...props
}: KeywordTagProps) => {
  return (
    <p
      className={`flex h-[54px] items-center whitespace-nowrap border border-taupe px-[20px] font-stardust text-[25.954px] font-bold leading-[25.408px] tracking-[-0.6488px] ${TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};
