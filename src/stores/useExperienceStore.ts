import { create } from "zustand";
import type { RelationId } from "@/data/relations";
import { FIRST_STEP, nextStep, prevStep, type Step } from "@/lib/steps";

interface ExperienceState {
  step: Step;
  relation: RelationId | null;
  goNext: () => void;
  goPrev: () => void;
  goTo: (step: Step) => void;
  setRelation: (relation: RelationId) => void;
  reset: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  step: FIRST_STEP,
  relation: null,
  goNext: () => set((state) => ({ step: nextStep(state.step) })),
  goPrev: () => set((state) => ({ step: prevStep(state.step) })),
  goTo: (step) => set({ step }),
  setRelation: (relation) => set({ relation }),
  reset: () => set({ step: FIRST_STEP, relation: null }),
}));
