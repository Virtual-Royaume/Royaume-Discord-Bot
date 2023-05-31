import { commands } from "#/configs/message/command";
import type { SlashCommandDefition } from "#/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.roulette.name)
  .setDescription(commands.roulette.description);