import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$resources/config/messages.json";
import { EnableInDev } from "$core/utils/handler";

export const enableInDev: EnableInDev = true;

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.forum.name)
  .setDescription(commands.forum.descirption)

  // why
  .addSubcommand(subCommand => subCommand
    .setName(commands.forum.subcmds.why.name)
    .setDescription(commands.forum.subcmds.why.descirption))

  // rename
  .addSubcommand(subCommand => subCommand
    .setName(commands.forum.subcmds.rename.name)
    .setDescription(commands.forum.subcmds.rename.descirption)
    .addStringOption(stringOption => stringOption
      .setName(commands.forum.subcmds.rename.options.name.name)
      .setDescription(commands.forum.subcmds.rename.options.name.descirption)
      .setMaxLength(100)
      .setRequired(true)))

  // resolve
  .addSubcommand(subCommand => subCommand
    .setName(commands.forum.subcmds.resolve.name)
    .setDescription(commands.forum.subcmds.resolve.descirption)
    .addStringOption(stringOption => stringOption
      .setName(commands.forum.subcmds.resolve.options.answer.name)
      .setDescription(commands.forum.subcmds.resolve.options.answer.descirption)
      .setRequired(true)));