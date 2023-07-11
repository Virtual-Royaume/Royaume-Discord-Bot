import { describe, expect, it } from "vitest";
import { containsDiscordLink } from "#/utils/message";

describe("isDiscordLink function", () => {
  it("should return true when the link is a discord canary link", () => {
    expect(
      containsDiscordLink("A discord canary link: https://canary.discord.com/channels/732251741999071303/1113731433123565589/1113731587570413588")
    ).toBe(true);
  });

  it("should return true when the link is a discord ptb link", () => {
    expect(
      containsDiscordLink("A discord ptb link: https://ptb.discord.com/channels/732251741999071303/786216771723198514/1075749993631191110")
    ).toBe(true);
  });

  it("should return true when the link is a discord link", () => {
    expect(containsDiscordLink("A discord link: https://discord.com/channels/732251741999071303/786216771723198514/803532192793493544")).toBe(true);
  });

  it("should return false because is not valid", () => {
    expect(containsDiscordLink("A invalid discord link: https://discord.com/channels/732251741999071303")).toBe(false);
  });

  it("should return false because is litteraly not a discord link", () => {
    expect(containsDiscordLink("A link that not discord: https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(false);
  });
});