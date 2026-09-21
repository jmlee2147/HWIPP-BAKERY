/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 정적 <img> + 프리로드를 쓴다. `.claude/rules/assets.md`
  images: { unoptimized: true },
}

export default nextConfig
