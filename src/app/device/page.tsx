"use client";

import { useEffect, useState } from "react";

// 키오스크 실기기의 브라우저 엔진과 CSS 지원 범위를 확인하는 진단 화면.
const CSS_CHECKS: [label: string, condition: string][] = [
  ["3D transform", "transform-style: preserve-3d"],
  ["backface-visibility", "backface-visibility: hidden"],
  ["aspect-ratio", "aspect-ratio: 1 / 1"],
  ["dvh", "height: 100dvh"],
  ["container queries", "container-type: inline-size"],
  ["color-mix", "color: color-mix(in srgb, red, blue)"],
  ["oklch", "color: oklch(0.5 0.1 20)"],
  [":has()", "selector(:has(a))"],
];

export default function DevicePage() {
  const [rows, setRows] = useState<[string, string][]>([]);

  useEffect(() => {
    const chrome = /Chrome\/(\d+)/.exec(navigator.userAgent)?.[1] ?? "-";
    setRows([
      ["userAgent", navigator.userAgent],
      ["Chromium", chrome],
      ["viewport", `${window.innerWidth} x ${window.innerHeight}`],
      ["screen", `${window.screen.width} x ${window.screen.height}`],
      ["devicePixelRatio", String(window.devicePixelRatio)],
      ["touch points", String(navigator.maxTouchPoints)],
      ...CSS_CHECKS.map(([label, condition]): [string, string] => [
        label,
        CSS.supports(condition) ? "지원" : "미지원",
      ]),
    ]);
  }, []);

  return (
    <main className="fixed inset-0 select-text overflow-auto bg-white p-6 font-mono text-base text-black">
      <h1 className="mb-4 text-2xl font-bold">기기 진단</h1>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-4 border-b border-black/10 py-2">
            <dt className="w-48 shrink-0 font-bold">{label}</dt>
            <dd className="break-all">{value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
