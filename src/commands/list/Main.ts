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
    const channel = command.options.getChannel(msg("cmd-main-builder-channel-name"));
    const forum = command.options.getChannel(msg("cmd-main-builder-forum-name"));
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

        if (!channel && !role && !forum) {
          command.reply({ embeds: [simpleEmbed(msg("cmd-main-exec-need-mention"), "error")], ephemeral: true });
          return;
        }

        const result: Result = { action: command.options.getSubcommand() };

        if (channel) {
          result.type = "channel";
          result.success = command.options.getSubcommand() === "add" && category
            ? (await gqlRequest(addChannel, { channelId: channel.id, category: category })).data?.addChannel
            : (await gqlRequest(removeChannel, { channelId: channel.id })).data?.removeChannel;
        } else if (forum) {
          result.type = "channel";
          result.success = command.options.getSubcommand() === "add" && category
            ? (await gqlRequest(addChannel, { channelId: forum.id, category: category })).data?.addChannel
            : (await gqlRequest(removeChannel, { channelId: forum.id })).data?.removeChannel;
        } else if (role) {
          result.type = "role";
          result.success = command.options.getSubcommand() === "add" && category
            ? (await gqlRequest(addRole, { roleId: role.id, category: category })).data?.addRole
            : (await gqlRequest(removeRole, { roleId: role.id })).data?.removeRole;
        }

        const type = result.type === "role" ? "rôle" : "salon";
        const message = result.success
          ? msg("cmd-main-exec-success-add", [result.action === "add" ? "ajouté" : "supprimé", type])
          : msg("cmd-main-exec-success-error", [result.action === "add" ? "l'ajout" : "la suppression", type]);

        command.reply({ embeds: [simpleEmbed(message, result.success ? "normal" : "error")], ephemeral: true });
  }
}