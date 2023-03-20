import { interactionId } from "$core/configs";
import { commands } from "$core/configs/message/command";
import { ActionRowBuilder } from "@discordjs/builders";
import { ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const titleInputId = "title";

export const choicesInputId = "choices";

export const modal = new ModalBuilder()
  .setCustomId(interactionId.modal.roulette)
  .setTitle(commands.roulette.exec.modal.name)
  .addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
      .setCustomId(titleInputId)
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setLabel(commands.roulette.exec.modal.title.label)
      .setPlaceholder(commands.roulette.exec.modal.title.placeholder)),
    new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
      .setCustomId(choicesInputId)
      .setStyle(TextInputStyle.Paragraph)
      .setLabel(commands.roulette.exec.modal.choices.label)
      .setPlaceholder(commands.roulette.exec.modal.choices.placeholder))
  );