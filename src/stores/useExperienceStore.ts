import { create } from "zustand";
import { type CakeConfig, DEFAULT_CAKE } from "@/data/cake";
import { DECORATION_PLACE_SCALES, DECORATION_SETS } from "@/data/editor";
import type { FlavorId } from "@/data/flavors";
import type { PartyId } from "@/data/parties";
import type { RelationId } from "@/data/relations";
import type { StyleId } from "@/data/styles";
import {
  adjustDecoration,
  type DecorationChange,
  placeDecoration,
  placeSet,
  removeDecoration,
} from "@/lib/cake";
import { FIRST_STEP, nextStep, prevStep, type Step } from "@/lib/steps";

type CakeBasePatch = Partial<Pick<CakeConfig, "size" | "shape" | "color">>;

interface ExperienceState {
  step: Step;
  relation: RelationId | null;
  style: StyleId | null;
  party: PartyId | null;
  flavor: FlavorId | null;
  // 문답 답변으로 만든 케이크 구성. 분석이 끝나기 전에는 null이다.
  cake: CakeConfig | null;
  // 이 기기에서 몇 번째로 만든 케이크인지. 케이크가 만들어질 때 함께 정해진다.
  orderNumber: number | null;
  goNext: () => void;
  goPrev: () => void;
  goTo: (step: Step) => void;
  setRelation: (relation: RelationId) => void;
  setStyle: (style: StyleId) => void;
  setParty: (party: PartyId) => void;
  setFlavor: (flavor: FlavorId) => void;
  setCake: (cake: CakeConfig) => void;
  // 케이크의 크기, 모양, 색상 중 준 것만 바꾼다. 케이크가 없으면 기본 케이크에서 시작한다.
  updateCake: (patch: CakeBasePatch) => void;
  // 고른 장식이나 장식 묶음을 케이크에 더한다. 케이크 모양을 따라 그린 장식은 이미 얹혀 있으면 뺀다.
  addDecoration: (id: string) => void;
  // 직접 놓은 장식의 자리, 크기, 기울기를 고치거나 뺀다. index는 케이크의 장식 목록에서의 차례다.
  adjustDecoration: (index: number, change: DecorationChange) => void;
  removeDecoration: (index: number) => void;
  setOrderNumber: (orderNumber: number) => void;
  reset: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  step: FIRST_STEP,
  relation: null,
  style: null,
  party: null,
  flavor: null,
  cake: null,
  orderNumber: null,
  goNext: () => set((state) => ({ step: nextStep(state.step) })),
  goPrev: () => set((state) => ({ step: prevStep(state.step) })),
  goTo: (step) => set({ step }),
  setRelation: (relation) => set({ relation }),
  setStyle: (style) => set({ style }),
  setParty: (party) => set({ party }),
  setFlavor: (flavor) => set({ flavor }),
  setCake: (cake) => set({ cake }),
  // 예시 케이크의 원본을 건드리지 않도록 늘 새 객체로 바꿔 넣는다.
  // 장식의 좌표는 처음 모양에 맞춰 잡힌 것이라, 모양을 바꿔도 처음 모양을 기억해 둔다.
  updateCake: (patch) =>
    set((state) => {
      const cake = state.cake ?? DEFAULT_CAKE;
      return {
        cake: {
          ...cake,
          ...patch,
          layoutShape: cake.layoutShape ?? cake.shape,
        },
      };
    }),
  addDecoration: (id) =>
    set((state) => {
      const cake = state.cake ?? DEFAULT_CAKE;
      const parts = DECORATION_SETS[id]?.parts[cake.shape];
      return {
        cake: parts
          ? placeSet(cake, parts)
          : placeDecoration(cake, id, undefined, DECORATION_PLACE_SCALES[id]),
      };
    }),
  adjustDecoration: (index, change) =>
    set((state) =>
      state.cake ? { cake: adjustDecoration(state.cake, index, change) } : {},
    ),
  removeDecoration: (index) =>
    set((state) =>
      state.cake ? { cake: removeDecoration(state.cake, index) } : {},
    ),
  setOrderNumber: (orderNumber) => set({ orderNumber }),
  reset: () =>
    set({
      step: FIRST_STEP,
      relation: null,
      style: null,
      party: null,
      flavor: null,
      cake: null,
      orderNumber: null,
    }),
}));
