import { describe, expect, it } from "vitest";
import { isDiscordLink } from "#/utils/message";

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