import type { GuildType } from "$core/configs/guild";
import type { MaybePromise } from "$core/utils/typing/promise";
import type { ChatInputCommandInteraction, Collection, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type GuildsCommand = GuildType[];

export type SlashCommandDefition = SlashCommandSubcommandsOnlyBuilder |
  Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;

export type CommandExecute = (command: ChatInputCommandInteraction) => MaybePromise<void>;

export type LoadedCommands = {
  commands: CommandsCollection;
  guildCommands: GuildCommandsCollection;
  builders: CommandsBuilderCollection;
}

export type CommandsCollection = Collection<string, CommandExecute>;
export type GuildCommandsCollection = Collection<GuildType, string[]>;
export type CommandsBuilderCollection = Collection<string, SlashCommandDefition>;