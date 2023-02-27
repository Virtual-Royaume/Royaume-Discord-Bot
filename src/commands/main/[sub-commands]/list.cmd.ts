import { getChannelsByCategory } from "$core/api/func/MainChannel";
import { getRolesByCategory } from "$core/api/func/MainRole";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";
import { CommandExecute } from "$core/utils/handler/command";

export const execute: CommandExecute = async(command) => {
  // Get mains channels and roles :
  const channels = await getChannelsByCategory();
  const roles = await getRolesByCategory();

  // Format and send the lists :
  let channelMessage = "";
  let roleMessage = "";

  for (const [category, ids] of Object.entries(channels)) {
    channelMessage += msg("cmd-main-exec-channel-message", [category, ids.map(id => "<#" + id + ">").join(", ")]) + "\n\n";
  }

  for (const [category, ids] of Object.entries(roles)) {
    roleMessage += msg("cmd-main-exec-channel-message", [category, ids.map(id => "<@&" + id + ">").join(", ")]) + "\n\n";
  }

  command.reply({
    embeds: [
      simpleEmbed(channelMessage, "normal", msg("cmd-main-exec-channels-title")),
      simpleEmbed(roleMessage, "normal", msg("cmd-main-exec-roles-title"))
    ], ephemeral: true
  });
  return;
};