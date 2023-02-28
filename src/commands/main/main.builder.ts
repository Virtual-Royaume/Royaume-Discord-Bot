import { msg } from "$core/utils/Message";
import { EnableInDev } from "$core/utils/handler";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { ChannelType, SlashCommandBuilder } from "discord.js";

export const enableInDev: EnableInDev = true;

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(msg("cmd-main-builder-name"))
  .setDescription(msg("cmd-main-builder-description"))
  .setDefaultMemberPermissions(0)

  // SubCommandsGroup - add
  .addSubcommandGroup(subCommandGroup => subCommandGroup
    .setName(msg("cmd-main-builder-group-add-name"))
    .setDescription(msg("cmd-main-builder-group-add-description"))

    // textChannel/forum
    .addSubcommand(subCommand => subCommand
      .setName(msg("cmd-main-builder-group-add-channel-name"))
      .setDescription(msg("cmd-main-builder-group-add-channel-description"))
      .addChannelOption(channelOption => channelOption
        .setName(msg("cmd-main-builder-group-add-channel-channel-name"))
        .setDescription(msg("cmd-main-builder-group-add-channel-channel-description"))
        .addChannelTypes(ChannelType.GuildForum, ChannelType.GuildText)
        .setRequired(true))
      .addStringOption(stringOption => stringOption
        .setName(msg("cmd-main-builder-group-add-channel-category-name"))
        .setDescription(msg("cmd-main-builder-group-add-channel-category-description"))
        .setRequired(true)))

    // role
    .addSubcommand(subCommand => subCommand
      .setName(msg("cmd-main-builder-group-add-role-name"))
      .setDescription(msg("cmd-main-builder-group-add-role-description"))
      .addRoleOption(roleOption => roleOption
        .setName(msg("cmd-main-builder-group-add-role-role-name"))
        .setDescription(msg("cmd-main-builder-group-add-role-role-description"))
        .setRequired(true))
      .addStringOption(stringOption => stringOption
        .setName(msg("cmd-main-builder-group-add-role-category-name"))
        .setDescription(msg("cmd-main-builder-group-add-role-category-description"))
        .setRequired(true))))

  // SubCommandGroup - remove
  .addSubcommandGroup(subCommandGroup => subCommandGroup
    .setName(msg("cmd-main-builder-group-remove-name"))
    .setDescription(msg("cmd-main-builder-group-remove-description"))

  // textChannel/forum
    .addSubcommand(subCommand => subCommand
      .setName(msg("cmd-main-builder-group-remove-channel-name"))
      .setDescription(msg("cmd-main-builder-group-remove-channel-description"))
      .addChannelOption(channelOption => channelOption
        .setName(msg("cmd-main-builder-group-remove-channel-channel-name"))
        .setDescription(msg("cmd-main-builder-group-remove-channel-channel-description"))
        .addChannelTypes(ChannelType.GuildForum, ChannelType.GuildText)
        .setRequired(true)))

    // role
    .addSubcommand(subCommand => subCommand
      .setName(msg("cmd-main-builder-group-remove-role-name"))
      .setDescription(msg("cmd-main-builder-group-remove-role-description"))
      .addRoleOption(roleOption => roleOption
        .setName(msg("cmd-main-builder-group-remove-role-role-name"))
        .setDescription(msg("cmd-main-builder-group-remove-role-role-description"))
        .setRequired(true))))

  // SubCommands
  .addSubcommand(subCommand => subCommand
    .setName(msg("cmd-main-builder-list-name"))
    .setDescription(msg("cmd-main-builder-list-description")));