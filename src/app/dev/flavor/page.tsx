import { notFound } from "next/navigation";
import { Stage } from "@/components/common/Stage/Stage";
import { FlavorScreen } from "@/components/questions/FlavorScreen/FlavorScreen";

// 맛 선택 화면만 바로 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
export default function FlavorPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Stage>
      <FlavorScreen />
    </Stage>
  );
}
