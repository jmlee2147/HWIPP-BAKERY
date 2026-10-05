import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const TITLE = "HWIPP BAKERY";
const DESCRIPTION = "세상에 하나뿐인 맞춤 케이크를 구워드리는 곳";

// 링크 미리보기 이미지의 주소는 절대 주소여야 한다. 배포본에서는 Vercel이 넣어 주는 운영 주소를 쓴다.
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
