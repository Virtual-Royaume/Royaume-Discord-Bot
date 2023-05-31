import type { CommandExecute } from "#/utils/handler/command";
import { getChannelsByCategory } from "#/api/func/main-channel";
import { getRolesByCategory } from "#/api/func/main-role";
import { simpleEmbed } from "#/utils/discord/embed";
import { commands } from "#/configs/message/command";
import { msgParams } from "#/utils/message";

export const execute: CommandExecute = async(command) => {
  // Get mains channels and roles:
  const channels = await getChannelsByCategory();
  const roles = await getRolesByCategory();

  // Format and send the lists:
  let channelMessage = "";
  let roleMessage = "";

  for (const [category, ids] of Object.entries(channels)) {
    channelMessage += msgParams(commands.main.exec.list.channels.channel, [category, ids.map(id => "<#" + id + ">").join(", ")]) + "\n\n";
  }

  for (const [category, ids] of Object.entries(roles)) {
    roleMessage += msgParams(commands.main.exec.list.roles.role, [category, ids.map(id => "<@&" + id + ">").join(", ")]) + "\n\n";
  }

  void command.reply({
    embeds: [
      simpleEmbed(channelMessage, "normal", commands.main.exec.list.channels.title),
      simpleEmbed(roleMessage, "normal", commands.main.exec.list.roles.title)
    ], ephemeral: true
  });
  return;
};