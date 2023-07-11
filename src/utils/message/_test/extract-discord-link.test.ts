import { describe, it, expect } from "vitest";
import { extractDiscordLink } from "#/utils/message";

describe("extractDiscordLink function", () => {
  it("should correctly extract discord canary link", () => {
    expect(extractDiscordLink("https://canary.discord.com/channels/732251741999071303/973634573936246834/1128283771691601942")).toEqual({
      guildID: "732251741999071303",
      channelID: "973634573936246834",
      messageID: "1128283771691601942"
    });
  });

  it("should correctly extract discord ptb link", () => {
    expect(extractDiscordLink("https://canary.discord.com/channels/732251741999071303/977731788002697326/1119643273695346820")).toEqual({
      guildID: "732251741999071303",
      channelID: "977731788002697326",
      messageID: "1119643273695346820"
    });
  });

  it("should correctly extract discord link", () => {
    expect(extractDiscordLink("https://discord.com/channels/732251741999071303/786216771723198514/803532192793493544")).toEqual({
      guildID: "732251741999071303",
      channelID: "786216771723198514",
      messageID: "803532192793493544"
    });
  });

  it("should return empty array when no discord link is found", () => {
    expect(extractDiscordLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toStrictEqual([]);
  });
});