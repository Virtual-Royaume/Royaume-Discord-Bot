import { commands } from "$core/configs/message/command";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.stats.name)
  .setDescription(commands.stats.description)
  .addNumberOption(numberOption => numberOption
    .setName(commands.stats.options.history.name)
    .setDescription(commands.stats.options.history.description)
    .setMinValue(5))
  .addBooleanOption(booleanOption => booleanOption
    .setName(commands.stats.options.darkMode.name)
    .setDescription(commands.stats.options.darkMode.description));