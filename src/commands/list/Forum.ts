import {
  ChannelType,
  ChatInputCommandInteraction, ForumChannel, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder
} from "discord.js";
import { msg } from "$core/utils/Message";
import Command from "$core/commands/Command";
import { simpleEmbed } from "$core/utils/Embed";
import Logger from "$core/utils/Logger";

export default class Forum extends Command {

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-forum-builder-name"))
    .setDescription(msg("cmd-forum-builder-description"))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName(msg("cmd-forum-builder-why-name"))
      .setDescription(msg("cmd-forum-builder-why-description")))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName(msg("cmd-forum-builder-rename-name"))
      .setDescription(msg("cmd-forum-builder-rename-description"))
      .addStringOption(new SlashCommandStringOption()
        .setName(msg("cmd-forum-builder-rename-new-name"))
        .setDescription(msg("cmd-forum-builder-rename-new-description"))))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName(msg("cmd-forum-builder-resolve-name"))
      .setDescription(msg("cmd-forum-builder-resolve-description"))
      .addStringOption(new SlashCommandStringOption()
        .setName(msg("cmd-forum-builder-resolve-link-name"))
        .setDescription(msg("cmd-forum-builder-resolve-link-description"))
        .setRequired(true)));

  public async execute(command: ChatInputCommandInteraction) : Promise<void> {
    switch (command.options.getSubcommand()) {
      case msg("cmd-forum-builder-why-name"): {
        await command.reply({
          embeds: [simpleEmbed(msg("cmd-forum-exec-why-embed-description"), "normal", msg("cmd-forum-exec-why-embed-title"))]
        });
        break;
      }

      case msg("cmd-forum-builder-rename-name") : {
        if (command.channel?.type == ChannelType.PublicThread) {
          const parentChannel = command.channel.parent;
          if (parentChannel instanceof ForumChannel) {
            const channel = command.channel;

            const oldName = channel.name;
            const newName = command.options.getString(msg("cmd-forum-builder-rename-new-name")) ?? oldName;

            try {
              channel.setName(newName);
              await command.reply({
                embeds: [simpleEmbed(msg("cmd-forum-exec-rename-success", [newName]), "normal")],
                ephemeral: true
              });
            } catch (e) {
              Logger.error(`Error while renaming post channel "${oldName}" to "${newName}" : ${e}`);
              await command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-rename-error"), "error")], ephemeral: true });
            }
            return;
          }
        }

        await command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-rename-only-posts"), "error")], ephemeral: true });
        return;
      }

      case msg("cmd-forum-builder-resolve-name") : {
        if (!command.options.getString(msg("cmd-forum-builder-resolve-link-name"))) {
          await command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-resolve-missing-link"), "error")] });
          return;
        }

        if (command.channel?.type == ChannelType.PublicThread) {
          const parentChannel = command.channel.parent;
          if (parentChannel instanceof ForumChannel) {
            const channel = command.channel;

            const link = command.options.getString(msg("cmd-forum-builder-resolve-link-name"), true);

            await command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-resolve-success", [link]), "normal")] }).then(() => {
              try {
                channel.setArchived(true);
              } catch (e) {
                command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-resolve-error"), "error")], ephemeral: true });
              }
              channel.setArchived(true);
            });
            return;
          }
        }

        await command.reply({ embeds: [simpleEmbed(msg("cmd-forum-exec-resolve-only-posts"), "error")], ephemeral: true });
        return;
      }
    }
  }

}