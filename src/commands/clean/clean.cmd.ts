import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { commands } from "$core/configs/message/command";
import { ChannelType } from "discord.js";

export const execute: CommandExecute = async(command) => {
  const number = command.options.getNumber(commands.clean.options.count.name) ?? 10;

  if (command.channel?.type !== ChannelType.GuildText) {
    command.reply({
      embeds: [simpleEmbed(commands.clean.exec.needTextChannel, "error")],
      ephemeral: true
    });
    return;
  }

  try {
    await command.channel.bulkDelete(number);
    command.reply({
      embeds: [simpleEmbed(msgParams(commands.clean.exec.succes, [number]))],
      ephemeral: true
    });
  } catch (e) {
    logger.error(`Error while bulk deleting in a channel : ${e}`);
  }
};