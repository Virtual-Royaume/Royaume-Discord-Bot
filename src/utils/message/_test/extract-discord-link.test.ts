import { describe, it, expect } from "vitest";
import { extractDiscordLink } from "#/utils/message";

describe("msgParams function", () => {
  it("should correctly extract discord link", () => {
    expect(
      extractDiscordLink([
        "Salut check : https://discord.com/channels/732251741999071303/786216771723198514/803532192793493544",
        "et https://canary.discord.com/channels/732251741999071303/786216771723198514/803532192793493544"].join(" "))
    ).toEqual([
      "https://discord.com/channels/732251741999071303/786216771723198514/803532192793493544",
      "https://canary.discord.com/channels/732251741999071303/786216771723198514/803532192793493544"
    ]);
  });

  it("should return null when no discord link is found", () => {
    expect(
      extractDiscordLink("Salut check : https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe(null);
  });
});