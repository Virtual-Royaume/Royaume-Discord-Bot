import { getMonthMessageCount } from "$core/api/requests/member";
import { memberPerPage } from "../top-message.const";
import { MembersData } from "../top-message.type";
import { formatPage, getPage } from "../top-message.util";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

export const execute: CommandExecute = async(command) => {
  let members: MembersData[] = [];
  const membersMessagesCountQuery = await gqlRequest(getMonthMessageCount);

  if (!membersMessagesCountQuery.success) {
    command.reply({
      embeds: [
        simpleEmbed(commands.topMessage.exec.activityQueryError, "error")
      ],
      ephemeral: true
    });
    return;
  }

  // Sort members & change format (QueryType => MembersData)
  members = membersMessagesCountQuery.data.members.sort((a, b) => {
    return (b?.activity.messages.monthCount ?? 0) - (a?.activity.messages.monthCount ?? 0);
  }).map(member => {
    return {
      username: member.username,
      messageCount: member.activity.messages.monthCount
    };
  }) ?? [];

  const page = getPage(members, memberPerPage, command.options.getNumber(commands.topMessage.subcmds.total.options.page.name) ?? 1);
  const message = formatPage(page, memberPerPage, commands.topMessage.exec.embed.format);

  // Send leaderboard :
  command.reply({
    embeds: [
      simpleEmbed(message, "normal", msgParams(commands.topMessage.exec.embed.title, [commands.topMessage.subcmds.month.name]))
        .setFooter({ text: msgParams(commands.topMessage.exec.embed.footer, [page.page, page.maxPage]) })
    ]
  });

  logger.info(`${userWithId(command.user)} used the top-message month command`);
};