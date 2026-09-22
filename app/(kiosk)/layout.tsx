import type { ReactNode } from 'react'
import { HotAssetPreload } from '@/components/assets/HotAssetPreload'
import { FixedCanvas } from '@/components/canvas/FixedCanvas'

/** 키오스크 공통 셸. 유휴 타임아웃·전체화면 진입·에러 바운더리가 여기 붙는다. */
export default function KioskLayout({ children }: { children: ReactNode }) {
  return (
    <FixedCanvas>
      {/* 화면을 그리지 않는다. hot 계층을 뒤에서 받아 둔다. */}
      <HotAssetPreload />
      {children}
    </FixedCanvas>
  )
}
