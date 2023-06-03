import { describe, expect, it } from "vitest";
import { formatMinutes } from "../date.util";

describe("formatMinutes", () => {
  it("should format minutes correctly when there are days, hours, and minutes", () => {
    expect(formatMinutes(3720)).toBe("2 jours et 14 heures");
  });

  it("should format minutes correctly when there are only hours and minutes", () => {
    expect(formatMinutes(135)).toBe("2 heures et 15 minutes");
  });

  it("should format minutes correctly when there are only minutes", () => {
    expect(formatMinutes(45)).toBe("45 minutes");
  });

  it("should format minutes as '0 minutes' when given 0", () => {
    expect(formatMinutes(0)).toBe("0 minutes");
  });

  it("should format negative minutes correctly", () => {
    expect(formatMinutes(-120)).toBe("-2 heures");
  });

  it("should format negative minutes correctly with days and hours", () => {
    expect(formatMinutes(-2880)).toBe("-2 jours");
  });
});