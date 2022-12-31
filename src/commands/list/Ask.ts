import { msg } from "$core/utils/Message";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandNumberOption, SlashCommandStringOption } from "discord.js";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import Client from "$core/Client";

export default class Ask extends Command {

  public readonly slashCommand = new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Poser une question")
    .setDefaultMemberPermissions(0)
    .addStringOption(new SlashCommandStringOption()
      .setName("question")
      .setDescription("Quel est le président de la France ?")
      .setRequired(true))
    .addIntegerOption(new SlashCommandIntegerOption()
      .setName("max_tokens")
      .setDescription("Nombre de caractères maximum"));

  public async execute(command: ChatInputCommandInteraction) : Promise<void> {
    command.deferReply();
    let rep = "";

    const response = await Client.OpenAI.createCompletion({
      model: "text-davinci-003",
      prompt: command.options.getString("question"),
      max_tokens: command.options.getInteger("max_tokens") ?? 150,
      temperature: 0.9
    });

    rep = response.data.choices[0].text ?? "Je n'ai pas compris votre question";
    console.log(rep);

    // Remove defear and send message :
    command.editReply({
      embeds: [simpleEmbed("Question: **" + command.options.getString("question") + "**" + rep, "normal", "ChatGPT")]
    });
  }

}