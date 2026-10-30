"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Cake } from "@/components/cake/Cake/Cake";
import { GlowBackground } from "@/components/common/GlowBackground/GlowBackground";
import { CAKE_BOARD, CAKE_SHAPES, type CakeShapeId } from "@/data/cake";
import type { CakePreset } from "@/data/cakePresets";
import {
  MENU_BACK_LABEL,
  MENU_CLOSE_LABEL,
  MENU_GLOWS,
  MENU_GRID,
  MENU_IMAGES,
  MENU_PACK_CHOICE,
  MENU_POPUP_CAKE,
  MENU_TABS,
  MENU_TEXT,
  menuCakes,
} from "@/data/menu";
import { cakeLayers } from "@/lib/cake";
import { loadImages } from "@/lib/preload";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

// 케이크 바탕의 가운데. 판 안에서 바탕은 머리 공간 아래의 가운데에 놓인다.
const BASE_CENTER = {
  x: CAKE_BOARD.width / 2,
  y: CAKE_BOARD.headroom + (CAKE_BOARD.height - CAKE_BOARD.headroom) / 2,
};

// 목록 창. 케이크 목록은 이 창 안에서 안내 문구 아래부터 위아래로 밀어 본다.
const WINDOW = { left: 101.5, top: 320, width: 874, height: 1317 };
const LIST_TOP = 519;
// 스크롤 위치를 알려 주는 막대. 목록의 맨 위에서는 top에, 맨 아래에서는 bottom에 닿는다.
const SCROLL_BAR = { left: 952.5, top: 567, bottom: 1600, height: 126 };

// 그림을 받는 동안 기다리는 가장 긴 시간. 이보다 오래 걸리면 다 받지 못했어도 목록을 보여 준다.
const LOAD_TIMEOUT_MS = 6000;
// 그림을 모두 받아 둔 탭. 페이지가 열려 있는 동안은 다시 기다리지 않는다.
const loadedShapes = new Set<CakeShapeId>();

// 탭에 보일 케이크들의 그림. 같은 부품은 한 번만 센다.
const cakeImages = (shape: CakeShapeId) => [
  ...new Set(
    menuCakes(shape).flatMap((preset) =>
      cakeLayers(preset.cake).map((layer) => layer.src),
    ),
  ),
];

// 바탕의 가운데를 주어진 자리에 맞추고, 바탕이 주어진 너비가 되도록 케이크를 줄여 그린다.
const PlacedCake = ({
  preset,
  centerX,
  centerY,
  baseWidth,
}: {
  preset: CakePreset;
  centerX: number;
  centerY: number;
  baseWidth: number;
}) => {
  const shape =
    CAKE_SHAPES.find((item) => item.id === preset.cake.shape) ?? CAKE_SHAPES[0];
  const scale = baseWidth / shape.width;
  return (
    <div
      className="pointer-events-none absolute origin-top-left"
      style={{
        left: centerX - BASE_CENTER.x * scale,
        top: centerY - BASE_CENTER.y * scale,
        transform: `scale(${scale})`,
      }}
    >
      <Cake cake={preset.cake} />
    </div>
  );
};

export const MenuScreen = () => {
  const goTo = useExperienceStore((state) => state.goTo);
  const menuReturn = useExperienceStore((state) => state.menuReturn);
  const setCake = useExperienceStore((state) => state.setCake);
  const [shape, setShape] = useState<CakeShapeId>("round");
  const [picked, setPicked] = useState<CakePreset | null>(null);
  const [scrolled, setScrolled] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(() => loadedShapes.has(shape));
  const cakes = menuCakes(shape);

  // 케이크는 부품 그림을 겹쳐 그려서, 받는 대로 보여 주면 장식이 먼저 떠다니다가 바탕이 늦게 뜬다.
  // 탭의 그림을 모두 받을 때까지 목록을 가리고 기다리는 표시를 보여 준다.
  useEffect(() => {
    if (loadedShapes.has(shape)) {
      setReady(true);
      return;
    }
    setReady(false);
    let alive = true;
    void loadImages(cakeImages(shape), LOAD_TIMEOUT_MS).then((complete) => {
      if (complete) loadedShapes.add(shape);
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [shape]);

  const changeShape = (next: CakeShapeId) => {
    if (next === shape) return;
    playEffect("choice");
    setShape(next);
    setScrolled(0);
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  // 고른 예시를 그대로 케이크로 삼아 최종 완성 화면으로 간다. 예시의 원본은 건드리지 않는다.
  const pack = (preset: CakePreset) => {
    playEffect("choice");
    setCake({
      ...preset.cake,
      decorations: preset.cake.decorations.map((item) => ({ ...item })),
    });
    goTo("share");
  };

  return (
    <section className="absolute inset-0 overflow-hidden">
      <GlowBackground glows={MENU_GLOWS} />

      <div className="absolute left-[41.5px] top-[161px] h-[1680px] w-[997px] bg-cocoa" />
      <img
        alt=""
        draggable={false}
        className="absolute left-[85.5px] top-[192px] block h-[1585px] w-[909px] max-w-none border-[1.02px] border-[#c2c2c2]"
        src={MENU_IMAGES.paper}
      />
      <img
        alt=""
        draggable={false}
        className="absolute left-[370.5px] top-[-48px] block size-[355px] max-w-none"
        src={MENU_IMAGES.clip}
      />

      <div
        className="absolute overflow-hidden border-[3px] border-taupe bg-[linear-gradient(170deg,rgba(110,82,70,0.7)_8%,rgba(239,217,204,0.4)_100%)]"
        style={{
          left: WINDOW.left,
          top: WINDOW.top,
          width: WINDOW.width,
          height: WINDOW.height,
        }}
      />
      <div className="absolute left-[167.5px] top-[430px] h-[46px] w-[742.4px] bg-cocoa" />
      <div className="absolute left-[344.7px] top-[473.3px] h-[46px] w-[390.7px] bg-cocoa" />
      <p className="absolute left-[139.3px] top-[432.8px] w-[800px] whitespace-pre text-center font-stardust text-[27.909px] font-bold leading-[40.468px] tracking-[1.395px] text-candy">
        {MENU_TEXT}
      </p>

      <div
        ref={listRef}
        className="absolute overflow-y-auto overflow-x-hidden [touch-action:pan-y] [&::-webkit-scrollbar]:hidden"
        style={{
          left: WINDOW.left + 3,
          top: LIST_TOP,
          width: WINDOW.width - 6,
          height: WINDOW.top + WINDOW.height - 3 - LIST_TOP,
        }}
        onScroll={(event) => {
          const list = event.currentTarget;
          const room = list.scrollHeight - list.clientHeight;
          setScrolled(room > 0 ? list.scrollTop / room : 0);
        }}
      >
        <ul
          className={`flex flex-wrap transition-opacity duration-200 ${ready ? "opacity-100" : "opacity-0"}`}
          style={{
            paddingLeft: MENU_GRID.paddingLeft - 3,
            paddingTop: MENU_GRID.paddingTop,
            paddingBottom: MENU_GRID.paddingBottom,
            width:
              MENU_GRID.columns * MENU_GRID.cellWidth + MENU_GRID.paddingLeft,
          }}
        >
          {cakes.map((preset, index) => (
            <li
              key={preset.id}
              className="relative shrink-0"
              style={{
                width: MENU_GRID.cellWidth,
                height: MENU_GRID.cellHeight,
              }}
            >
              <button
                type="button"
                aria-label={`${index + 1}번 케이크 크게 보기`}
                className="absolute inset-0 size-full transition-transform duration-100 active:scale-[0.96]"
                onClick={() => {
                  playEffect("popUp");
                  setPicked(preset);
                }}
              >
                <PlacedCake
                  preset={preset}
                  centerX={MENU_GRID.cellWidth / 2}
                  centerY={MENU_GRID.cellHeight / 2}
                  baseWidth={MENU_GRID.baseWidth}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {!ready && (
        <output
          aria-label="케이크를 불러오는 중"
          className="absolute left-[502.5px] top-[1042px] block size-[76px] animate-spin rounded-full border-[8px] border-blush border-t-cocoa"
        />
      )}
      <div
        aria-hidden
        className="absolute w-[12px] rounded-[20px] bg-cocoa"
        style={{
          left: SCROLL_BAR.left,
          top:
            SCROLL_BAR.top +
            scrolled * (SCROLL_BAR.bottom - SCROLL_BAR.height - SCROLL_BAR.top),
          height: SCROLL_BAR.height,
        }}
      />

      <img
        alt=""
        draggable={false}
        className="absolute left-[378.4px] top-[256.2px] block h-[152px] w-[345px] max-w-none"
        src={MENU_IMAGES.title}
      />
      <img
        alt=""
        draggable={false}
        className="absolute left-[689.5px] top-[246.4px] block h-[63px] w-[67px] max-w-none"
        src={MENU_IMAGES.star}
      />
      <img
        alt=""
        draggable={false}
        className="absolute left-[312.8px] top-[343.6px] block h-[63px] w-[67px] max-w-none"
        src={MENU_IMAGES.star}
      />

      <div
        role="tablist"
        className="absolute left-[318.5px] top-[1655px] h-[102px] w-[451px] rounded-full border border-black bg-white"
      >
        <span className="absolute left-[152.2px] top-[21px] h-[57.4px] w-[1.09px] bg-[#cecece]" />
        <span className="absolute left-[285.3px] top-[21px] h-[57.4px] w-[1.09px] bg-[#cecece]" />
        {MENU_TABS.map((tab, index) => {
          const selected = tab.shape === shape;
          // 탭마다 칸을 나누는 선 사이를 누르는 자리로 쓴다.
          const edges = [0, 152.7, 285.8, 451];
          return (
            <button
              key={tab.shape}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={tab.label}
              className="absolute top-0 h-full"
              style={{
                left: edges[index],
                width: edges[index + 1] - edges[index],
              }}
              onClick={() => changeShape(tab.shape)}
            >
              <img
                alt=""
                draggable={false}
                className="absolute block max-w-none"
                src={selected ? tab.on : tab.off}
                style={{ left: tab.left - edges[index], top: tab.top }}
              />
            </button>
          );
        })}
      </div>

      {/* 보이는 지름은 91.47px이고, 처음으로 버튼과 같은 모양이다. */}
      <button
        type="button"
        aria-label={MENU_BACK_LABEL}
        className="absolute left-[60.5px] top-[39px] size-[91.47px] rounded-full border-[1.97px] border-[#867b76] bg-mint/80 transition-transform duration-100 active:scale-95"
        onClick={() => {
          playEffect("choice");
          goTo(menuReturn);
        }}
      >
        <img
          alt=""
          draggable={false}
          className="absolute left-[25.7px] top-[28px] block h-[32px] w-[34px] max-w-none"
          src={MENU_IMAGES.back}
        />
      </button>

      <AnimatePresence>
        {picked && (
          <motion.div
            key={picked.id}
            role="dialog"
            aria-modal
            className="absolute left-[157.5px] top-[555px] h-[810px] w-[765px] overflow-hidden border-2 border-cocoa bg-white"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <PlacedCake
              preset={picked}
              centerX={MENU_POPUP_CAKE.centerX}
              centerY={MENU_POPUP_CAKE.centerY}
              baseWidth={MENU_POPUP_CAKE.baseWidth}
            />
            {/* 보이는 지름은 55.5px이고, 터치 영역만 88px로 넓혔다. */}
            <button
              type="button"
              aria-label={MENU_CLOSE_LABEL}
              className="absolute left-[660.75px] top-[19.75px] flex size-[88px] items-center justify-center transition-transform duration-100 active:scale-95"
              onClick={() => {
                playEffect("choice");
                setPicked(null);
              }}
            >
              <span className="flex size-[55.5px] items-center justify-center rounded-full border border-cocoa bg-candy">
                <img
                  alt=""
                  draggable={false}
                  className="block size-[22.2px] max-w-none"
                  src={MENU_IMAGES.close}
                />
              </span>
            </button>
            <button
              type="button"
              className="absolute left-[101px] top-[687px] h-[87.2px] w-[562px] rounded-[6.48px] border border-cocoa bg-[#f2f2f2] shadow-[-0.518px_0.777px_15.171px_0px_rgba(255,255,255,0.63)] transition-transform duration-100 active:scale-[0.98]"
              onClick={() => pack(picked)}
            >
              <span className="absolute inset-x-[4.3px] inset-y-[2.8px] rounded-[6.48px] border-[0.26px] border-[#909090] bg-petal shadow-[inset_2.85px_-2.264px_16.19px_0px_rgba(255,255,255,0.47)]" />
              <span className="relative font-stardust text-[28px] font-bold leading-[38.494px] tracking-[0.56px] text-[#5e3e23]">
                {MENU_PACK_CHOICE}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
