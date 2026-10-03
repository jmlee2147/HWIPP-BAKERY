import { create } from "zustand";
import { FIRST_STEP, nextStep, prevStep, type Step } from "@/lib/steps";

interface ExperienceState {
  step: Step;
  goNext: () => void;
  goPrev: () => void;
  reset: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  step: FIRST_STEP,
  goNext: () => set((state) => ({ step: nextStep(state.step) })),
  goPrev: () => set((state) => ({ step: prevStep(state.step) })),
  reset: () => set({ step: FIRST_STEP }),
}));
