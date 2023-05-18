import type { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$core/configs/message/command";
import type { GuildsCommand } from "$core/utils/handler/command/command.type";

export const guilds: GuildsCommand = ["pro"];

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.forum.name)
  .setDescription(commands.forum.description)

  // why
  .addSubcommand(subCommand => subCommand
    .setName(commands.forum.subcmds.why.name)
    .setDescription(commands.forum.subcmds.why.description)
    .addUserOption(userOption => userOption
      .setName(commands.forum.subcmds.why.options.user.name)
      .setDescription(commands.forum.subcmds.why.options.user.description)))

  // rename
  .addSubcommand(subCommand => subCommand
    .setName(commands.forum.subcmds.rename.name)
    .setDescription(commands.forum.subcmds.rename.description)
    .addStringOption(stringOption => stringOption
      .setName(commands.forum.subcmds.rename.options.name.name)
      .setDescription(commands.forum.subcmds.rename.options.name.description)
      .setMaxLength(100)
      .setRequired(true)))

  // resolve
  .addSubcommand(subCommand => subCommand
    .setName(commands.forum.subcmds.resolve.name)
    .setDescription(commands.forum.subcmds.resolve.description)
    .addStringOption(stringOption => stringOption
      .setName(commands.forum.subcmds.resolve.options.answer.name)
      .setDescription(commands.forum.subcmds.resolve.options.answer.description)
      .setRequired(true)));