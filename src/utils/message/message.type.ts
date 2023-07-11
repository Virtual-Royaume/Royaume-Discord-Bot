import type { Snowflake } from "discord.js";

export const discordLinkRegex = /http(s?):\/\/(www\.|canary\.|ptb\.)?discord.com\/channels(\/\d*){3}/gi;

export type DiscordMessage = {
  guildID: Snowflake;
  channelID: Snowflake;
  messageID: Snowflake;
}