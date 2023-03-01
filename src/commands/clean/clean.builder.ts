import { EnableInDev } from "$core/utils/handler";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$resources/config/messages.json";

export const enableInDev: EnableInDev = true;

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.clean.name)
  .setDescription(commands.clean.description)
  .addNumberOption(numberOption => numberOption
    .setName(commands.clean.options.count.name)
    .setDescription(commands.clean.options.count.description)
    .setMinValue(1)
    .setMaxValue(100));