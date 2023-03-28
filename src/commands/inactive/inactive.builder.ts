import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$core/configs/message/command";
import { GuildType } from "$core/configs/guild";
import { EnableInDev } from "$core/utils/handler";

export const enableInDev: EnableInDev = true;

export const guild: GuildType = "pro";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.inactive.name)
  .setDescription(commands.inactive.description)
  .addIntegerOption(integerOption => integerOption
    .setName(commands.inactive.options.page.name)
    .setDescription(commands.inactive.options.page.description)
    .setMinValue(1));