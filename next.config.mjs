/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 개발 서버와 검증 빌드가 같은 .next 를 쓰면 webpack 캐시가 깨진다
  // (__webpack_modules__[moduleId] is not a function). 빌드는 별도 디렉터리로 분리한다.
  distDir: process.env.NEXT_DIST_DIR || '.next',

  // 정적 <img> + 프리로드를 쓴다. `.claude/rules/assets.md`
  images: { unoptimized: true },
}

export default nextConfig
