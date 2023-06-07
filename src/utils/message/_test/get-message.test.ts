import { describe, expect, it } from "vitest";
import { getMessageContentFromLink } from "#/utils/message";

describe("isDiscordLink function", () => {
  it("should return the text from discord link", async() => {
    expect(await getMessageContentFromLink(
      "https://discord.com/channels/732251741999071303/732392873667854372/1116134183648116787"
    )).toBe("Bottly > ChatGPT");
  });

  it("should return the text from discord canary link", async() => {
    expect(await getMessageContentFromLink(
      "https://canary.discord.com/channels/732251741999071303/732392873667854372/1116128755258249338"
    )).toBe("ahahahahahh");
  });

  it("should return the text from discord ptb link", async() => {
    expect(await getMessageContentFromLink(
      "https://ptb.discord.com/channels/732251741999071303/732392873667854372/1116003681414959324"
    )).toBe("Il en est ou le site du Royaume ?");
  });

  it("should return undefined if link is invalid", async() => {
    expect(await getMessageContentFromLink(
      "https://discord.com/channels/732251741999071303/975780913013227630/1116120913306468384/1116120913306468384"
    )).toBe(undefined);
  });
});