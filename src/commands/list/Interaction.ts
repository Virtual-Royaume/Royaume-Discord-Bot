import {
  ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder,
  ButtonStyle, SlashCommandBuilder, SlashCommandStringOption
} from "discord.js";
import { button } from "$resources/config/interaction-ids.json";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { msg } from "$core/utils/Message";

type InteractionType = "verif";

type InteractionChoices = {
    name: string;
    value: InteractionType;
}

export default class Interaction extends Command {

  private actionChoices: InteractionChoices[] = [
    { name: "Vérification", value: "verif" }
  ];

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-interaction-builder-name"))
    .setDescription(msg("cmd-interaction-builder-description"))
    .addStringOption(new SlashCommandStringOption()
      .setName(msg("cmd-interaction-builder-name-name"))
      .setDescription(msg("cmd-interaction-builder-name-description"))
      .addChoices(...this.actionChoices)
      .setRequired(true));

  public async execute(command: ChatInputCommandInteraction): Promise<void> {
    const interaction: InteractionType = <InteractionType>command.options.getString(msg("cmd-interaction-builder-name-name"), true);

    switch (interaction) {
      case "verif": {
        const embed = simpleEmbed(
          msg("cmd-interaction-exec-verif-embed-content"),
          "normal",
          msg("cmd-interaction-exec-verif-embed-title")
        );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()
          .setCustomId(button.verify)
          .setLabel(msg("cmd-interaction-exec-verif-button-label"))
          .setStyle(ButtonStyle.Primary)
          .setEmoji(msg("cmd-interaction-exec-verif-button-emoji")));

        await command.channel?.send({
          embeds: [embed],
          components: [row]
        });
        break;
      }
    }

    command.reply({ embeds: [simpleEmbed(msg("cmd-interaction-exec-verif-succes-embed"))], ephemeral: true });
  }

}