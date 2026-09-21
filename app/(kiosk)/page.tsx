/** idle — 시작 화면. 캔버스 확인용 플레이스홀더다. `.claude/rules/state-machine.md` */
export default function IdlePage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-12">
      <h1 className="text-[96px] font-bold tracking-tight">HWIPP BAKERY</h1>
      <p className="text-[36px] text-dough">골격 확인용 화면입니다</p>

      {/* 캔버스 경계 임시 표시. 디자인 적용 시 제거. */}
      <div className="absolute inset-0 border-[4px] border-dashed border-primary/30" />
    </main>
  )
}
