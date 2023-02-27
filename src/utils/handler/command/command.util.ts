import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { SlashCommandDefition } from "./command.type";
import { existsSync, statSync } from "fs";

export const haveSubcommands = (slashCommandBuilder: SlashCommandDefition): slashCommandBuilder is SlashCommandSubcommandsOnlyBuilder => {
  const subCommand =  slashCommandBuilder.options.find(option => {
    return option instanceof SlashCommandSubcommandBuilder || option instanceof SlashCommandSubcommandGroupBuilder;
  });

  return subCommand ? true : false;
};

export const isFolderExist = (path: string): boolean => {
  return existsSync(path) && statSync(path).isDirectory();
};

export const serializeCommandName = (commandName: string, subCommand?: string, subCommandGroup?: string): string => {
  let command = commandName;

  if (subCommandGroup) command += `.${subCommandGroup}`;
  if (subCommand) command += `.${subCommand}`;

  return command;
};