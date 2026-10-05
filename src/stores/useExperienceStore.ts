import { create } from "zustand";
import { type CakeConfig, DEFAULT_CAKE } from "@/data/cake";
import type { FlavorId } from "@/data/flavors";
import type { PartyId } from "@/data/parties";
import type { RelationId } from "@/data/relations";
import type { StyleId } from "@/data/styles";
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
