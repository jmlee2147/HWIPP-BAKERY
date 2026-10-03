import type { ComponentPropsWithRef } from "react";

interface ArrowButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "children"> {
  direction: "prev" | "next";
}

export const ArrowButton = ({
  direction,
  type = "button",
  className = "",
  ...props
}: ArrowButtonProps) => {
  return (
    <button
      type={type}
      aria-label={direction === "prev" ? "이전" : "다음"}
      className={`relative size-[97.7px] drop-shadow-[3px_9px_15px_rgba(0,0,0,0.15)] disabled:opacity-40 ${className}`}
      {...props}
    >
      <img
        alt=""
        className={`absolute inset-0 block size-full max-w-none ${direction === "next" ? "rotate-180" : ""}`}
        src="/assets/ui/button/arrow.svg"
      />
    </button>
  );
};
