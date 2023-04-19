import { commands } from "$core/configs/message/command";
import type { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.member.name)
  .setDescription(commands.member.description)
  .addUserOption(userOption => userOption
    .setName(commands.member.options.member.name)
    .setDescription(commands.member.options.member.description));