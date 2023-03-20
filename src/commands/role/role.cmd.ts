import { generateActionRow } from "$core/commands/role/role.util";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { GuildMember } from "discord.js";

export const execute: CommandExecute = async(command) => {
  const member = command.member;
  const guild = command.guild;

  if (!(member instanceof GuildMember) || !guild) {
    command.reply({
      embeds: [simpleEmbed(commands.role.exec.notInGuild, "error")],
      ephemeral: true
    });
    return;
  }

  // Send the interaction :
  command.reply({
    embeds: [simpleEmbed("", "normal", commands.role.exec.selectRole)],
    components: await generateActionRow(member, guild),
    ephemeral: true
  });
};