"use client";

import { useEffect, useState } from "react";
import { ResultScreen } from "@/components/result/ResultScreen/ResultScreen";
import { CAKE_SIZES } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { useExperienceStore } from "@/stores/useExperienceStore";

interface ResultPreviewProps {
  presetId?: string;
  size?: string;
}

// 고른 예시 케이크를 store에 넣은 뒤 결과 화면을 그린다. 예시를 주지 않으면 케이크가 없는 상태 그대로 보여 준다.
export const ResultPreview = ({ presetId, size }: ResultPreviewProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preset = CAKE_PRESETS.find((item) => item.id === presetId);
    if (preset) {
      const chosen = CAKE_SIZES.find((item) => item.id === size);
      useExperienceStore
        .getState()
        .setCake({ ...preset.cake, size: chosen?.id ?? preset.cake.size });
    }
    setReady(true);
  }, [presetId, size]);

  return ready ? <ResultScreen /> : null;
};
