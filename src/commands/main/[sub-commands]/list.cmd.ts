import type { CommandExecute } from "#/utils/handler/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { commands } from "#/configs/message/command";
import { msgParams } from "#/utils/message";
import { getChannelsByCategory } from "#/utils/api/channel/channel.util";
import { getRolesByCategory } from "#/utils/api/role/role.util";

export const execute: CommandExecute = async(command) => {
  // Get mains channels and roles:
  const channels = await getChannelsByCategory();
  const roles = await getRolesByCategory();

  if (!channels.ok || !roles.ok) {
    void command.reply({ embeds: [simpleEmbed(commands.main.exec.list.error)] });
    return;
  }

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