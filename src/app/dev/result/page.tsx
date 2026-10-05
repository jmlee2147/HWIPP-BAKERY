import { notFound } from "next/navigation";
import { Stage } from "@/components/common/Stage/Stage";
import { ResultPreview } from "./ResultPreview";

// 결과 화면만 바로 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
// ?cake=cake-07 로 완성 케이크 예시를, ?size=mini 로 크기를 골라 볼 수 있다.
export default async function ResultPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ cake?: string; size?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { cake, size } = await searchParams;

  return (
    <Stage>
      <ResultPreview presetId={cake} size={size} />
    </Stage>
  );
}
