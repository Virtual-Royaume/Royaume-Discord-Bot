import { modal } from "./roulette.util";
import { CommandExecute } from "$core/utils/handler/command";

export const execute: CommandExecute = (command) => {
  command.showModal(modal);
};