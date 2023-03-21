import { getChannelMessageCount } from "$core/api/requests/member";
import { MembersData } from "$core/commands/top-message/top-message.type";
import { formatPage, getPage, memberPerPage } from "$core/commands/top-message/top-message.util";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";

export const execute: CommandExecute = async(command) => {
  let members: MembersData[] = [];
  const membersMessagesCountQuery = await gqlRequest(getChannelMessageCount);

  if (!membersMessagesCountQuery.success) {
    command.reply({
      embeds: [
        simpleEmbed(commands.topMessage.exec.activityQueryError, "error")
      ],
      ephemeral: true
    });
    return;
  }

  const channel = command.options.getChannel(commands.topMessage.subcmds.channel.options.channel.name, true);
  // Sort members & change format (QueryType => MembersData)
  members = membersMessagesCountQuery.data.members.map(member => {
    const selectChannel = member.activity.messages.perChannel.find(c => channel.id === c.channelId);

    return {
      username: member.username,
      messageCount: selectChannel?.messageCount ?? 0
    };
  }).sort((a, b) => {
    return (b.messageCount) - (a.messageCount);
  }) ?? [];

  const page = getPage(members, memberPerPage, command.options.getNumber(commands.topMessage.subcmds.total.options.page.name) ?? 1);
  const message = formatPage(page, memberPerPage, commands.topMessage.exec.embed.format);

  // Send leaderboard :
  command.reply({
    embeds: [
      simpleEmbed(message, "normal", msgParams(commands.topMessage.exec.embed.title, [commands.topMessage.subcmds.total.name]))
        .setFooter({ text: msgParams(commands.topMessage.exec.embed.footer, [page.page, page.maxPage]) })
    ]
  });
};