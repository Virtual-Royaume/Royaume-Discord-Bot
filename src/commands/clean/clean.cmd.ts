import { simpleEmbed } from "#/utils/discord/embed";
import type { CommandExecute } from "#/utils/handler/command";
import { logger } from "#/utils/logger";
import { msgParams } from "#/utils/message";
import { commands } from "#/configs/message/command";
import { ChannelType } from "discord.js";
import { userWithId } from "#/utils/discord/user";

export const execute: CommandExecute = async(command) => {
  const number = command.options.getNumber(commands.clean.options.count.name) ?? 10;

  if (command.channel?.type !== ChannelType.GuildText) {
    void command.reply({
      embeds: [simpleEmbed(commands.clean.exec.needTextChannel, "error")],
      ephemeral: true
    });
    return;
  }

  try {
    await command.channel.bulkDelete(number);
    void command.reply({
      embeds: [simpleEmbed(msgParams(commands.clean.exec.succes, [number]))],
      ephemeral: true
    });

    logger.info(`${userWithId(command.user)} bulk deleted ${number} messages in ${command.channel.name}`);
  } catch (e) {
    logger.error(`Error while bulk deleting in a channel : ${String(e)}`);
  }
};