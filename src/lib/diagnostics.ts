import type { Step } from "./steps";

// 체험 도중 휴대폰 브라우저가 페이지를 닫아 버리는 일이 있다. 어디서 닫히는지 알아내려고
// 단계가 바뀔 때마다 그 시점의 상태를 남기고, 다음에 열 때 지난 기록으로 옮겨 /device에서 본다.
//
// 제대로 닫은 것인지는 따로 표시하지 않는다. iOS는 메모리 때문에 탭을 정리할 때도 pagehide를
// 보내므로 관람객이 나간 것과 구분되지 않는다. 어디까지 닿았는지를 그대로 보여 주고 읽는 쪽이 판단한다.
const CURRENT_KEY = "hwipp.run";
const PAST_KEY = "hwipp.runs";
// 들고 있을 지난 기록 수. 오래된 것부터 버린다.
const PAST_LIMIT = 10;

// 단계에 들어설 때와 화면을 다 그린 뒤를 나누어 남긴다.
// "열림"만 있고 "그려짐"이 없으면 그 화면을 그리는 도중에 페이지가 닫힌 것이다.
export type MarkPhase = "열림" | "그려짐";

export interface StepMark {
  step: Step;
  phase: MarkPhase;
  // 체험을 시작하고 여기에 닿기까지 걸린 시간(초).
  atSec: number;
  // 화면에 있던 그림 수와, 그림을 푼 크기의 어림값(MB). 들어설 때는 아직 재지 않는다.
  images?: number;
  decodedMb?: number;
  nodes?: number;
  animations?: number;
}

export interface Run {
  startedAt: string;
  marks: StepMark[];
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
  // 아직 아무것도 남기지 않은 기록이면 그대로 쓴다. 개발 중에는 이 함수가 두 번 불린다.
  if (previous && previous.marks.length === 0) return;
  if (previous) {
    const past = read<Run[]>(PAST_KEY, []);
    write(PAST_KEY, [previous, ...past].slice(0, PAST_LIMIT));
  }
  write(CURRENT_KEY, {
    startedAt: new Date().toISOString(),
    marks: [],
  } satisfies Run);
}

const elapsed = (run: Run) =>
  Math.round((Date.now() - new Date(run.startedAt).getTime()) / 1000);

// 단계에 들어설 때와 화면을 다 그린 뒤에 각각 부른다.
// 들어설 때는 재지 않는다. 재는 사이에 페이지가 닫히면 들어섰다는 사실조차 남지 않기 때문이다.
export function markStep(step: Step, phase: MarkPhase) {
  if (!canStore() || typeof document === "undefined") return;
  const run = read<Run | null>(CURRENT_KEY, null);
  if (!run) return;
  const mark: StepMark =
    phase === "열림"
      ? { step, phase, atSec: elapsed(run) }
      : { step, phase, atSec: elapsed(run), ...measure() };
  write(CURRENT_KEY, { ...run, marks: [...run.marks, mark] } satisfies Run);
}

// 화면을 그린 뒤 그림이 모두 받아지기까지 시간이 걸린다. 받아진 뒤에 다시 재서 더 큰 값으로 올린다.
// 그러지 않으면 큰 그림이 많은 화면일수록 작게 잡혀, 정작 알고 싶은 값을 놓친다.
export function remeasureStep(step: Step) {
  if (!canStore() || typeof document === "undefined") return;
  const run = read<Run | null>(CURRENT_KEY, null);
  const last = run?.marks[run.marks.length - 1];
  if (!run || !last || last.step !== step || last.phase !== "그려짐") return;
  const now = measure();
  if ((last.decodedMb ?? 0) >= now.decodedMb) return;
  write(CURRENT_KEY, {
    ...run,
    marks: [...run.marks.slice(0, -1), { ...last, ...now }],
  } satisfies Run);
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
