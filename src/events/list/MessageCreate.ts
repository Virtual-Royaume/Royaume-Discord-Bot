import { ChannelType, ForumChannel, GuildTextBasedChannel, Message as Msg, Snowflake, TextBasedChannel } from "discord.js";
import { getChannels } from "$core/api/requests/MainChannel";
import { incChannelMessage } from "$core/api/requests/Member";
import { generalChannel } from "$resources/config/information.json";
import { simpleEmbed } from "$core/utils/Embed";
import { numberFormat } from "$core/utils/Function";
import { msg } from "$core/utils/Message";
import { gqlRequest } from "$core/utils/request";
import Logger from "$core/utils/Logger";
import Client from "$core/client";
import Event, { EventName } from "$core/events/Event";

export default class MessageCreate extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "messageCreate";

  public async execute(message: Msg): Promise<void> {
    if (message.author.bot) return;

    // Get channel where the message is sent :
    let channel: GuildTextBasedChannel | TextBasedChannel | ForumChannel = message.channel;

    // If the channel is a thread, get the parent channel :
    if (channel.type === ChannelType.PublicThread && channel.parent) channel = channel.parent;

    // If the channel is a forum, set the dev channel (HACK) :
    if (channel.type === ChannelType.GuildForum) {
      const devChannel = await (await Client.instance.getGuild()).channels.fetch("732392873667854372");

      if (devChannel && devChannel.type === ChannelType.GuildText) channel = devChannel;
    }

    // Check is the channel exist in mains channels :
    const channels = await gqlRequest(getChannels);

    if (!channels.success || !channels.data.channels.find(c => c.channelId === channel.id)) return;

    // Increment channel message count and get current message count :
    const messageCountResponse = await gqlRequest(incChannelMessage, { id: message.author.id, channelId: channel.id });

    if (!messageCountResponse.success) {
      Logger.error(`Increment message count does work for member ${message.author.id} in channel ${channel.id}`);
      return;
    }

    const messageCount = messageCountResponse.data.incMemberDiscordActivityChannel;

    if (messageCount === 0) return;

    // Send an announcement when the member reaches a message count step :
    if (messageCount < 10_000) if (messageCount % 1_000 === 0) this.sendStepEmbed(message.author.id, messageCount);
    if (messageCount % 10_000 === 0) this.sendStepEmbed(message.author.id, messageCount);
  }

  private async sendStepEmbed(memberId: Snowflake, messageCount: number): Promise<void> {
    const guild = await Client.instance.getGuild();
    const channel = await guild.channels.fetch(generalChannel);

    if (channel?.type !== ChannelType.GuildText) {
      Logger.error("Unable to fetch the general channel");
      return;
    }

    const embed = simpleEmbed(msg("event-messagecreate-exec-message-cap-reached", [memberId, numberFormat(messageCount)]));

    channel.send({ embeds: [embed] });
  }

}