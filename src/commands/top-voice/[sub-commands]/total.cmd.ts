import { getVoiceTime } from "$core/api/requests/member";
import { formatPage, getPage, memberPerPage } from "$core/commands/top-voice/top-voice.util";
import { MembersData } from "$core/commands/top-voice/top-voice.type";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";

export const execute: CommandExecute = async(command) => {
  let members: MembersData[] = [];
  const membersMinutesQuery = await gqlRequest(getVoiceTime);

  if (!membersMinutesQuery.success) {
    command.reply({
      embeds: [
        simpleEmbed(commands.topVoice.exec.activityQueryError, "error")
      ],
      ephemeral: true
    });
    return;
  }

  // Sort members & change format (QueryType => MembersData)
  members = membersMinutesQuery.data.members.sort((a, b) => {
    return (b.activity.voiceMinute ?? 0) - (a.activity.voiceMinute ?? 0);
  }).map(member => {
    return {
      username: member.username,
      voiceMinute: member.activity.voiceMinute
    };
  }) ?? [];

  const page = getPage(members, memberPerPage, command.options.getNumber(commands.topVoice.subcmds.total.options.page.name) ?? 1);
  const message = formatPage(page, memberPerPage, commands.topVoice.exec.embed.format);

  // Send leaderboard :
  command.reply({
    embeds: [
      simpleEmbed(message, "normal", msgParams(commands.topVoice.exec.embed.title, [commands.topVoice.subcmds.total.name]))
        .setFooter({ text: msgParams(commands.topVoice.exec.embed.footer, [page.page, page.maxPage]) })
    ]
  });
};