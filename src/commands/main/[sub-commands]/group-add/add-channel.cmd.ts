import { addChannel } from "$core/api/requests/main-channel";
import { simpleEmbed } from "$core/utils/embed";
import { msg } from "$core/utils/message";
import { CommandExecute } from "$core/utils/handler/command";
import { gqlRequest } from "$core/utils/request";

export const execute: CommandExecute = async(command) => {
  const channel = command.options.getChannel(msg("cmd-main-builder-group-add-channel-channel-name"), true);
  const category = command.options.getString(msg("cmd-main-builder-group-add-channel-category-name"), true);
  const addChannelQuery = await gqlRequest(addChannel, { channelId: channel.id, category: category });

  if (!addChannelQuery.success) {
    command.reply({
      embeds: [simpleEmbed(msg("cmd-main-exec-add-channel-error"), "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msg("cmd-main-exec-add-channel-succes", [channel.id, category]))],
    ephemeral: true
  });
};