"use client";

import { useEffect, useRef } from "react";
import { STAGE_HEIGHT, STAGE_WIDTH } from "@/lib/stage";

const COLORS = ["#e6f4a4", "#ffcbe7", "#ffd9c9", "#fff2c4", "#ff9ccf"];
const PIECE_COUNT = 110;
const GRAVITY = 2200;
// 터지는 자리. 카드 한가운데쯤이다.
const ORIGIN = { x: STAGE_WIDTH / 2, y: 1150 };

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  spin: number;
  color: string;
}

const createPieces = (): Piece[] =>
  Array.from({ length: PIECE_COUNT }, () => {
    // 위쪽으로 넓게 퍼지도록 방향을 잡는다.
    const direction = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
    const speed = 700 + Math.random() * 1500;
    return {
      x: ORIGIN.x,
      y: ORIGIN.y,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      width: 16 + Math.random() * 18,
      height: 34 + Math.random() * 30,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });

// 색종이가 한 번 팡 터졌다가 떨어진다. 화면에 올리는 순간 시작한다.
export const ConfettiBurst = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const pieces = createPieces();
    let last = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const elapsed = Math.min((now - last) / 1000, 0.05);
      last = now;
      context.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
      context.globalAlpha = 0.85;

      let visible = false;
      for (const piece of pieces) {
        piece.vy += GRAVITY * elapsed;
        // 공기 저항. 처음에는 빠르게 퍼지고 곧 느려져 팔랑거리며 떨어진다.
        piece.vx *= 1 - 1.6 * elapsed;
        piece.vy *= 1 - 1.6 * elapsed;
        piece.x += piece.vx * elapsed;
        piece.y += piece.vy * elapsed;
        piece.angle += piece.spin * elapsed;
        if (piece.y < STAGE_HEIGHT + 80) visible = true;

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.angle);
        context.fillStyle = piece.color;
        context.fillRect(
          -piece.width / 2,
          -piece.height / 2,
          piece.width,
          piece.height,
        );
        context.restore();
      }

      if (visible) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      className="pointer-events-none absolute inset-0 z-20 size-full"
    />
  );
};
