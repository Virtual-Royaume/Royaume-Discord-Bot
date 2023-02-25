import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type CommandEnabledInDev = boolean;

export type SlashCommandDefition = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder |
  Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;

export type CommandExecute = (command: ChatInputCommandInteraction) => void;