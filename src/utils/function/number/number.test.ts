import { describe, expect, it } from "vitest";
import { numberFormat } from "./number.util";

describe("numberFormat", () => {
  it("should format a large number with a space as a thousands separator", () => {
    expect(numberFormat(1_000)).toBe("1 000");
  });

  it("should format a very large number with spaces as thousands separators", () => {
    expect(numberFormat(44_555_000)).toBe("44 555 000");
  });

  it("should format a decimal number with a comma as a decimal separator", () => {
    expect(numberFormat(500.55)).toBe("500,55");
  });

  it("should format zero as '0'", () => {
    expect(numberFormat(0)).toBe("0");
  });

  it("should format negative numbers correctly", () => {
    expect(numberFormat(-1234)).toBe("-1 234");
    expect(numberFormat(-9876.54)).toBe("-9 876,54");
  });

  it("should format numbers with different decimal places", () => {
    expect(numberFormat(123.456)).toBe("123,456");
    expect(numberFormat(78.9)).toBe("78,9");
    expect(numberFormat(1000.0)).toBe("1 000");
  });

  it("should handle NaN", () => {
    expect(numberFormat(NaN)).toBe("NaN");
  });
});