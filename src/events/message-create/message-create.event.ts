import type { EventExecute, EventName } from "$core/utils/handler/event";
import type { ForumChannel, GuildTextBasedChannel, TextBasedChannel } from "discord.js";
import { getChannels } from "$core/api/requests/main-channel";
import { incChannelMessage } from "$core/api/requests/member";
import { guilds } from "$core/configs/guild";
import { events } from "$core/configs/message/event";
import { simpleEmbed } from "$core/utils/embed";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request/graphql/code-gen";
import { userWithId } from "$core/utils/user";
import { ChannelType } from "discord.js";

export const event: EventName = "messageCreate";

export const execute: EventExecute<"messageCreate"> = async(message) => {
  if (message.guild?.id !== guilds.pro.guildId) return;
  if (message.author.bot) return;

  // Get channel where the message is sent :
  let channel: GuildTextBasedChannel | TextBasedChannel | ForumChannel = message.channel;

  // If the channel is a thread, get the parent channel :
  if (channel.type === ChannelType.PublicThread && channel.parent) channel = channel.parent;

  const guild = message.guild;
  // If the channel is a forum, set the dev channel (HACK) :
  if (channel.type === ChannelType.GuildForum) {
    const devChannel = await guild.channels.fetch("732392873667854372");

    if (devChannel && devChannel.type === ChannelType.GuildText) channel = devChannel;
  }

  // Check is the channel exist in mains channels :
  const channels = await gqlRequest(getChannels);

  if (!channels.success || !channels.data.channels.find(c => c.channelId === channel.id)) return;

  // Increment channel message count and get current message count :
  const messageCountResponse = await gqlRequest(incChannelMessage, { id: message.author.id, channelId: channel.id });

  if (!messageCountResponse.success) {
    logger.error(`Increment message count does work for member ${message.author.id} in channel ${channel.id}`);
    return;
  }

  const messageCount = messageCountResponse.data.incMemberDiscordActivityChannel;

  if (messageCount === 0) return;

  const generalChannel = await guild.channels.fetch(guilds.pro.channels.general);

  if (generalChannel?.type !== ChannelType.GuildText) {
    logger.error("Unable to fetch the general channel");
    return;
  }

  // Send an announcement when the member reaches a message count step :
  if (messageCount < 10_000 && messageCount % 1_000 === 0) {
    void generalChannel.send({ embeds: [simpleEmbed(msgParams(events.messageCreate.stepMessage, [message.author.id, messageCount]))] });
    logger.info(`Member ${userWithId(message.author)} reached ${messageCount} messages in the server`);
  }

  if (messageCount % 10_000 === 0) {
    void generalChannel.send({ embeds: [simpleEmbed(msgParams(events.messageCreate.stepMessage, [message.author.id, messageCount]))] });
    logger.info(`Member ${userWithId(message.author)} reached ${messageCount} messages in the server`);
  }
};