import { notFound } from "next/navigation";
import { Stage } from "@/components/common/Stage/Stage";
import { SharePreview } from "./SharePreview";

// 소장 및 공유 화면만 바로 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
// ?cake=cake-07 로 완성 케이크 예시를, ?scene=qr 로 QR 화면을 골라 볼 수 있다.
export default async function SharePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ cake?: string; scene?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { cake, scene } = await searchParams;

  return (
    <Stage>
      <SharePreview presetId={cake} scene={scene === "qr" ? "qr" : "final"} />
    </Stage>
  );
}
