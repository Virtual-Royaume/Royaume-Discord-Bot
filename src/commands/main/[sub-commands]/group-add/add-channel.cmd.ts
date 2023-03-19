import { addChannel } from "$core/api/requests/main-channel";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { commands } from "$resources/config/messages.json";

export const execute: CommandExecute = async(command) => {
  const channel = command.options.getChannel(commands.main.groups.add.subcmds.channel.options.channel.name, true);
  const category = command.options.getString(commands.main.groups.add.subcmds.channel.options.category.name, true);
  const addChannelQuery = await gqlRequest(addChannel, { channelId: channel.id, category: category });

  if (!addChannelQuery.success) {
    command.reply({
      embeds: [simpleEmbed(commands.main.exec.add.channel.error, "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.add.channel.succes, [channel.id, category]))],
    ephemeral: true
  });
};