import {
  ChannelType,
  ChatInputCommandInteraction, ForumChannel, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder
} from "discord.js";
import { msg } from "$core/utils/Message";
import Command from "$core/commands/Command";
import { simpleEmbed } from "$core/utils/Embed";
import Logger from "$core/utils/Logger";

export default class Forum extends Command {

  public readonly slashCommand = new SlashCommandBuilder()
    .setName("forum")
    .setDescription("Commande pour accompagner l'utilisation des salons forum")
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("why")
      .setDescription("Pourquoi utiliser les salons forum ?")
      .addBooleanOption(new SlashCommandBooleanOption()
        .setName("ephemeral")
        .setDescription("Si le message n'est vu que par vous ou par tout le monde")))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("rename")
      .setDescription("Renommer un post")
      .addStringOption(new SlashCommandStringOption()
        .setName("nom")
        .setDescription("PocketMine - Système de niveau")))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName("resolve")
      .setDescription("Indiquer que le problème est résolu avec le lien du message de résolution")
      .addStringOption(new SlashCommandStringOption()
        .setName("link")
        .setDescription("Lien du message de résolution")));

  public async execute(command: ChatInputCommandInteraction) : Promise<void> {
    console.log(command.options.getSubcommand());
    switch (command.options.getSubcommand()) {
      case "why": {
        await command.reply({
          content: msg("cmd-forum-exec-why-message"),
          ephemeral: command.options.getBoolean("ephemeral") ?? true
        });
        break;
      }
      case "rename": {
        if (command.channel?.type == ChannelType.PublicThread) {
          const parentChannel = command.channel.parent;
          if (parentChannel instanceof ForumChannel) {
            // const channel = command.channel;

            // const oldName = channel.name;
            // const newName = command.options.getString("nom");

            // try {
            // await channel.setName(newName);
            // await command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-rename-success", { oldName, newName }), "success")] });
            // } catch (e) {
            //   Logger.error(`Error while renaming post channel "${oldName}" to "${newName}" : ${e}`);
            // }
            return;
          }
        }

        await command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-rename-only-posts"), "error")] });
        return;
      }
    }
  }

}