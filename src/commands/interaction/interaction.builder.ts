import type { SlashCommandDefition } from "#/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "#/configs/message/command";
import type { GuildsCommand } from "#/utils/handler/command/command.type";

export const guilds: GuildsCommand = ["pro"];

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.interaction.name)
  .setDescription(commands.interaction.description)

  // Verif interaction
  .addSubcommand(subCommand => subCommand
    .setName(commands.interaction.subcmds.verif.name)
    .setDescription(commands.interaction.subcmds.verif.description));