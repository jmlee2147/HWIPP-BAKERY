'use client'

import { useEffect } from 'react'
import { preloadHotAssets } from '@/lib/assets/preload'

/**
 * 화면을 그리지 않는다. hot 계층을 부팅 직후 한 번 받아 두는 일만 한다.
 *
 * 키오스크 셸에 둬서 어느 STEP 에서 시작하든 한 번은 돌게 한다. 두 번 불려도
 * `preloadHotAssets` 가 한 번만 돈다.
 */
export const HotAssetPreload = () => {
  useEffect(() => {
    preloadHotAssets()
  }, [])

  return null
}
