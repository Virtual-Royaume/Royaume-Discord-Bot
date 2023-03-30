import { choicesInputId, titleInputId } from "$core/commands/roulette/roulette.const";
import { interactionId } from "$core/configs";
import { events } from "$core/configs/message/event";
import { simpleEmbed } from "$core/utils/embed";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { msgParams } from "$core/utils/message";

export const event: EventName = "interactionCreate";

export const execute: EventExecute<"interactionCreate"> = (interaction) => {
  if (!interaction.isModalSubmit() || interaction.customId !== interactionId.modal.roulette) return;

  const title = interaction.fields.getTextInputValue(titleInputId);
  const choices = interaction.fields.getTextInputValue(choicesInputId).split("\n").map(choice => choice.trim()).filter(choice => choice.length > 0);
  const choice = choices[Math.floor(Math.random() * choices.length)];

  interaction.reply({
    embeds: [simpleEmbed(
      msgParams(events.roulette.succes, [
        choices.map(c => `\`${c}\``).join(", "),
        choice
      ]),
      "normal",
      title.length < 1 ? undefined : title
    )]
  });
};