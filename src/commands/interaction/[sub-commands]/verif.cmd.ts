import { candidatBtn } from "./verif.util";
import { simpleEmbed } from "#/utils/discord/embed";
import type { CommandExecute } from "#/utils/handler/command";
import { commands } from "#/configs/message/command";
import { ChannelType } from "discord.js";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";

export const execute: CommandExecute = async(command) => {
  const channel = command.channel;
  const interactionType = command.options.getString(commands.interaction.subcmds.verif.name, true);

  if (channel?.type !== ChannelType.GuildText) {
    void command.reply({
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