import { DayJS } from "#/configs/day-js";
import { describe, expect, it } from "vitest";
import { dateFormat } from "../date.util";

describe("dateFormat", () => {
  it("should format the date with the default separator", () => {
    expect(dateFormat(DayJS("2023-06-03"))).toBe("03-06-2023");
  });

  it("should format the date with a custom separator", () => {
    expect(dateFormat(DayJS("2023-06-03"), "/")).toBe("03/06/2023");
  });

  it("should handle invalid dates and return 'Invalid Date'", () => {
    expect(dateFormat(DayJS("invalid-date"))).toBe("Invalid Date");
  });
});