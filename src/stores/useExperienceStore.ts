import { create } from "zustand";
import type { CakeConfig } from "@/data/cake";
import type { FlavorId } from "@/data/flavors";
import type { PartyId } from "@/data/parties";
import type { RelationId } from "@/data/relations";
import type { StyleId } from "@/data/styles";
import { FIRST_STEP, nextStep, prevStep, type Step } from "@/lib/steps";

interface ExperienceState {
  step: Step;
  relation: RelationId | null;
  style: StyleId | null;
  party: PartyId | null;
  flavor: FlavorId | null;
  // 문답 답변으로 만든 케이크 구성. 분석이 끝나기 전에는 null이다.
  cake: CakeConfig | null;
  goNext: () => void;
  goPrev: () => void;
  goTo: (step: Step) => void;
  setRelation: (relation: RelationId) => void;
  setStyle: (style: StyleId) => void;
  setParty: (party: PartyId) => void;
  setFlavor: (flavor: FlavorId) => void;
  setCake: (cake: CakeConfig) => void;
  reset: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  step: FIRST_STEP,
  relation: null,
  style: null,
  party: null,
  flavor: null,
  cake: null,
  goNext: () => set((state) => ({ step: nextStep(state.step) })),
  goPrev: () => set((state) => ({ step: prevStep(state.step) })),
  goTo: (step) => set({ step }),
  setRelation: (relation) => set({ relation }),
  setStyle: (style) => set({ style }),
  setParty: (party) => set({ party }),
  setFlavor: (flavor) => set({ flavor }),
  setCake: (cake) => set({ cake }),
  reset: () =>
    set({
      step: FIRST_STEP,
      relation: null,
      style: null,
      party: null,
      flavor: null,
      cake: null,
    }),
}));
