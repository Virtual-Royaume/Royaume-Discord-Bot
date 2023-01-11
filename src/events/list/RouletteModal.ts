import Event, { EventName } from "$core/events/Event";
import {
  Interaction
} from "discord.js";
import { modal as modalIds } from "$resources/config/interaction-ids.json";
import Roulette from "$core/commands/list/Roulette";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";

export default class RouletteModal extends Event {

  public readonly enabledInDev = true;

  public name: EventName = "interactionCreate";

  public async execute(interaction: Interaction): Promise<void> {
    if (!interaction.isModalSubmit() || interaction.customId !== modalIds.roulette) return;

    const title = interaction.fields.getTextInputValue(Roulette.titleInputId);
    const choices = interaction.fields.getTextInputValue(Roulette.choicesInputId).split("\n").map(c => c.trim()).filter(c => c.length > 0);
    const choice = choices[Math.floor(Math.random() * choices.length)];

    interaction.reply({
      embeds: [simpleEmbed(
        msg("event-roulettemodal-exec-embed", [
          choices.map(c => `\`${c}\``).join(", "),
          choice
        ]),
        "normal",
        title.length < 1 ? undefined : title
      )]
    });
  }

}