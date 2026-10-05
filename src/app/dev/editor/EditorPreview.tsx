"use client";

import { useEffect, useState } from "react";
import { EditorScreen } from "@/components/editor/EditorScreen/EditorScreen";
import { CAKE_SIZES } from "@/data/cake";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { useExperienceStore } from "@/stores/useExperienceStore";

interface EditorPreviewProps {
  presetId?: string;
  size?: string;
}

// 고른 예시 케이크를 store에 넣은 뒤 수정 화면을 그린다. 예시를 주지 않으면 케이크가 없는 상태에서 시작한다.
export const EditorPreview = ({ presetId, size }: EditorPreviewProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preset = CAKE_PRESETS.find((item) => item.id === presetId);
    const chosen = CAKE_SIZES.find((item) => item.id === size);
    useExperienceStore.setState({
      cake: preset
        ? { ...preset.cake, size: chosen?.id ?? preset.cake.size }
        : null,
    });
    setReady(true);
  }, [presetId, size]);

  return ready ? <EditorScreen /> : null;
};
