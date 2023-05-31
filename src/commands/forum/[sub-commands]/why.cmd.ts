import { simpleEmbed } from "#/utils/discord/embed";
import type { CommandExecute } from "#/utils/handler/command";
import { commands } from "#/configs/message/command";
import { msgParams } from "#/utils/message";

export const execute: CommandExecute = (command) => {
  const user = command.options.getUser(commands.forum.subcmds.why.options.user.name, false);

  void command.reply({
    content: user ? msgParams(commands.forum.exec.why.user, [user.id]) : undefined,
    embeds: [simpleEmbed(msgParams(commands.forum.exec.why.message, [command.channelId]))]
  });
};