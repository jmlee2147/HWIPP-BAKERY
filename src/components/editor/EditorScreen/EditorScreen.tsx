"use client";

import { useEffect, useState } from "react";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { SpeechBubble } from "@/components/common/SpeechBubble/SpeechBubble";
import { TypedText } from "@/components/common/TypedText/TypedText";
import { CakeWindow } from "@/components/editor/CakeWindow/CakeWindow";
import { DecorationControls } from "@/components/editor/DecorationControls/DecorationControls";
import { DecorationList } from "@/components/editor/DecorationList/DecorationList";
import { OptionTile } from "@/components/editor/OptionTile/OptionTile";
import {
  CAKE_COLORS,
  CAKE_SHAPES,
  CAKE_SIZES,
  type CakeDecorationCategory,
  DEFAULT_CAKE,
} from "@/data/cake";
import {
  CATEGORY_HOLD_MS,
  COLOR_TINTS,
  DECORATION_CATEGORIES,
  decorationChoices,
  EDITOR_PACK_CHOICE,
  EDITOR_TABS,
  EDITOR_TEXT,
  type EditorTabId,
  SHAPE_ICONS,
  SHAPE_MARKS,
  SIZE_ICON_SCALES,
} from "@/data/editor";
import { heldLayers, lostInShape } from "@/lib/cake";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

// 줄이 화면보다 길면 좌우로 밀어 본다. 스크롤 막대는 숨긴다.
const SCROLL_ROW =
  "absolute left-0 flex w-full overflow-x-auto px-[68px] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden";

export const EditorScreen = () => {
  // 오프닝에서 바로 들어오면 케이크가 없다. 기본 케이크에서 시작한다.
  const cake = useExperienceStore((state) => state.cake) ?? DEFAULT_CAKE;
  const updateCake = useExperienceStore((state) => state.updateCake);
  const addDecoration = useExperienceStore((state) => state.addDecoration);
  const adjustDecoration = useExperienceStore(
    (state) => state.adjustDecoration,
  );
  const removeDecoration = useExperienceStore(
    (state) => state.removeDecoration,
  );
  const goTo = useExperienceStore((state) => state.goTo);
  const [tab, setTab] = useState<EditorTabId>(EDITOR_TABS[0].id);
  // 장식 탭에서 고른 분류와, 그 분류의 목록이 열렸는지. 분류를 누르면 고른 상태를 잠깐 보여 준 뒤 목록을 연다.
  const [category, setCategory] = useState<CakeDecorationCategory | null>(null);
  const [listOpen, setListOpen] = useState(false);
  // 조절 상자를 두른 장식의, 케이크 장식 목록에서의 차례.
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!category || listOpen) return;
    const timer = setTimeout(() => setListOpen(true), CATEGORY_HOLD_MS);
    return () => clearTimeout(timer);
  }, [category, listOpen]);

  const closeList = () => {
    setCategory(null);
    setListOpen(false);
  };

  // 낱개 장식 하나를 더하면 그 장식에 바로 조절 상자를 두른다.
  const pickDecoration = (id: string) => {
    addDecoration(id);
    const added = useExperienceStore.getState().cake?.decorations ?? [];
    const one =
      added.length === cake.decorations.length + 1 &&
      added[added.length - 1].x !== undefined;
    setSelected(one ? added.length - 1 : null);
  };

  // 바꾸면 코팅 같은 장식이 빠지는 모양은 고르지 못하게 한다. 그 모양의 그림이 생기면 저절로 다시 보인다.
  const shapes = CAKE_SHAPES.filter(
    (item) => item.id === cake.shape || lostInShape(cake, item.id).length === 0,
  );
  // 고를 모양이 지금 모양 하나뿐이면 모양 탭을 보여 주지 않는다.
  const tabs = EDITOR_TABS.filter(
    (item) => item.id !== "shape" || shapes.length > 1,
  );

  return (
    <section className="absolute inset-0 overflow-hidden bg-[#f5efef]">
      <SpeechBubble className="absolute left-[51.55px] top-[149px]">
        <TypedText text={EDITOR_TEXT} startDelayMs={TYPING_DELAY_MS} sound />
      </SpeechBubble>
      <ProgressBar step={5} className="absolute left-[75px] top-[58px]" />

      {/* 보이는 높이는 84px이고, 터치 영역만 위아래로 2px씩 넓혔다. */}
      <div role="tablist" className={`${SCROLL_ROW} top-[502px] gap-[22px]`}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className="h-[88px] shrink-0 transition-transform duration-100 active:scale-[0.97]"
            onClick={() => {
              playEffect("choice");
              setTab(item.id);
              closeList();
              setSelected(null);
            }}
          >
            <span
              className={`mt-[2px] flex h-[84px] items-center justify-center whitespace-nowrap rounded-[80px] border-2 border-taupe px-[42px] font-stardust text-[34.73px] font-bold leading-[49.2px] tracking-[-0.87px] text-[#717171] ${tab === item.id ? "bg-[linear-gradient(to_bottom,#fff2f9_22.9%,#ffc3e2_79.5%,#fff2f9_133.9%)]" : "bg-[#f4f4f4]"}`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <CakeWindow cake={cake} className="absolute left-[68px] top-[614px]">
        {tab === "decoration" && (
          <DecorationControls
            cake={cake}
            selected={selected}
            onSelect={setSelected}
            onAdjust={adjustDecoration}
            onRemove={removeDecoration}
          />
        )}
      </CakeWindow>

      {tab === "decoration" && category && listOpen ? (
        <DecorationList
          role="tabpanel"
          className="absolute left-[68px] top-[1426px]"
          choices={decorationChoices(category, cake.shape, heldLayers(cake))}
          onPick={pickDecoration}
          onClose={closeList}
        />
      ) : (
        <div
          role="tabpanel"
          className={`${SCROLL_ROW} top-[1426px] ${tab === "decoration" ? "gap-[20px]" : "gap-[27px]"}`}
        >
          {tab === "decoration" &&
            DECORATION_CATEGORIES.map((item) => (
              <OptionTile
                key={item.id}
                size="narrow"
                label={item.label}
                icon={item.icon}
                selected={category === item.id}
                onClick={() => setCategory(item.id)}
              />
            ))}
          {tab === "size" &&
            CAKE_SIZES.map((item) => (
              <OptionTile
                key={item.id}
                label={item.label}
                icon={SHAPE_ICONS[cake.shape]}
                iconScale={SIZE_ICON_SCALES[item.id]}
                selected={cake.size === item.id}
                onClick={() => updateCake({ size: item.id })}
              />
            ))}
          {tab === "shape" &&
            shapes.map((item) => (
              <OptionTile
                key={item.id}
                label={`${SHAPE_MARKS[item.id]} - ${item.label}`}
                icon={SHAPE_ICONS[item.id]}
                selected={cake.shape === item.id}
                onClick={() => updateCake({ shape: item.id })}
              />
            ))}
          {tab === "color" &&
            CAKE_COLORS.map((item) => (
              <OptionTile
                key={item.id}
                label={item.label}
                icon={SHAPE_ICONS.round}
                tint={COLOR_TINTS[item.id]}
                selected={cake.color === item.id}
                onClick={() => updateCake({ color: item.id })}
              />
            ))}
        </div>
      )}

      <ChoiceButton
        tone="cocoa"
        className="absolute left-[62px] top-[1724px]"
        onClick={() => goTo("share")}
      >
        {EDITOR_PACK_CHOICE}
      </ChoiceButton>
    </section>
  );
};
