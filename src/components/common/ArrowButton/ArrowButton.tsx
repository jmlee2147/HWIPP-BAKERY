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
      className={`size-[97.7px] drop-shadow-window transition-transform duration-100 active:scale-95 disabled:opacity-40 ${className}`}
      {...props}
    >
      <span className="relative block size-full">
        <img
          alt=""
          className={`absolute inset-0 block size-full max-w-none ${direction === "next" ? "rotate-180" : ""}`}
          src="/assets/ui/button/arrow.svg"
        />
      </span>
    </button>
  );
};
