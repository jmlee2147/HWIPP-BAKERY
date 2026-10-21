"use client";

import { useEffect, useState } from "react";
import { ChoiceButton } from "@/components/common/ChoiceButton/ChoiceButton";
import { ConfirmButton } from "@/components/common/ConfirmButton/ConfirmButton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
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
  DEFAULT_CAKE,
} from "@/data/cake";
import {
  CATEGORY_HOLD_MS,
  COLOR_TINTS,
  decorationChoices,
  EDITOR_CATEGORIES,
  EDITOR_ERASE,
  EDITOR_PACK_CHOICE,
  EDITOR_QUIT,
  EDITOR_TABS,
  EDITOR_TEXT,
  type EditorCategory,
  type EditorTabId,
  ERASER_IMAGE,
  SHAPE_ICONS,
  SHAPE_MARKS,
  SIZE_ICON_SCALES,
} from "@/data/editor";
import { useCakeHistory } from "@/hooks/editor/useCakeHistory";
import { heldLayers, looseHandleKey, lostInShape } from "@/lib/cake";
import { playEffect } from "@/lib/sound";
import { useExperienceStore } from "@/stores/useExperienceStore";

// 화면이 나타난 뒤 말을 시작하기까지의 뜸.
const TYPING_DELAY_MS = 500;

// 확인 팝업이 누른 버튼 쪽에서 커져 나오도록 잡은 기준점. 팝업의 왼쪽 위가 기준이다.
const POPUP_ORIGIN = {
  quit: "origin-[811px_-101px]",
  erase: "origin-[794px_511px]",
};

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
  const moveDecorations = useExperienceStore((state) => state.moveDecorations);
  const removeDecorations = useExperienceStore(
    (state) => state.removeDecorations,
  );
  const clearDecorations = useExperienceStore(
    (state) => state.clearDecorations,
  );
  const setCake = useExperienceStore((state) => state.setCake);
  const goTo = useExperienceStore((state) => state.goTo);
  const [tab, setTab] = useState<EditorTabId>(EDITOR_TABS[0].id);
  // 장식 탭에서 고른 분류와, 그 분류의 목록이 열렸는지. 분류를 누르면 고른 상태를 잠깐 보여 준 뒤 목록을 연다.
  const [category, setCategory] = useState<EditorCategory | null>(null);
  const [listOpen, setListOpen] = useState(false);
  // 조절 상자를 두른 장식(묶음)의 열쇠.
  const [selected, setSelected] = useState<string | null>(null);
  // 그만두면 되돌아갈, 수정 화면에 들어올 때의 케이크.
  const [startCake] = useState(() => useExperienceStore.getState().cake);
  // 띄운 확인 팝업.
  const [asking, setAsking] = useState<keyof typeof POPUP_ORIGIN | null>(null);
  const history = useCakeHistory();

  useEffect(() => {
    if (!category || listOpen) return;
    const timer = setTimeout(() => setListOpen(true), CATEGORY_HOLD_MS);
    return () => clearTimeout(timer);
  }, [category, listOpen]);

  const closeList = () => {
    setCategory(null);
    setListOpen(false);
  };

  const ask = (popup: keyof typeof POPUP_ORIGIN) => {
    playEffect("popUp");
    setAsking(popup);
  };

  const quit = () => {
    if (startCake) setCake(startCake);
    goTo("result");
  };

  const erase = () => {
    history.track(clearDecorations);
    setSelected(null);
    setAsking(null);
  };

  // 레터링과 장식 탭에서는 분류를 먼저 고른다.
  const categories = EDITOR_CATEGORIES[tab];

  // 낱개 장식 하나를 더하면 그 장식에 바로 조절 상자를 두른다.
  const pickDecoration = (id: string) => {
    history.track(() => addDecoration(id));
    const added = useExperienceStore.getState().cake?.decorations ?? [];
    const one =
      added.length === cake.decorations.length + 1 &&
      added[added.length - 1].x !== undefined;
    setSelected(one ? looseHandleKey(added.length - 1) : null);
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

      <CakeWindow
        cake={cake}
        className="absolute left-[68px] top-[614px]"
        onClose={() => ask("quit")}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={() => {
          playEffect("choice");
          history.undo();
          setSelected(null);
        }}
        onRedo={() => {
          playEffect("choice");
          history.redo();
          setSelected(null);
        }}
      >
        {categories && (
          <DecorationControls
            cake={cake}
            selected={selected}
            onSelect={setSelected}
            onAdjust={adjustDecoration}
            onAdjustStart={history.startDrag}
            onAdjustEnd={history.endDrag}
            onMove={moveDecorations}
            onRemove={(indices) =>
              history.track(() => removeDecorations(indices))
            }
          />
        )}
        {/* 장식 조절 상자보다 위에 둔다. 보이는 지름은 78px이고, 터치 영역만 88px로 넓혔다. */}
        <button
          type="button"
          aria-label={EDITOR_ERASE.label}
          className="absolute left-[808.8px] top-[627.8px] flex size-[88px] items-center justify-center transition-transform duration-100 active:scale-95"
          onClick={() => ask("erase")}
        >
          <img
            alt=""
            draggable={false}
            className="block size-[78px] max-w-none"
            src={ERASER_IMAGE}
          />
        </button>
      </CakeWindow>

      {categories && category && listOpen ? (
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
          className={`${SCROLL_ROW} top-[1426px] ${categories ? "gap-[20px]" : "gap-[27px]"}`}
        >
          {categories?.map((item) => (
            <OptionTile
              key={item.id}
              size="narrow"
              label={item.label}
              icon={item.icon}
              selected={category?.id === item.id}
              onClick={() => setCategory(item)}
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
                onClick={() =>
                  history.track(() => updateCake({ size: item.id }))
                }
              />
            ))}
          {tab === "shape" &&
            shapes.map((item) => (
              <OptionTile
                key={item.id}
                label={`${SHAPE_MARKS[item.id]} - ${item.label}`}
                icon={SHAPE_ICONS[item.id]}
                selected={cake.shape === item.id}
                onClick={() =>
                  history.track(() => updateCake({ shape: item.id }))
                }
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
                onClick={() =>
                  history.track(() => updateCake({ color: item.id }))
                }
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

      {asking && (
        // 팝업이 떠 있는 동안에는 뒤 화면을 누를 수 없다.
        <div className="absolute inset-0 z-20">
          <ConfirmDialog
            message={
              asking === "quit" ? EDITOR_QUIT.message : EDITOR_ERASE.message
            }
            className={`absolute left-[129px] top-[777px] animate-window-pop motion-reduce:animate-none ${POPUP_ORIGIN[asking]}`}
          >
            {asking === "quit" ? (
              <>
                <ConfirmButton tone="gray" size="half" onClick={quit}>
                  {EDITOR_QUIT.confirm}
                </ConfirmButton>
                <ConfirmButton
                  tone="pink"
                  size="half"
                  onClick={() => setAsking(null)}
                >
                  {EDITOR_QUIT.cancel}
                </ConfirmButton>
              </>
            ) : (
              <>
                <ConfirmButton
                  tone="gray"
                  size="half"
                  onClick={() => setAsking(null)}
                >
                  {EDITOR_ERASE.cancel}
                </ConfirmButton>
                <ConfirmButton tone="pink" size="half" onClick={erase}>
                  {EDITOR_ERASE.confirm}
                </ConfirmButton>
              </>
            )}
          </ConfirmDialog>
        </div>
      )}
    </section>
  );
};
