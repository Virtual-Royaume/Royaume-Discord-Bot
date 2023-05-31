import { interactionId } from "#/configs/global";
import { events } from "#/configs/message/event";
import { presentationId } from "./verif-modal.const";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const modal = new ModalBuilder()
  .setCustomId(interactionId.modal.verify)
  .setTitle(events.verifModal.modal.title)
  .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
    .setCustomId(presentationId)
    .setLabel(events.verifModal.modal.label)
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(50)));