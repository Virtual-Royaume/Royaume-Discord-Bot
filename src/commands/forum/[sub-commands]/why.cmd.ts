import { simpleEmbed } from "$core/utils/embed";
import type { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$core/configs/message/command";

export const execute: CommandExecute = (command) => {
  void command.reply({
    embeds: [simpleEmbed(commands.forum.exec.why.message)]
  });
};