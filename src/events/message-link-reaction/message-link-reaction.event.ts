import { client } from "$core/client";
import { events } from "$core/configs/message/event";
import { messageUrlRegex } from "./message-link-reaction.const";
import { simpleEmbed } from "$core/utils/embed";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { BaseGuildTextChannel, EmbedBuilder, Message } from "discord.js";

export const event: EventName = "messageCreate";

export const execute: EventExecute<"messageCreate"> = async(message) => {
  if (message.author.bot && !(message.channel instanceof BaseGuildTextChannel)) return;

  const urls = message.content.match(messageUrlRegex);

  if (!urls) return;

  // Get messages :
  type MessageElement = {
    url: string;
    message: Message;
  }

  const messages: MessageElement[] = [];

  for (const url of urls) {
    const ids = [...url.matchAll(/(\/\d+)/g)];

    if (!ids.length) return;

    // Get channel and message instances :
    let messageQuoted: Message;

    try {
      const guildQuoted = await client.guilds.fetch(ids[0][0]);
      const channelQuoted = await guildQuoted.channels.fetch(ids[1][0]);

      if (!channelQuoted || !channelQuoted.isTextBased()) throw new Error("Channel not found");

      messageQuoted = await channelQuoted.messages.fetch(ids[2][0]);
    } catch (e) {
      logger.error(`Error while getting message: ${e}`);
      return;
    }

    messages.push({ url, message: messageQuoted });
  }

  // Send link reaction messages :
  const embeds: EmbedBuilder[] = [];

  for (const index in messages) {
    const url = messages[index].url;
    const message = messages[index].message;

    const attachment = message.attachments.size ? msgParams(events.messageLinkReaction.attachment, [message.attachments.size]) : "";
    const content = message.content ? message.content + (attachment.length ? `\n\n${attachment}` : "") : attachment;

    embeds.push(
      simpleEmbed(msgParams(events.messageLinkReaction.embed.content, [Number(index) + 1, url, message.channelId, content]), "normal")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL()
        })
    );
  }

  message.reply({ embeds, allowedMentions: { repliedUser: false } });
};