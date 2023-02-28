import { removeChannel } from "$core/api/requests/main-channel";
import { simpleEmbed } from "$core/utils/embed";
import { msgParams } from "$core/utils/message";
import { CommandExecute } from "$core/utils/handler/command";
import { gqlRequest } from "$core/utils/request";
import { commands } from "$resources/config/messages.json";

export const execute: CommandExecute = async(command) => {
  const channel = command.options.getChannel(commands.main.groups.remove.subcmds.channel.options.channel.name, true);
  const removeChannelQuery = await gqlRequest(removeChannel, { channelId: channel.id });

  if (!removeChannelQuery.success) {
    command.reply({
      embeds: [simpleEmbed(commands.main.exec.remove.channel.error, "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.remove.channel.succes, [channel.id]))],
    ephemeral: true
  });
};