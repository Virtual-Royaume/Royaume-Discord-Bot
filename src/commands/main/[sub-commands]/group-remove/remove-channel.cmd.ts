import { removeChannel } from "#/api/requests/main-channel";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import type { CommandExecute } from "#/utils/handler/command";
import { gqlRequest } from "#/utils/request";
import { commands } from "#/configs/message/command";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";

export const execute: CommandExecute = async(command) => {
  const channel = command.options.getChannel(commands.main.groups.remove.subcmds.channel.options.channel.name, true);
  const removeChannelQuery = await gqlRequest(removeChannel, { channelId: channel.id });

  if (!removeChannelQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.main.exec.remove.channel.error, "error")],
      ephemeral: true
    });

    return;
  }

  void command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.remove.channel.succes, [channel.id]))],
    ephemeral: true
  });

  logger.info(`Channel ${channel.id} removed by ${userWithId(command.user)}`);
};