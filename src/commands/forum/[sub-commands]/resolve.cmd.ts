import type { Message } from "discord.js";
import type { CommandExecute } from "$core/utils/handler/command";
import { simpleEmbed } from "$core/utils/embed";
import { msgParams } from "$core/utils/message";
import { commands } from "$core/configs/message/command";
import { ChannelType, ForumChannel } from "discord.js";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";
import { trustDiscordLinks } from "../forum.const";

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

  if (!answerLink.match(trustDiscordLinks)) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.isntDiscordMessageLink, "error")],
      ephemeral: true
    });
    return;
  }

  const ids = [...answerLink.match(/(\d+)/g) ?? []];

  if (ids[0] !== channel.guildId || ids[1] !== channel.id) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.badLocation, "error")],
      ephemeral: true
    });
    return;
  }

  let message: Message<true>;

  try {
    message = await channel.messages.fetch(ids[2]);
  } catch (error) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.unknownMessage, "error")],
      ephemeral: true
    });
    return;
  }

  if (!message.pinnable) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.resolve.unpinnableMessage, "error")],
      ephemeral: true
    });
    return;
  }

  await message.pin();
  await command.reply({
    embeds: [simpleEmbed(msgParams(commands.forum.exec.resolve.succes, [answerLink]))]
  });

  logger.info(`Forum: ${userWithId(command.user)} resolved ${channel.name} with ${answerLink}`);
  void channel.setArchived(true, "resolved");
};