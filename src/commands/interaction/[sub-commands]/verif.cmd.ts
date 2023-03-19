import { candidatBtn } from "$core/commands/interaction/[sub-commands]/verif.util";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$core/configs/message/command";
import { ChannelType } from "discord.js";

export const execute: CommandExecute = async(command) => {
  const channel = command.channel;

  if (channel?.type !== ChannelType.GuildText) {
    command.reply({
      embeds: [simpleEmbed(commands.interaction.exec.verif.notGuildText, "error")],
      ephemeral: true
    });
    return;
  }

  await channel.send({
    embeds: [simpleEmbed(
      commands.interaction.exec.verif.embed.content,
      "normal",
      commands.interaction.exec.verif.embed.title
    )],
    components: [candidatBtn]
  });
};