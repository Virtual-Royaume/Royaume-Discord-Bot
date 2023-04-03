import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$core/configs/message/command";

export const execute: CommandExecute = (command) => {
  command.reply({
    embeds: [simpleEmbed(commands.forum.exec.why.message)]
  });
};