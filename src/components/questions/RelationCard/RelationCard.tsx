import type { ComponentPropsWithRef } from "react";
import type { Relation } from "@/data/relations";

const FACE =
  "absolute inset-0 block size-full max-w-none rounded-[9.64px] shadow-[11.57px_11.57px_19.29px_0px_rgba(0,0,0,0.15)] [backface-visibility:hidden]";

interface RelationCardProps
  extends Omit<ComponentPropsWithRef<"button">, "children"> {
  relation: Relation;
  face: "front" | "back";
  // 뒤집을 수 있는 카드만 뒷면을 그린다. 뒷면 그림이 커서, 옆에 쌓인 카드까지 그리면
  // 휴대폰 브라우저가 이 화면에서 페이지를 닫는다.
  withBack?: boolean;
}

export const RelationCard = ({
  relation,
  face,
  withBack = false,
  type = "button",
  className = "",
  ...props
}: RelationCardProps) => {
  return (
    <button
      type={type}
      aria-label={`${relation.label} 카드`}
      className={`h-[956px] w-[699px] [perspective:2400px] ${className}`}
      {...props}
    >
      <span
        className={`relative block size-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none ${face === "back" ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <img alt="" className={FACE} src={relation.front} />
        {withBack && (
          <img
            alt=""
            className={`${FACE} [transform:rotateY(180deg)]`}
            src={relation.back}
          />
        )}
      </span>
    </button>
  );
};
