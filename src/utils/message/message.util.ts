import { client } from "#/client";
import { StageChannel, ThreadChannel } from "discord.js";
import { TextChannel } from "discord.js";
import { ForumChannel } from "discord.js";
import { VoiceChannel } from "discord.js";
import { NewsChannel } from "discord.js";

export const msgParams = (message: string, params: (string | number)[]): string => {
  const words = message.match(/\{[^}]+\}/g);

  if (words) for (let i = 0; i < params.length; i++) {
    message = message.replace(words[i], String(params[i]));
  }

  return message;
};

export const isDiscordLink = (link: string): boolean => {
  return link.match(/^http(s?):\/\/(www\.|canary\.|ptb\.)?discord.com\/channels(\/\d*){3}$/gi) !== null;
};

export const getMessageContentFromLink = async(link: string): Promise<string | undefined> => {
  if (!isDiscordLink(link)) return undefined;

  const [_, __, ___, ____, guildId, channelId, messageId] = link.split("/");

  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);

    if (channel instanceof StageChannel
      || channel instanceof NewsChannel
      || channel instanceof TextChannel
      || channel instanceof VoiceChannel
      || channel instanceof ForumChannel
      || channel instanceof ThreadChannel
    ) {
      const message = await channel.messages.fetch(messageId);
      return message.content;
    }
  } catch (error) {
    console.error(error);
  }

  return undefined;
};