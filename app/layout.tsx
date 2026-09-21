import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HWIPP BAKERY',
  description: '관계를 케이크 레시피로 변환하는 전시 체험',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // 핀치 줌 차단. `.claude/rules/operations.md`
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body data-env={process.env.NODE_ENV}>{children}</body>
    </html>
  )
}
