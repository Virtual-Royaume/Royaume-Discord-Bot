import { candidatBtn } from "./verif.util";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$core/configs/message/command";
import { ChannelType } from "discord.js";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

export const execute: CommandExecute = async(command) => {
  const channel = command.channel;
  const interactionType = command.options.getString(commands.interaction.subcmds.verif.name, true);

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

  await command.reply({
    embeds: [simpleEmbed(commands.interaction.exec.verif.succes)],
    ephemeral: true
  });

  logger.info(`${userWithId(command.user)} created the ${interactionType} interaction in the ${command.channelId} channel`);
};