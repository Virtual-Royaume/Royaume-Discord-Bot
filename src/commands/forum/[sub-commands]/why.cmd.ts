import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { multiLineMsg } from "$core/utils/message";
import { commands } from "$resources/config/messages.json";

export const execute: CommandExecute = (command) => {
  command.reply({
    embeds: [simpleEmbed(multiLineMsg(commands.forum.exec.why.message))]
  });
};