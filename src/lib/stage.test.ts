import { describe, expect, it } from "vitest";
import { computeStageScale } from "./stage";

describe("computeStageScale", () => {
  it("시안과 같은 크기면 1배다", () => {
    expect(computeStageScale(1080, 1920)).toBe(1);
  });

  it("세로 QHD 키오스크(1440x2560)에서는 비율이 같아 꽉 찬다", () => {
    expect(computeStageScale(1440, 2560)).toBeCloseTo(1440 / 1080);
  });

  it("시안보다 길쭉한 휴대폰에서는 너비에 맞춘다", () => {
    expect(computeStageScale(390, 844)).toBeCloseTo(390 / 1080);
  });

  it("가로 화면에서는 높이에 맞춘다", () => {
    expect(computeStageScale(1920, 1080)).toBeCloseTo(1080 / 1920);
  });

  it("뷰포트 크기를 알 수 없으면 0을 돌려준다", () => {
    expect(computeStageScale(0, 800)).toBe(0);
  });
});
