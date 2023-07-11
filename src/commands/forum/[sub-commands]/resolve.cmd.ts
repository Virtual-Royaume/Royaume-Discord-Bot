import type { Message } from "discord.js";
import type { CommandExecute } from "#/utils/handler/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import { commands } from "#/configs/message/command";
import { ChannelType, ForumChannel } from "discord.js";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";
import { extractDiscordLink } from "#/utils/message/message.util";
import type { DiscordMessage } from "#/utils/message/message.type";

export const execute: CommandExecute = async(command) => {

  const channel = command.channel;

  if (channel?.type !== ChannelType.PublicThread || !(channel.parent instanceof ForumChannel)) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.channelNotPost, "error")],
      ephemeral: true
    });
    return;
  }

  const answerLink = command.options.getString(commands.forum.subcmds.resolve.options.answer.name, true);

  const message: DiscordMessage | null = extractDiscordLink(answerLink);

  if (!message) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.isntDiscordMessageLink, "error")],
      ephemeral: true
    });
    return;
  }

  if (message.guildID !== channel.guildId || message.channelID !== channel.id) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.badLocation, "error")],
      ephemeral: true
    });
    return;
  }

  let fetchedMessage: Message;

  try {
    fetchedMessage = await channel.messages.fetch(message.messageID);
  } catch (error) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.unknownMessage, "error")],
      ephemeral: true
    });
    return;
  }

  if (!fetchedMessage.pinnable) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.unpinnableMessage, "error")],
      ephemeral: true
    });
    return;
  }

  await fetchedMessage.pin();
  await command.reply({
    embeds: [simpleEmbed(msgParams(commands.forum.exec.resolve.succes, [answerLink]))]
  });

  logger.info(`Forum: ${userWithId(command.user)} resolved ${channel.name} with ${answerLink}`);
  void channel.setArchived(true, "resolved");
};