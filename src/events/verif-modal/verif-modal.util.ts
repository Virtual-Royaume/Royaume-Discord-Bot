import { interactionId } from "$core/configs";
import { events } from "$core/configs/message/event";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const presentationId = "presentation";

export const modal = new ModalBuilder()
  .setCustomId(interactionId.modal.verify)
  .setTitle(events.verifModal.modal.title)
  .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
    .setCustomId(presentationId)
    .setLabel(events.verifModal.modal.label)
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(50)));