import type { SlashCommandDefition } from "#/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "#/configs/message/command";
import type { GuildsCommand } from "#/utils/handler/command/command.type";

export const guilds: GuildsCommand = ["pro"];

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.inactive.name)
  .setDescription(commands.inactive.description)
  .addIntegerOption(integerOption => integerOption
    .setName(commands.inactive.options.page.name)
    .setDescription(commands.inactive.options.page.description)
    .setMinValue(1));