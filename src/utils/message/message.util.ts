import type { Message } from "discord.js";
import type { DiscordMessage } from "./message.type";
import { client } from "#/client";
import { messageUrlRegex } from "#/events/message-link-reaction/message-link-reaction.const";

export const msgParams = (message: string, params: (string | number)[]): string => {
  const words = message.match(/{[^}]+}/g);

  if (words) for (let i = 0; i < params.length; i++) {
    message = message.replace(words[i], String(params[i]));
  }

  return message;
};

export const extractDiscordLink = (content: string): DiscordMessage | [] => {
  if (!content.match(messageUrlRegex)) return [];
  const [guildID, channelID, messageID] = [...content.match(/(\d+)/g) ?? []];
  if (!guildID || !channelID || !messageID) return [];

  return {
    guildID,
    channelID,
    messageID
  };
};

export const getMessageFromLink = async(link: string): Promise<Message<true> | null> => {
  const ids = [...link.match(/(\d+)/g) ?? []];

  if (ids.length !== 3) return null;

  const guildId = ids[0];
  const channelId = ids[1];
  const messageId = ids[2];

  const guild = await client.guilds.fetch(guildId);
  if (!guild) return null;

  const channel = await guild.channels.fetch(channelId);
  if (!channel || !channel.isTextBased()) return null;

  const message = await channel.messages.fetch(messageId);
  if (!message) return null;

  return message;
};