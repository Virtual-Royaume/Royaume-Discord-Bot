import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { commands } from "$core/configs/message/command";
import { ChannelType, ForumChannel, Message } from "discord.js";
import { logger } from "$core/utils/logger";

export const execute: CommandExecute = async(command) => {
  const channel = command.channel;

  if (channel?.type !== ChannelType.PublicThread || !(channel.parent instanceof ForumChannel)) {
    command.reply({
      embeds: [simpleEmbed(commands.forum.exec.channelNotPost, "error")],
      ephemeral: true
    });
    return;
  }

  const answerLink = command.options.getString(commands.forum.subcmds.resolve.options.answer.name, true);

  if (!answerLink.match(/^http(s?):\/\/(www\.)?discord.com\/channels(\/\d*){3}$/gi)) {
    command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.isntDiscordMessageLink, "error")],
      ephemeral: true
    });
    return;
  }

  const ids = [...answerLink.match(/(\d+)/g) ?? []];

  if (ids[0] !== channel.guildId || ids[1] !== channel.id) {
    command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.badLocation, "error")],
      ephemeral: true
    });
    return;
  }

  let message: Message<true>;

  try {
    message = await channel.messages.fetch(ids[2]);
  } catch (error) {
    command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.unknownMessage, "error")],
      ephemeral: true
    });
    return;
  }

  if (!message.pinnable) {
    command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.unpinnableMessage, "error")],
      ephemeral: true
    });
    return;
  }

  await message.pin();
  await command.reply({
    embeds: [simpleEmbed(msgParams(commands.forum.exec.resolve.succes, [answerLink]))]
  });

  logger.info(`Forum: ${command.user.tag} resolved ${channel.name} with ${answerLink}`);
  channel.setArchived(true, "resolved");
};