import type { EventExecute, EventName } from "#/utils/handler/event";
import type { EmbedBuilder, Message } from "discord.js";
import { client } from "#/client";
import { events } from "#/configs/message/event";
import { messageUrlRegex } from "./message-link-reaction.const";
import { simpleEmbed } from "#/utils/discord/embed";
import { logger } from "#/utils/logger";
import { msgParams } from "#/utils/message";
import { BaseGuildTextChannel } from "discord.js";

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

    const guildQuoted = await client.guilds.fetch(ids[0][0]);
    const channelQuoted = await guildQuoted.channels.fetch(ids[1][0]);

    if (!channelQuoted || !channelQuoted.isTextBased()) {
      logger.error("Error while getting message: channel not found");
      return;
    }

    const messageQuoted = await channelQuoted.messages.fetch(ids[2][0]);

    messages.push({ url, message: messageQuoted });
  }

  // Send link reaction messages :
  const embeds: EmbedBuilder[] = [];

  for (const [index, msg] of Object.entries(messages)) {
    const url = msg.url;
    const message = msg.message;

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

  void message.reply({ embeds, allowedMentions: { repliedUser: false } });
  logger.info(`Message link reaction sent for message ${message.id}`);
};