import { modal } from "./roulette.util";
import type { CommandExecute } from "$core/utils/handler/command";

export const execute: CommandExecute = (command) => {
  command.showModal(modal);
};