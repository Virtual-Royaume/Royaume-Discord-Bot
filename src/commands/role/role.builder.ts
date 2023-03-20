import { GuildType } from "$core/configs/guild";
import { commands } from "$core/configs/message/command";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";

export const guild: GuildType = "pro";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.role.name)
  .setDescription(commands.role.description);