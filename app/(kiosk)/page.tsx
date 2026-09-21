import { ChoiceButton } from '@/components/ui/ChoiceButton'
import { DialogBox } from '@/components/ui/DialogBox'
import { NavArrow } from '@/components/ui/NavArrow'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StepDots } from '@/components/ui/StepDots'

/** idle — 시작 화면. 공용 컴포넌트 확인용 임시 화면이다. */
export default function IdlePage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-10">
      <ProgressBar step={3} />

      <div className="flex items-center gap-6">
        <StepDots current={1} variant="cream" />
        <StepDots current={3} variant="dough" />
      </div>

      <DialogBox>
        <p>자, 그럼 바로 시작해 볼까요?</p>
        <p>오늘 어떤 분을 위한 케이크를 구워드릴까요?</p>
      </DialogBox>

      <ChoiceButton variant="blush">좋아! 내가 선물하고 싶은 상대는 ...</ChoiceButton>
      <ChoiceButton variant="mint">내가 바로 직접 디자인 해볼래</ChoiceButton>

      <div className="flex items-center gap-6">
        <NavArrow direction="prev" />
        <NavArrow direction="next" />
      </div>
    </main>
  )
}
