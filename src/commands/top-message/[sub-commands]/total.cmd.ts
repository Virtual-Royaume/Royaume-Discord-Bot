import type { CommandExecute } from "$core/utils/handler/command";
import type { MembersData } from "../top-message.type";
import { getTotalMessageCount } from "$core/api/requests/member";
import { memberPerPage } from "../top-message.const";
import { formatPage, getPage } from "../top-message.util";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

export const execute: CommandExecute = async(command) => {
  let members: MembersData[] = [];
  const membersMessagesCountQuery = await gqlRequest(getTotalMessageCount);

  if (!membersMessagesCountQuery.success) {
    void command.reply({
      embeds: [
        simpleEmbed(commands.topMessage.exec.activityQueryError, "error")
      ],
      ephemeral: true
    });
    return;
  }

  // Sort members & change format (QueryType => MembersData)
  members = membersMessagesCountQuery.data.members.sort((a, b) => {
    return (b?.activity.messages.totalCount ?? 0) - (a?.activity.messages.totalCount ?? 0);
  }).map(member => {
    return {
      username: member.username,
      messageCount: member.activity.messages.totalCount
    };
  }) ?? [];

  const page = getPage(members, memberPerPage, command.options.getNumber(commands.topMessage.subcmds.total.options.page.name) ?? 1);
  const message = formatPage(page, memberPerPage, commands.topMessage.exec.embed.format);

  // Send leaderboard :
  void command.reply({
    embeds: [
      simpleEmbed(message, "normal", msgParams(commands.topMessage.exec.embed.title, [commands.topMessage.subcmds.total.name]))
        .setFooter({ text: msgParams(commands.topMessage.exec.embed.footer, [page.page, page.maxPage]) })
    ]
  });

  logger.info(`${userWithId(command.user)} used the top-message total command`);
};