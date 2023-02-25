import { CommandExecute } from "$core/utils/command";

export const execute: CommandExecute = (command): void => {
  command.reply("role-set command");
};