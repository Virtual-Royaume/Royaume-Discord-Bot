import { EnableInDev } from "$core/utils/handler";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$resources/config/messages.json";

export const enableInDev: EnableInDev = true;

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.birthday.name)
  .setDescription(commands.birthday.description)

  // SubCommand - set
  .addSubcommand(subCommand => subCommand
    .setName(commands.birthday.subcmds.set.name)
    .setDescription(commands.birthday.subcmds.set.description)
    .addStringOption(stringOption => stringOption
      .setName(commands.birthday.subcmds.set.options.date.name)
      .setDescription(commands.birthday.subcmds.set.options.date.description)
      .setRequired(true)))

  // SubCommand - list
  .addSubcommand(subCommand => subCommand
    .setName(commands.birthday.subcmds.list.name)
    .setDescription(commands.birthday.subcmds.list.description)
    .addNumberOption(numberOption => numberOption
      .setName(commands.birthday.subcmds.list.options.page.name)
      .setDescription(commands.birthday.subcmds.list.options.page.description)
      .setMinValue(1)))

  // SubCommand - next
  .addSubcommand(subCommand => subCommand
    .setName(commands.birthday.subcmds.next.name)
    .setDescription(commands.birthday.subcmds.next.description));