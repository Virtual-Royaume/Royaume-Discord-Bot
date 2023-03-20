import { commands } from "$core/configs/message/command";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.roulette.name)
  .setDescription(commands.roulette.description);