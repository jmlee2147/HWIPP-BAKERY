import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearRuns,
  closeRun,
  markStep,
  readRuns,
  startRun,
} from "./diagnostics";

describe("diagnostics", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("단계를 지나간 순서대로 남긴다", () => {
    startRun();
    markStep("opening");
    markStep("relation");

    const [run] = readRuns();

    expect(run.marks.map((mark) => mark.step)).toEqual(["opening", "relation"]);
    expect(run.closed).toBe(false);
  });

  it("페이지가 제대로 닫히면 정상 종료로 남는다", () => {
    startRun();
    markStep("opening");
    closeRun();

    expect(readRuns()[0].closed).toBe(true);
  });

  it("닫히지 않은 기록은 다음에 열 때 지난 기록으로 넘어간다", () => {
    startRun();
    markStep("opening");
    markStep("relation");

    // 브라우저가 페이지를 닫아 버린 뒤 다시 연 상황이다.
    startRun();

    const runs = readRuns();

    expect(runs).toHaveLength(2);
    expect(runs[0].marks).toEqual([]);
    expect(runs[1].closed).toBe(false);
    expect(runs[1].marks.map((mark) => mark.step)).toEqual([
      "opening",
      "relation",
    ]);
  });

  it("기록을 지운다", () => {
    startRun();
    markStep("opening");

    clearRuns();

    expect(readRuns()).toEqual([]);
  });

  it("저장 공간을 쓸 수 없어도 체험을 막지 않는다", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    expect(() => {
      startRun();
      markStep("opening");
      closeRun();
    }).not.toThrow();
  });
});
