import { describe, it, expect } from "vitest";
import { msgParams } from "./message";

describe("msgParams", () => {
  it("should replace the word", () => {
    expect(msgParams("Hello {0}", ["World"])).toBe("Hello World");
  });

  it("should replace the word with multiple params", () => {
    expect(msgParams("Hello {0} {1}", ["World", "Vitest"])).toBe("Hello World Vitest");
  });

  it("should replace the word with multiple params and multiple words", () => {
    expect(msgParams("Hello {0} {1} {0}", ["World", "Vitest"])).not.toBe("Hello World Vitest World");
  });

  it("should have more params than words", () => {
    expect(msgParams("Hello {0}", ["World", "Vitest"])).toBe("Hello World");
  });

  it("should have less params than words", () => {
    expect(msgParams("Hello {0} {1}", ["World"])).toBe("Hello World undefined");
  });

  it("should have no params", () => {
    expect(msgParams("Hello {0}", [])).toBe("Hello undefined");
  });

  it("should not have any words", () => {
    expect(msgParams("Hello", ["World"])).toBe("Hello");
  });

  it("should not have nothing", () => {
    expect(msgParams("", [])).toBe("");
  });

  it("should not have text", () => {
    expect(msgParams("", ["Hello", "World"])).toBe("");
  });
});