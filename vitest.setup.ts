import { MotionGlobalConfig } from "motion/react";

// happy-dom의 Web Animations 구현은 취소된 애니메이션을 처리되지 않은 rejection으로 남긴다.
MotionGlobalConfig.skipAnimations = true;
