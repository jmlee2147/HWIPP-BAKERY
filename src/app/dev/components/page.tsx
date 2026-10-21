import { notFound } from "next/navigation";
import { ArrowButton } from "@/components/common/ArrowButton/ArrowButton";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { ConfirmButton } from "@/components/common/ConfirmButton/ConfirmButton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import {
  ProgressBar,
  type ProgressStep,
} from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";

const PROGRESS_STEPS: ProgressStep[] = [1, 2, 3, 4, 5, "complete"];

// 공용 컴포넌트를 한눈에 확인하기 위한 개발용 화면. 배포본에서는 404를 돌려준다.
export default function ComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="fixed inset-0 overflow-auto bg-white p-[60px]">
      <div className="flex w-[1000px] flex-col gap-[40px]">
        {PROGRESS_STEPS.map((step) => (
          <ProgressBar key={step} step={step} />
        ))}
        <SpeechBubble>
          {
            "자, 그럼 바로 시작해 볼까요?\n오늘 어떤 분을 위한 케이크를 구워드릴까요?"
          }
        </SpeechBubble>
        <ChoiceButton tone="pink">
          좋아! 내가 선물하고 싶은 상대는 ...
        </ChoiceButton>
        <ChoiceButton tone="mint">내가 바로 직접 디자인 해볼래</ChoiceButton>
        <div className="flex gap-[24px]">
          <ArrowButton direction="prev" />
          <ArrowButton direction="next" />
        </div>
        <div className="relative h-[420px] w-[1000px] border border-dashed border-taupe">
          <ProgressBar step={2} className="absolute left-[20px] top-[20px]" />
          <ChoiceButton
            tone="mint"
            className="absolute bottom-[20px] left-[20px]"
          >
            바깥에서 지정한 위치에 놓인다
          </ChoiceButton>
          <ArrowButton
            direction="next"
            className="absolute right-[20px] top-[160px]"
          />
        </div>
        <div className="flex gap-[24px]">
          <ConfirmButton tone="pink">선택하기</ConfirmButton>
          <ConfirmButton tone="mint" size="half">
            다음
          </ConfirmButton>
        </div>
        <ConfirmDialog message="케이크 제작을 끝내고 처음으로 돌아갈까요?">
          <ConfirmButton tone="gray" size="half">
            처음으로
          </ConfirmButton>
          <ConfirmButton tone="pink" size="half">
            계속하기
          </ConfirmButton>
        </ConfirmDialog>
      </div>
    </main>
  );
}
