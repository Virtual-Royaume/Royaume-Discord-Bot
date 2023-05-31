import { commands } from "#/configs/message/command";
import type { SlashCommandDefition } from "#/utils/handler/command";
import type { GuildsCommand } from "#/utils/handler/command/command.type";
import { SlashCommandBuilder } from "discord.js";

export const guilds: GuildsCommand = ["pro"];

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.role.name)
  .setDescription(commands.role.description);