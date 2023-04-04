import { describe, it, expect } from "vitest";
import { isHexColor } from "./color.util";

describe("isHexColor", () => {
  it("should return false if prefix is missing", () => {
    expect(isHexColor("49FF39")).toBeFalsy();
  });

  it("should return false if special characters are present", () => {
    expect(isHexColor("#384-N4")).toBeFalsy();
    expect(isHexColor("#384FN4.")).toBeFalsy();
    expect(isHexColor("#384.N4")).toBeFalsy();
    expect(isHexColor("#3/43N4")).toBeFalsy();
  });

  it("should return false if number of characters is not equal to 3 or 6", () => {
    expect(isHexColor("#384FN4A")).toBeFalsy();
    expect(isHexColor("#38")).toBeFalsy();
  });

  it("should return true for valid 3 and 6 character hex codes", () => {
    expect(isHexColor("#F5F")).toBeTruthy();
    expect(isHexColor("#384FN4")).toBeTruthy();
  });

  it("should return true for upper and lower case characters", () => {
    expect(isHexColor("#fF4ekJ")).toBeTruthy();
  });
});