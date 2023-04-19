import { commands } from "$core/configs/message/command";
import type { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.topVoice.name)
  .setDescription(commands.topVoice.description)

// Total
  .addSubcommand(subCommand => subCommand
    .setName(commands.topVoice.subcmds.total.name)
    .setDescription(commands.topVoice.subcmds.total.description)
    .addNumberOption(numberOption => numberOption
      .setName(commands.topVoice.subcmds.total.options.page.name)
      .setDescription(commands.topVoice.subcmds.total.options.page.description)
      .setMinValue(1)))

  // Month
  .addSubcommand(subCommand => subCommand
    .setName(commands.topVoice.subcmds.month.name)
    .setDescription(commands.topVoice.subcmds.month.description)
    .addNumberOption(numberOption => numberOption
      .setName(commands.topVoice.subcmds.month.options.page.name)
      .setDescription(commands.topVoice.subcmds.month.options.page.description)
      .setMinValue(1)));