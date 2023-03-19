import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { interactionId } from "$core/configs/global.config";
import { commands } from "$core/configs/message/command";

export const candidatBtn = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()
  .setCustomId(interactionId.button.verify)
  .setLabel(commands.interaction.exec.button.label)
  .setStyle(ButtonStyle.Primary)
  .setEmoji(commands.interaction.exec.button.emoji));