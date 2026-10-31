import type { Step } from "./steps";

// 체험 도중 휴대폰 브라우저가 페이지를 닫아 버리는 일이 있다. 어디서 닫히는지 알아내려고
// 단계가 바뀔 때마다 그 시점의 상태를 남긴다. 페이지가 닫히면 진행 중 기록이 그대로 남고,
// 다음에 열 때 그것을 지난 기록으로 옮겨 /device에서 본다.
const CURRENT_KEY = "hwipp.run";
const PAST_KEY = "hwipp.runs";
// 들고 있을 지난 기록 수. 오래된 것부터 버린다.
const PAST_LIMIT = 10;

export interface StepMark {
  step: Step;
  // 체험을 시작하고 이 단계에 닿기까지 걸린 시간(초).
  atSec: number;
  // 그 시점에 화면에 있던 그림 수와, 그림을 푼 크기의 어림값(MB).
  images: number;
  decodedMb: number;
  nodes: number;
  animations: number;
}

export interface Run {
  startedAt: string;
  marks: StepMark[];
  // 페이지가 제대로 닫혔으면 true. 브라우저가 닫아 버리면 false로 남는다.
  closed: boolean;
}

const canStore = () => {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    // 저장 공간을 막아 둔 브라우저.
    return false;
  }
};

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간이 꽉 찼거나 막혀 있다. 기록을 못 남겨도 체험은 이어져야 한다.
  }
};

// 화면에 있는 그림의 수와 푼 크기를 잰다. 단계가 바뀔 때만 부른다.
function measure() {
  const images = [...document.querySelectorAll("img")];
  let pixels = 0;
  for (const image of images)
    pixels += image.naturalWidth * image.naturalHeight;
  return {
    images: images.length,
    // 한 픽셀에 4바이트로 어림잡는다.
    decodedMb: Math.round((pixels * 4) / 1048576),
    nodes: document.querySelectorAll("*").length,
    animations:
      typeof document.getAnimations === "function"
        ? document.getAnimations().length
        : 0,
  };
}

// 페이지를 열 때 한 번 부른다. 지난번 기록이 닫히지 않은 채 남아 있으면 지난 기록으로 옮긴다.
export function startRun() {
  if (!canStore()) return;
  const previous = read<Run | null>(CURRENT_KEY, null);
  if (previous) {
    const past = read<Run[]>(PAST_KEY, []);
    write(PAST_KEY, [previous, ...past].slice(0, PAST_LIMIT));
  }
  write(CURRENT_KEY, {
    startedAt: new Date().toISOString(),
    marks: [],
    closed: false,
  } satisfies Run);
}

// 단계에 들어설 때마다 부른다.
export function markStep(step: Step) {
  if (!canStore() || typeof document === "undefined") return;
  const run = read<Run | null>(CURRENT_KEY, null);
  if (!run) return;
  const atSec = Math.round(
    (Date.now() - new Date(run.startedAt).getTime()) / 1000,
  );
  write(CURRENT_KEY, {
    ...run,
    marks: [...run.marks, { step, atSec, ...measure() }],
  } satisfies Run);
}

// 페이지가 제대로 닫힐 때 부른다. 이 표시가 없는 기록은 브라우저가 닫아 버린 것으로 본다.
export function closeRun() {
  if (!canStore()) return;
  const run = read<Run | null>(CURRENT_KEY, null);
  if (run) write(CURRENT_KEY, { ...run, closed: true } satisfies Run);
}

// /device에서 보여 줄 기록. 진행 중인 것을 맨 앞에 둔다.
export function readRuns(): Run[] {
  if (!canStore()) return [];
  const current = read<Run | null>(CURRENT_KEY, null);
  const past = read<Run[]>(PAST_KEY, []);
  return current ? [current, ...past] : past;
}

export function clearRuns() {
  if (!canStore()) return;
  try {
    localStorage.removeItem(CURRENT_KEY);
    localStorage.removeItem(PAST_KEY);
  } catch {
    // 지우지 못해도 할 수 있는 일이 없다.
  }
}
