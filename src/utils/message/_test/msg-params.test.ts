import { describe, it, expect } from "vitest";
import { msgParams } from "#/utils/message";

describe("msgParams function", () => {
  it("should correctly replace placeholders with provided words", () => {
    expect(msgParams("Hello {name}", ["Royaume"])).toBe("Hello Royaume");
  });

  it("should correctly replace multiple placeholders with provided words", () => {
    expect(msgParams("Hello {name} and {otherName}", ["TS", "Vitest"])).toBe("Hello TS and Vitest");
  });

  it("should correctly replace placeholders with provided words, ignoring duplicates", () => {
    expect(msgParams("Hello {0} {1} {0}", ["World", "Vitest"])).toBe("Hello World Vitest {0}");
  });

  it("should handle cases where there are more placeholders than words", () => {
    expect(msgParams("Hello {name}", ["World", "Vitest"])).toBe("Hello World");
  });

  it("should handle cases where there are fewer placeholders than words", () => {
    expect(msgParams("Hello {0} {1}", ["World"])).toBe("Hello World {1}");
  });

  it("should handle cases where there are no placeholders", () => {
    expect(msgParams("Hello", ["World"])).toBe("Hello");
  });

  it("should handle cases where there is no text", () => {
    expect(msgParams("", [])).toBe("");
  });

  it("should ignore extra words when there are no placeholders", () => {
    expect(msgParams("Hello", ["Hello", "World"])).toBe("Hello");
  });
});