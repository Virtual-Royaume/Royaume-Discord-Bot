import { EnableInDev } from "$core/utils/handler";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { ChannelType, SlashCommandBuilder } from "discord.js";
import { commands } from "$resources/config/messages.json";

export const enableInDev: EnableInDev = true;

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.main.name)
  .setDescription(commands.main.description)
  .setDefaultMemberPermissions(0)

  // SubCommandsGroup - add
  .addSubcommandGroup(subCommandGroup => subCommandGroup
    .setName(commands.main.groups.add.name)
    .setDescription(commands.main.groups.add.description)

    // textChannel/forum
    .addSubcommand(subCommand => subCommand
      .setName(commands.main.groups.add.subcmds.channel.name)
      .setDescription(commands.main.groups.add.subcmds.channel.description)
      .addChannelOption(channelOption => channelOption
        .setName(commands.main.groups.add.subcmds.channel.options.channel.name)
        .setDescription(commands.main.groups.add.subcmds.channel.options.channel.description)
        .addChannelTypes(ChannelType.GuildForum, ChannelType.GuildText)
        .setRequired(true))
      .addStringOption(stringOption => stringOption
        .setName(commands.main.groups.add.subcmds.channel.options.category.name)
        .setDescription(commands.main.groups.add.subcmds.channel.options.category.description)
        .setRequired(true)))

    // role
    .addSubcommand(subCommand => subCommand
      .setName(commands.main.groups.add.subcmds.role.name)
      .setDescription(commands.main.groups.add.subcmds.role.description)
      .addRoleOption(roleOption => roleOption
        .setName(commands.main.groups.add.subcmds.role.options.role.name)
        .setDescription(commands.main.groups.add.subcmds.role.options.role.description)
        .setRequired(true))
      .addStringOption(stringOption => stringOption
        .setName(commands.main.groups.add.subcmds.role.options.category.name)
        .setDescription(commands.main.groups.add.subcmds.role.options.category.name)
        .setRequired(true))))

  // SubCommandGroup - remove
  .addSubcommandGroup(subCommandGroup => subCommandGroup
    .setName(commands.main.groups.remove.name)
    .setDescription(commands.main.groups.remove.description)

  // textChannel/forum
    .addSubcommand(subCommand => subCommand
      .setName(commands.main.groups.remove.subcmds.channel.name)
      .setDescription(commands.main.groups.remove.subcmds.channel.description)
      .addChannelOption(channelOption => channelOption
        .setName(commands.main.groups.remove.subcmds.channel.options.channel.name)
        .setDescription(commands.main.groups.remove.subcmds.channel.options.channel.description)
        .addChannelTypes(ChannelType.GuildForum, ChannelType.GuildText)
        .setRequired(true)))

    // role
    .addSubcommand(subCommand => subCommand
      .setName(commands.main.groups.remove.subcmds.role.name)
      .setDescription(commands.main.groups.remove.subcmds.role.description)
      .addRoleOption(roleOption => roleOption
        .setName(commands.main.groups.remove.subcmds.role.options.role.name)
        .setDescription(commands.main.groups.remove.subcmds.role.options.role.description)
        .setRequired(true))))

  // SubCommands
  .addSubcommand(subCommand => subCommand
    .setName(commands.main.subcmds.list.name)
    .setDescription(commands.main.subcmds.list.description));