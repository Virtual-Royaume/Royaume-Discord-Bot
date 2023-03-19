import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$core/configs/message/command";
import { EnableInDev } from "$core/utils/handler";
import { GuildType } from "$core/configs/guild";

export const enableInDev: EnableInDev = true;

export const guild: GuildType = "pro";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.forum.name)
  .setDescription(commands.forum.description)

  // why
  .addSubcommand(subCommand => subCommand
    .setName(commands.forum.subcmds.why.name)
    .setDescription(commands.forum.subcmds.why.description))

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