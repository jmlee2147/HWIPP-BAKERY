import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearRuns,
  markStep,
  readRuns,
  remeasureStep,
  startRun,
} from "./diagnostics";

describe("diagnostics", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("단계를 들어설 때와 다 그린 뒤로 나누어 남긴다", () => {
    startRun();
    markStep("opening", "열림");
    markStep("opening", "그려짐");
    markStep("relation", "열림");

    const [run] = readRuns();

    expect(run.marks.map((mark) => `${mark.step} ${mark.phase}`)).toEqual([
      "opening 열림",
      "opening 그려짐",
      "relation 열림",
    ]);
  });

  it("들어설 때는 재지 않고, 다 그린 뒤에만 잰다", () => {
    startRun();
    markStep("opening", "열림");
    markStep("opening", "그려짐");

    const [open, drawn] = readRuns()[0].marks;

    expect(open.decodedMb).toBeUndefined();
    expect(drawn.decodedMb).toBeDefined();
    expect(drawn.nodes).toBeGreaterThan(0);
  });

  it("그림이 늦게 받아져 커지면 다시 잰 값으로 올린다", () => {
    startRun();
    markStep("opening", "열림");
    markStep("opening", "그려짐");
    const before = readRuns()[0].marks[1].decodedMb ?? 0;

    // 그림이 모두 받아져 크기가 잡힌 상황이다.
    const image = document.createElement("img");
    Object.defineProperty(image, "naturalWidth", { value: 2000 });
    Object.defineProperty(image, "naturalHeight", { value: 2000 });
    document.body.append(image);
    remeasureStep("opening");

    const after = readRuns()[0].marks[1].decodedMb ?? 0;

    expect(after).toBeGreaterThan(before);
    // 줄 수는 그대로다. 값만 올린다.
    expect(readRuns()[0].marks).toHaveLength(2);
    image.remove();
  });

  it("닫히지 않은 기록은 다음에 열 때 지난 기록으로 넘어간다", () => {
    startRun();
    markStep("opening", "열림");
    markStep("relation", "열림");

    // 브라우저가 페이지를 닫아 버린 뒤 다시 연 상황이다.
    startRun();

    const runs = readRuns();

    expect(runs).toHaveLength(2);
    expect(runs[0].marks).toEqual([]);
    expect(runs[1].marks.map((mark) => mark.step)).toEqual([
      "opening",
      "relation",
    ]);
  });

  it("기록을 지운다", () => {
    startRun();
    markStep("opening", "열림");

    clearRuns();

    expect(readRuns()).toEqual([]);
  });

  it("저장 공간을 쓸 수 없어도 체험을 막지 않는다", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    expect(() => {
      startRun();
      markStep("opening", "열림");
      markStep("opening", "그려짐");
      remeasureStep("opening");
    }).not.toThrow();
  });
});
