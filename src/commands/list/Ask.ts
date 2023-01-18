import { msg } from "$core/utils/Message";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { chatWithAI } from "$core/utils/OpenAPI";

export default class Ask extends Command {

  public readonly enabledInDev = true;

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-ask-builder-name"))
    .setDescription(msg("cmd-ask-builder-description"))
    .addStringOption(new SlashCommandStringOption()
      .setName(msg("cmd-ask-builder-args-question-name"))
      .setDescription(msg("cmd-ask-builder-args-question-description"))
      .setRequired(true));

  public async execute(command: ChatInputCommandInteraction) : Promise<void> {
    command.deferReply();
    let rep = msg("cmd-ask-exec-loading");
    const question = command.options.getString("question", true);

    rep = await chatWithAI(question);
    command.editReply({
      embeds: [simpleEmbed(msg("cmd-ask-exec-embed-line", [question, rep]), "normal", msg("cmd-ask-exec-embed-title"))]
    });
  }

}