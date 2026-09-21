import type { ReactNode } from 'react'
import { FixedCanvas } from '@/components/canvas/FixedCanvas'

/** 키오스크 공통 셸. 유휴 타임아웃·전체화면 진입·에러 바운더리가 여기 붙는다. */
export default function KioskLayout({ children }: { children: ReactNode }) {
  return <FixedCanvas>{children}</FixedCanvas>
}
