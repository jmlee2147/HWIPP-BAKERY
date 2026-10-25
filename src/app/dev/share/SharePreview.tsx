"use client";

import { useEffect, useState } from "react";
import {
  type ShareScene,
  ShareScreen,
} from "@/components/share/ShareScreen/ShareScreen";
import { CAKE_PRESETS } from "@/data/cakePresets";
import { useExperienceStore } from "@/stores/useExperienceStore";

interface SharePreviewProps {
  presetId?: string;
  scene: ShareScene;
}

// 고른 예시 케이크와 문답 답변을 store에 넣은 뒤 소장 및 공유 화면을 그린다.
export const SharePreview = ({ presetId, scene }: SharePreviewProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preset = CAKE_PRESETS.find((item) => item.id === presetId);
    useExperienceStore.setState({
      step: "share",
      cake: preset?.cake ?? null,
      party: "event",
      style: "trendsetter",
      relation: "friend",
      flavor: "sweet",
    });
    setReady(true);
  }, [presetId]);

  return ready ? <ShareScreen initialScene={scene} /> : null;
};
