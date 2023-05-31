import type { CommandExecute } from "#/utils/handler/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { commands } from "#/configs/message/command";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";
import { addChannel } from "./add-channel.gql";

export const execute: CommandExecute = async(command) => {
  const channel = command.options.getChannel(commands.main.groups.add.subcmds.channel.options.channel.name, true);
  const category = command.options.getString(commands.main.groups.add.subcmds.channel.options.category.name, true);
  const addChannelQuery = await gqlRequest(addChannel, { channelId: channel.id, category: category });

  if (!addChannelQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.main.exec.add.channel.error, "error")],
      ephemeral: true
    });

    return;
  }

  void command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.add.channel.succes, [channel.id, category]))],
    ephemeral: true
  });

  logger.info(`Channel ${channel.id} added to category ${category} by ${userWithId(command.user)}`);
};