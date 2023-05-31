import type { CommandExecute } from "#/utils/handler/command";
import { generateActionRow } from "./role.util";
import { commands } from "#/configs/message/command";
import { simpleEmbed } from "#/utils/discord/embed";
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

  const actionRow = await generateActionRow(member, guild);

  if (!actionRow.ok) {
    void command.reply({ embeds: [simpleEmbed(commands.role.exec.apiError)] });
    return;
  }

  void command.reply({
    embeds: [simpleEmbed("", "normal", commands.role.exec.selectRole)],
    components: actionRow.value,
    ephemeral: true
  });
};