import { create } from "zustand";
import type { PartyId } from "@/data/parties";
import type { RelationId } from "@/data/relations";
import type { StyleId } from "@/data/styles";
import { FIRST_STEP, nextStep, prevStep, type Step } from "@/lib/steps";

interface ExperienceState {
  step: Step;
  relation: RelationId | null;
  style: StyleId | null;
  party: PartyId | null;
  goNext: () => void;
  goPrev: () => void;
  goTo: (step: Step) => void;
  setRelation: (relation: RelationId) => void;
  setStyle: (style: StyleId) => void;
  setParty: (party: PartyId) => void;
  reset: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  step: FIRST_STEP,
  relation: null,
  style: null,
  party: null,
  goNext: () => set((state) => ({ step: nextStep(state.step) })),
  goPrev: () => set((state) => ({ step: prevStep(state.step) })),
  goTo: (step) => set({ step }),
  setRelation: (relation) => set({ relation }),
  setStyle: (style) => set({ style }),
  setParty: (party) => set({ party }),
  reset: () =>
    set({ step: FIRST_STEP, relation: null, style: null, party: null }),
}));
