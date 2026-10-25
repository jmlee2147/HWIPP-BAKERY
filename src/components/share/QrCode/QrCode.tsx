import qrcode from "qrcode-generator";
import { type ComponentPropsWithRef, useMemo } from "react";

interface QrCodeProps extends ComponentPropsWithRef<"svg"> {
  value: string;
  // 화면을 읽어 주는 도구가 읽을 이름.
  label: string;
}

// 주소를 QR 코드로 그린다. 바깥 여백은 감싸는 흰 틀이 맡는다.
export const QrCode = ({ value, label, ...props }: QrCodeProps) => {
  const { size, path } = useMemo(() => {
    // 주소가 길어 칸이 촘촘하므로, 화면에서 잘 찍히도록 오류 정정은 가장 낮은 단계로 둔다.
    const code = qrcode(0, "L");
    code.addData(value);
    code.make();
    const count = code.getModuleCount();
    let d = "";
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (code.isDark(row, col)) d += `M${col} ${row}h1v1h-1z`;
      }
    }
    return { size: count, path: d };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      {...props}
    >
      <rect width={size} height={size} fill="white" />
      <path d={path} fill="black" />
    </svg>
  );
};
