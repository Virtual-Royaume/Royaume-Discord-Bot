import { describe, expect, it } from "vitest";
import { getMessageFromLink } from "#/utils/message";
import { Message } from "discord.js";

describe("isDiscordLink function", () => {
  it("should return instance of Message", async() => {
    const message = await getMessageFromLink("https://discord.com/channels/732251741999071303/786216771723198514/803532192793493544");
    expect(message).toBeInstanceOf(Message);
  });

  it("should return instance of Message with PTB link", async() => {
    const message = await getMessageFromLink("https://ptb.discord.com/channels/732251741999071303/786216771723198514/803532192793493544");
    expect(message).toBeInstanceOf(Message);
  });

  it("should return instance of Message with Canary link", async() => {
    const message = await getMessageFromLink("https://canary.discord.com/channels/732251741999071303/786216771723198514/803532192793493544");
    expect(message).toBeInstanceOf(Message);
  });

  it("should return null when the link is not a discord link", async() => {
    const message = await getMessageFromLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(message).toBe(null);
  });
});