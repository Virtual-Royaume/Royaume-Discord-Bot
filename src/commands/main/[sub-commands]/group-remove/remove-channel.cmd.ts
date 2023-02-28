import { removeChannel } from "$core/api/requests/main-channel";
import { simpleEmbed } from "$core/utils/embed";
import { msg } from "$core/utils/message";
import { CommandExecute } from "$core/utils/handler/command";
import { gqlRequest } from "$core/utils/request";

export const execute: CommandExecute = async(command) => {
  const channel = command.options.getChannel(msg("cmd-main-builder-group-remove-channel-channel-name"), true);
  const removeChannelQuery = await gqlRequest(removeChannel, { channelId: channel.id });

  if (!removeChannelQuery.success) {
    command.reply({
      embeds: [simpleEmbed(msg("cmd-main-exec-remove-channel-error"), "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msg("cmd-main-exec-remove-channel-succes", [channel.id]))],
    ephemeral: true
  });
};