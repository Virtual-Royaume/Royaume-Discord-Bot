import {
  ChannelType,
  ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandChannelOption,
  SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder
} from "discord.js";
import { msg } from "$core/utils/Message";
import { getChannelsByCategory } from "$core/api/func/MainChannel";
import { getRolesByCategory } from "$core/api/func/MainRole";
import { addChannel, removeChannel } from "$core/api/requests/MainChannel";
import { addRole, removeRole } from "$core/api/requests/MainRole";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { gqlRequest } from "$core/utils/request";

export default class Inactive extends Command {

  public readonly enabledInDev = true;

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-main-builder-name"))
    .setDescription(msg("cmd-main-builder-description"))
    .setDefaultMemberPermissions(0)
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName(msg("cmd-main-builder-add-name"))
      .setDescription(msg("cmd-main-builder-add-description"))
      .addStringOption(new SlashCommandStringOption()
        .setName(msg("cmd-main-builder-category-name"))
        .setDescription(msg("cmd-main-builder-category-description"))
        .setRequired(true))
      .addChannelOption(new SlashCommandChannelOption()
        .setName(msg("cmd-main-builder-channel-name"))
        .setDescription(msg("cmd-main-builder-channel-description"))
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
      .addChannelOption(new SlashCommandChannelOption()
        .setName(msg("cmd-main-builder-forum-name"))
        .setDescription(msg("cmd-main-builder-forum-description"))
        .addChannelTypes(ChannelType.GuildForum)
        .setRequired(false))
      .addRoleOption(new SlashCommandRoleOption()
        .setName(msg("cmd-main-builder-role-name"))
        .setDescription(msg("cmd-main-builder-role-description"))
        .setRequired(false)))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName(msg("cmd-main-builder-remove-name"))
      .setDescription(msg("cmd-main-builder-remove-description"))
      .addChannelOption(new SlashCommandChannelOption()
        .setName(msg("cmd-main-builder-channel-name"))
        .setDescription(msg("cmd-main-builder-channel-description"))
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
      .addChannelOption(new SlashCommandChannelOption()
        .setName(msg("cmd-main-builder-forum-name"))
        .setDescription(msg("cmd-main-builder-forum-description"))
        .addChannelTypes(ChannelType.GuildForum)
        .setRequired(false))
      .addRoleOption(new SlashCommandRoleOption()
        .setName(msg("cmd-main-builder-role-name"))
        .setDescription(msg("cmd-main-builder-role-description"))
        .setRequired(false)))
    .addSubcommand(new SlashCommandSubcommandBuilder()
      .setName(msg("cmd-main-builder-list-name"))
      .setDescription(msg("cmd-main-builder-list-description")));

  public async execute(command: ChatInputCommandInteraction): Promise<void> {
    // Get action, channel/role and category :
    const channel = command.options.getChannel(msg("cmd-main-builder-channel-name"))
      ?? command.options.getChannel(msg("cmd-main-builder-forum-name"));
    const role = command.options.getRole(msg("cmd-main-builder-role-name"));

    const category = command.options.getString(msg("cmd-main-builder-category-name"));

    // List action :
    if (command.options.getSubcommand() === "list") {
      // Get mains channels and roles :
      const channels = await getChannelsByCategory();
      const roles = await getRolesByCategory();

      // Format and send the lists :
      let channelMessage = "";
      let roleMessage = "";

      for (const [category, ids] of Object.entries(channels)) {
        channelMessage += msg("cmd-main-exec-channel-message", [category, ids.map(id => "<#" + id + ">").join(", ")]) + "\n\n";
      }

      for (const [category, ids] of Object.entries(roles)) {
        roleMessage += msg("cmd-main-exec-channel-message", [category, ids.map(id => "<@&" + id + ">").join(", ")]) + "\n\n";
      }

      command.reply({
        embeds: [
          simpleEmbed(channelMessage, "normal", msg("cmd-main-exec-channels-title")),
          simpleEmbed(roleMessage, "normal", msg("cmd-main-exec-roles-title"))
        ], ephemeral: true
      });
      return;
    }

    // Add and remove actions :
    type Result = {
      success?: boolean;
      action?: string;
      type?: "role" | "channel";
    }

    if (command.options.getSubcommand() === "add" && !category) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-main-exec-need-category"), "error")], ephemeral: true });
      return;
    }

    if (!channel && !role) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-main-exec-need-mention"), "error")], ephemeral: true });
      return;
    }

    const result: Result = { action: command.options.getSubcommand() };

    if (channel) {
      result.type = "channel";

      if (command.options.getSubcommand() === "add" && category) {
        const addChannelQuery = await gqlRequest(addChannel, { channelId: channel.id, category: category });

        if (!addChannelQuery.success) {
          command.reply({
            embeds: [simpleEmbed(msg("cmd-main-exec-channel-add-error"), "error")],
            ephemeral: true
          });

          return;
        }

      } else {
        const removeChannelQuery = await gqlRequest(removeChannel, { channelId: channel.id });

        if (!removeChannelQuery.success) {
          command.reply({
            embeds: [simpleEmbed(msg("cmd-main-exec-channel-remove-error"), "error")],
            ephemeral: true
          });

          return;
        }
      }

    } else if (role) {
      result.type = "role";

      if (command.options.getSubcommand() === "add" && category) {
        const addRoleQuery = await gqlRequest(addRole, { roleId: role.id, category: category });

        if (!addRoleQuery.success) {
          command.reply({
            embeds: [simpleEmbed(msg("cmd-main-exec-role-add-error"), "error")],
            ephemeral: true
          });

          return;
        }

      } else {
        const removeRoleQuery = await gqlRequest(removeRole, { roleId: role.id });

        if (!removeRoleQuery.success) {
          command.reply({
            embeds: [simpleEmbed(msg("cmd-main-exec-role-remove-error"), "error")],
            ephemeral: true
          });

          return;
        }
      }
    }

    const type = result.type === "role" ? "rôle" : "salon";

    command.reply({
      embeds: [simpleEmbed(msg("cmd-main-exec-success-add", [result.action === "add" ? "ajouté" : "supprimé", type]))],
      ephemeral: true
    });
  }

}