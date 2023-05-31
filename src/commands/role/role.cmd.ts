import { generateActionRow } from "./role.util";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/discord/embed";
import type { CommandExecute } from "$core/utils/handler/command";
import { GuildMember } from "discord.js";

export const execute: CommandExecute = async(command) => {
  const member = command.member;
  const guild = command.guild;

  if (!(member instanceof GuildMember) || !guild) {
    void command.reply({
      embeds: [simpleEmbed(commands.role.exec.notInGuild, "error")],
      ephemeral: true
    });
    return;
  }

  // Send the interaction :
  void command.reply({
    embeds: [simpleEmbed("", "normal", commands.role.exec.selectRole)],
    components: await generateActionRow(member, guild),
    ephemeral: true
  });
};