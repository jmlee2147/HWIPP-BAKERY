import { notFound } from "next/navigation";
import { Stage } from "@/components/common/Stage/Stage";
import { MenuScreen } from "@/components/result/MenuScreen/MenuScreen";

// 메뉴판만 바로 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
export default function MenuPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Stage>
      <MenuScreen />
    </Stage>
  );
}
