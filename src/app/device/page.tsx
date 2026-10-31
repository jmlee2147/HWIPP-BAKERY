"use client";

import { useEffect, useState } from "react";
import { clearRuns, type Run, readRuns } from "@/lib/diagnostics";
import { STEP_LABELS } from "@/lib/steps";

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
  const [runs, setRuns] = useState<Run[]>([]);

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
    setRuns(readRuns());
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

      <div className="mt-8 flex items-center gap-4">
        <h2 className="text-2xl font-bold">체험 기록</h2>
        <button
          type="button"
          className="border border-black/30 px-3 py-1"
          onClick={() => {
            clearRuns();
            setRuns([]);
          }}
        >
          기록 지우기
        </button>
      </div>
      <p className="mt-2 text-sm text-black/60">
        브라우저가 체험 도중 페이지를 닫으면 "종료됨"으로 남습니다. 단계 옆의
        값은 그 단계에 들어선 시점의 그림 수, 그림을 푼 크기, 요소 수, 움직이는
        것의 수입니다.
      </p>
      {runs.length === 0 && <p className="mt-4">기록이 없습니다.</p>}
      {runs.map((run) => (
        <section key={run.startedAt} className="mt-6">
          <h3 className="font-bold">
            {run.startedAt.replace("T", " ").slice(0, 19)}{" "}
            {run.closed ? "정상 종료" : "종료됨"}
          </h3>
          <table className="mt-1 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/20 text-left">
                <th className="py-1 pr-3">단계</th>
                <th className="py-1 pr-3">초</th>
                <th className="py-1 pr-3">그림</th>
                <th className="py-1 pr-3">푼 크기</th>
                <th className="py-1 pr-3">요소</th>
                <th className="py-1">움직임</th>
              </tr>
            </thead>
            <tbody>
              {run.marks.map((mark, index) => (
                <tr
                  key={`${mark.step}-${index}-${mark.atSec}`}
                  className="border-b border-black/10"
                >
                  <td className="py-1 pr-3">{STEP_LABELS[mark.step]}</td>
                  <td className="py-1 pr-3">{mark.atSec}</td>
                  <td className="py-1 pr-3">{mark.images}</td>
                  <td className="py-1 pr-3">{mark.decodedMb}MB</td>
                  <td className="py-1 pr-3">{mark.nodes}</td>
                  <td className="py-1">{mark.animations}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!run.closed && run.marks.length > 0 && (
            <p className="mt-1 text-sm">
              마지막 단계: {STEP_LABELS[run.marks[run.marks.length - 1].step]} (
              {run.marks[run.marks.length - 1].atSec}초)
            </p>
          )}
        </section>
      ))}
    </main>
  );
}
