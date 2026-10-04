import { notFound } from "next/navigation";
import {
  type AnalysisScene,
  AnalysisScreen,
} from "@/components/analysis/AnalysisScreen/AnalysisScreen";
import { Stage } from "@/components/common/Stage/Stage";

const SCENES: AnalysisScene[] = ["confirm", "loading"];

// 분석 및 로딩 화면만 바로 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
// ?scene=loading 으로 로딩 장면부터 볼 수 있다.
export default async function AnalysisPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { scene } = await searchParams;
  const initialScene = SCENES.find((item) => item === scene) ?? "confirm";

  return (
    <Stage>
      <AnalysisScreen initialScene={initialScene} />
    </Stage>
  );
}
