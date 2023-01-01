import { BaseGuildTextChannel, ChannelType, ForumChannel, Message as Msg, TextBasedChannel } from "discord.js";
import { getChannels } from "$core/api/requests/MainChannel";
import { incChannelMessage } from "$core/api/requests/Member";
import { generalChannel } from "$resources/config/information.json";
import Event, { EventName } from "$core/events/Event";
import Client from "$core/Client";
import { simpleEmbed } from "$core/utils/Embed";
import { numberFormat } from "$core/utils/Function";
import { msg } from "$core/utils/Message";
import { gqlRequest } from "$core/utils/request";
import { isDevEnvironment } from "$core/utils/Environment";

export default class MessageCreate extends Event {

  public name: EventName = "messageCreate";

  public async execute(message: Msg): Promise<void> {
    if (isDevEnvironment) return;
    if (message.author.bot) return;

    // Get channel or parent channel (if is a thread channel) :
    let channel: TextBasedChannel | ForumChannel | null = message.channel;

    if (
      channel.type === ChannelType.PublicThread
            || channel.type === ChannelType.PrivateThread
            || channel.type === ChannelType.AnnouncementThread
    ) {
      channel = channel.parent;
    }

    if (channel) {
      const channels = (await gqlRequest(getChannels)).data?.channels;

      if (!channels) return;

      if (channels.find(c => c.channelId === channel?.id)) {
        let channelId: string = channel.id;

        if (channel.type === ChannelType.GuildForum) channelId = "732392873667854372";

        const messageCount = (await gqlRequest(
          incChannelMessage,
          { id: message.author.id, channelId: channelId }
        )).data?.incMemberDiscordActivityChannel;

        if (!messageCount) return;

        // Send an announcement when the member reaches a message count step :
        let step = false;

        if (messageCount < 10_000) {
          if (messageCount !== 0 && messageCount % 1_000 === 0) step = true;
        } else if (messageCount % 10_000 === 0) step = true;

        if (step) {
          const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

          if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

          generalChannelInstance.send({
            embeds: [simpleEmbed(
              msg("event-messagecreate-exec-message-cap-reached", [message.author.id, numberFormat(messageCount)])
            )]
          });
        }
      }
    }
  }

}