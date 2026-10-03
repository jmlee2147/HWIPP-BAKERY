import { notFound } from "next/navigation";
import {
  type OpeningScene,
  OpeningScreen,
} from "@/components/opening/OpeningScreen/OpeningScreen";

const SCENES: OpeningScene[] = [
  "title",
  "store",
  "greeting",
  "intro1",
  "intro2",
  "question",
];

// 오프닝 장면을 한눈에 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
export default function OpeningPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="fixed inset-0 overflow-auto bg-mist p-[24px]">
      <div className="flex flex-wrap gap-[24px]">
        {SCENES.map((scene) => (
          <div key={scene} className="h-[640px] w-[360px] overflow-hidden">
            <div className="relative h-[1920px] w-[1080px] origin-top-left scale-[0.3333] overflow-hidden bg-white">
              <OpeningScreen initialScene={scene} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
