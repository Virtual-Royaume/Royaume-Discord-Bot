import { dayJS } from "#/configs/day-js";
import { describe, expect, it } from "vitest";
import { dateFormat } from "../date.util";

describe("dateFormat", () => {
  it("should format the date with the default separator", () => {
    expect(dateFormat(dayJS("2023-06-03"))).toBe("03-06-2023");
  });

  it("should format the date with a custom separator", () => {
    expect(dateFormat(dayJS("2023-06-03"), "/")).toBe("03/06/2023");
  });

  it("should handle invalid dates and return 'Invalid Date'", () => {
    expect(dateFormat(dayJS("invalid-date"))).toBe("Invalid Date");
  });
});