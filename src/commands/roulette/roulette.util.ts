import { choicesInputId, titleInputId } from "./roulette.const";
import { interactionId } from "#/configs/global";
import { commands } from "#/configs/message/command";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

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