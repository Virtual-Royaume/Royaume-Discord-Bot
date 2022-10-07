import {
    ChatInputCommandInteraction, ActionRowBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import { msg } from "$core/utils/Message";
import Command from "$core/commands/Command";
import { modal as modalIds } from "$resources/config/interaction-ids.json";

export default class Roulette extends Command {

    public static titleInputId = "title";

    public static choicesInputId = "choices";

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-roulette-builder-name"))
        .setDescription(msg("cmd-roulette-builder-description"));

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        const modal = new ModalBuilder()
            .setCustomId(modalIds.roulette)
            .setTitle(msg("cmd-roulette-exec-modal-title"))
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
                    .setCustomId(Roulette.titleInputId)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                    .setLabel(msg("cmd-roulette-exec-modal-input-title-label"))
                    .setPlaceholder(msg("cmd-roulette-exec-modal-input-title-placeholder"))),
                new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
                    .setCustomId(Roulette.choicesInputId)
                    .setStyle(TextInputStyle.Paragraph)
                    .setLabel(msg("cmd-roulette-exec-modal-input-choices-label"))
                    .setPlaceholder(msg("cmd-roulette-exec-modal-input-choices-placeholder")))
            );

        await command.showModal(modal);
    }
}