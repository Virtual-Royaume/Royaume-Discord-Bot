import { describe, expect, it } from "vitest";
import { getMessageFromLink } from "#/utils/message";
import { Message } from "discord.js";

describe("isDiscordLink function", () => {
  it("should return instance of Message", async() => {
    const message = await getMessageFromLink("https://discord.com/channels/732251741999071303/786216771723198514/803532192793493544");
    expect(message).toBeInstanceOf(Message);
  });
});