import { describe, it, expect } from "vitest";
import { isDiscordLink, msgParams } from "./message.util";

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

describe("isDiscordLink function", () => {
  it("should return true when the link is a discord canary link", () => {
    expect(isDiscordLink("https://canary.discord.com/channels/732251741999071303/1113731433123565589/1113731587570413588")).toBe(true);
  });

  it("should return true when the link is a discord ptb link", () => {
    expect(isDiscordLink("https://ptb.discord.com/channels/732251741999071303/786216771723198514/1075749993631191110")).toBe(true);
  });

  it("should return true when the link is a discord link", () => {
    expect(isDiscordLink("https://discord.com/channels/732251741999071303/786216771723198514/803532192793493544")).toBe(true);
  });

  it("should return false because is not valid", () => {
    expect(isDiscordLink("https://discord.com/channels/732251741999071303")).toBe(false);
  });

  it("should return false because is litteraly not a discord link", () => {
    expect(isDiscordLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(false);
  });

  it("should return false when the link is not a discord link", () => {
    expect(isDiscordLink("https://fakediscord.com/channels/732251741999071303/1113731433123565589/1113731587570413588")).toBe(false);
  });
});