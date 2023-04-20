import type { CommandExecute } from "$core/utils/handler/command";
import { modal } from "./roulette.util";

export const execute: CommandExecute = (command) => {
  void command.showModal(modal);
};