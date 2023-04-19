import { commands } from "$core/configs/message/command";
import type { SlashCommandDefition } from "$core/utils/handler/command";
import type { GuildsCommand } from "$core/utils/handler/command/command.type";
import { SlashCommandBuilder } from "discord.js";

export const guilds: GuildsCommand = ["pro"];

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.role.name)
  .setDescription(commands.role.description);