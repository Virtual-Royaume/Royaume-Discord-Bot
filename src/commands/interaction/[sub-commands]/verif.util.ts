import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { interactionId } from "#/configs/global";
import { commands } from "#/configs/message/command";

export const candidatBtn = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()
  .setCustomId(interactionId.button.verify)
  .setLabel(commands.interaction.exec.verif.button.label)
  .setStyle(ButtonStyle.Primary)
  .setEmoji(commands.interaction.exec.verif.button.emoji));