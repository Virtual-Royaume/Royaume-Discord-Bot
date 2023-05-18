import { simpleEmbed } from "$core/utils/embed";
import type { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$core/configs/message/command";
import { msgParams } from "$core/utils/message";

export const execute: CommandExecute = (command) => {
  let user = command.options.getUser(commands.forum.subcmds.why.options.user.name, false);
  if (!user) user = command.user;

  void command.reply({
    content: user !== command.user ? msgParams(commands.forum.exec.why.user, [user.id]) : undefined,
    embeds: [simpleEmbed(msgParams(commands.forum.exec.why.message, [command.channelId]))]
  });
};