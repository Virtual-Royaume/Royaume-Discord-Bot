import type { SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import type { SlashCommandDefition } from "./command.type";

export const haveSubcommands = (slashCommandBuilder: SlashCommandDefition): slashCommandBuilder is SlashCommandSubcommandsOnlyBuilder => {
  const subCommand =  slashCommandBuilder.options.find(option => {
    return option instanceof SlashCommandSubcommandBuilder || option instanceof SlashCommandSubcommandGroupBuilder;
  });

  return subCommand ? true : false;
};

export const serializeCommandName = (commandName: string, subCommand?: string, subCommandGroup?: string): string => {
  let command = commandName;

  if (subCommandGroup) command += `.${subCommandGroup}`;
  if (subCommand) command += `.${subCommand}`;

  return command;
};