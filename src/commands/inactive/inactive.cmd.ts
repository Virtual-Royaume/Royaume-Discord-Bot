import { getInactiveGuildMembers } from "$core/commands/inactive/inactive.util";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$resources/config/messages.json";

export const execute: CommandExecute = async(command) => {
  if (!command.member) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.notGuildMember, "error")],
      ephemeral: true
    });
    return;
  }

  const inactiveMembers = await getInactiveGuildMembers();

  if (!inactiveMembers) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.activityQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  if (!inactiveMembers.length) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.noInactiveMembers, "error")],
      ephemeral: true
    });
    return;
  }
};