import { GuildType } from "$core/configs/guild";
import { ChatInputCommandInteraction, Collection, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type SlashCommandDefition = SlashCommandSubcommandsOnlyBuilder |
  Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;

export type CommandExecute = (command: ChatInputCommandInteraction) => void;

export type LoadedCommands = {
  commands: CommandsCollection;
  guildCommands: GuildCommandsCollection;
  builders: CommandsBuilderCollection;
}

export type CommandsCollection = Collection<string, CommandExecute>;
export type GuildCommandsCollection = Collection<GuildType, string[]>;
export type CommandsBuilderCollection = Collection<string, SlashCommandDefition>;