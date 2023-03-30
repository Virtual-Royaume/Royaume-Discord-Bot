import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$core/configs/message/command";
import { GuildType } from "$core/configs/guild";

export const guild: GuildType = "pro";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.interaction.name)
  .setDescription(commands.interaction.description)

  // Verif interaction
  .addSubcommand(subCommand => subCommand
    .setName(commands.interaction.subcmds.verif.name)
    .setDescription(commands.interaction.subcmds.verif.description));