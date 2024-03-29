import { simpleEmbed } from "#/utils/discord/embed";
import type { CommandExecute } from "#/utils/handler/command";
import { logger } from "#/utils/logger";
import { msgParams } from "#/utils/message";
import { commands } from "#/configs/message/command";
import { ChannelType, ForumChannel } from "discord.js";

export const execute: CommandExecute = async(command) => {
  const channel = command.channel;

  if (channel?.type !== ChannelType.PublicThread || !(channel.parent instanceof ForumChannel)) {
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.channelNotPost, "error")],
      ephemeral: true
    });
    return;
  }

  const name = command.options.getString(commands.forum.subcmds.rename.options.name.name, true);

  try {
    await channel.setName(name);
    void command.reply({
      embeds: [simpleEmbed(msgParams(commands.forum.exec.rename.succes, [name]))],
      ephemeral: true
    });

    logger.info(`Post channel "${channel.name}" renamed to "${name}"`);
  } catch (e) {
    logger.error(`Error while renaming post channel "${channel.name}" to "${name}" : ${String(e)}`);
    void command.reply({
      embeds: [simpleEmbed(commands.forum.exec.rename.error, "error")],
      ephemeral: true
    });
  }
};