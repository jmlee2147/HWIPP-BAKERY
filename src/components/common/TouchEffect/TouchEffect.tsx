"use client";

import { useEffect, useRef, useState } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const SIZE = 150;

// 화면을 누른 자리에 번지는 고리를 그린다. 터치가 인식됐다는 것을 바로 보여 주기 위해서다.
// 누르는 동작을 가로채지 않도록 포인터 이벤트는 받지 않는다.
export const TouchEffect = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const layer = layerRef.current;
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      if (rect.width === 0) return;
      // 스테이지는 배율이 걸려 있으므로 화면 좌표를 스테이지 좌표로 되돌린다.
      const ratio = layer.offsetWidth / rect.width;
      const x = (event.clientX - rect.left) * ratio;
      const y = (event.clientY - rect.top) * ratio;
      nextId.current += 1;
      setRipples((current) => [...current, { id: nextId.current, x, y }]);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      data-testid="touch-layer"
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          data-testid="touch-ripple"
          className="absolute animate-touch-ring rounded-full border-[6px] border-candy bg-white/40"
          style={{
            left: ripple.x - SIZE / 2,
            top: ripple.y - SIZE / 2,
            width: SIZE,
            height: SIZE,
          }}
          onAnimationEnd={() =>
            setRipples((current) =>
              current.filter((item) => item.id !== ripple.id),
            )
          }
        />
      ))}
    </div>
  );
};
