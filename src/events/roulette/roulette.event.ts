import type { EventExecute, EventName } from "#/utils/handler/event";
import { choicesInputId, titleInputId } from "#/commands/roulette/roulette.const";
import { interactionId } from "#/configs/global";
import { events } from "#/configs/message/event";
import { simpleEmbed } from "#/utils/discord/embed";
import { logger } from "#/utils/logger";
import { msgParams } from "#/utils/message";

export const event: EventName = "interactionCreate";

export const execute: EventExecute<"interactionCreate"> = (interaction) => {
  if (!interaction.isModalSubmit() || interaction.customId !== interactionId.modal.roulette) return;

  const title = interaction.fields.getTextInputValue(titleInputId);
  const choices = interaction.fields.getTextInputValue(choicesInputId).split("\n").map(choice => choice.trim()).filter(choice => choice.length > 0);
  const choice = choices[Math.floor(Math.random() * choices.length)];

  void interaction.reply({
    embeds: [simpleEmbed(
      msgParams(events.roulette.succes, [
        choices.map(c => `\`${c}\``).join(", "),
        choice
      ]),
      "normal",
      title.length < 1 ? undefined : title
    )]
  });

  logger.info(`${interaction.user.username} rolled a roulette with ${choices.length} choices (${choices.map(c => `\`${c}\``).join(", ")})`);
};