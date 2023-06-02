import { describe, expect, it } from "vitest";
import { firstLetterToUppercase } from "./string.util";

describe("firstLetterToUppercase", () => {
  it("should return a string with the first letter capitalized", () => {
    expect(firstLetterToUppercase("hello")).toBe("Hello");
  });

  it("should return an empty string if the input string is empty", () => {
    expect(firstLetterToUppercase("")).toBe("");
  });

  it("should return the same string if the first letter is already capitalized", () => {
    expect(firstLetterToUppercase("Hello")).toBe("Hello");
  });

  it("should handle strings with special characters", () => {
    expect(firstLetterToUppercase("#test")).toBe("#test");
  });

  it("should be capitalize only the first word letter", () => {
    expect(firstLetterToUppercase("hello world!")).toBe("Hello world!");
  });
});