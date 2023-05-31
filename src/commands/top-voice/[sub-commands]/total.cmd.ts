import type { CommandExecute } from "$core/utils/handler/command";
import type { MembersData } from "../top-voice.type";
import { getVoiceTime } from "$core/api/requests/member";
import { formatPage, getPage } from "../top-voice.util";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/discord/embed";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { memberPerPage } from "../top-voice.const";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

export const execute: CommandExecute = async(command) => {
  let members: MembersData[] = [];
  const membersMinutesQuery = await gqlRequest(getVoiceTime);

  if (!membersMinutesQuery.ok) {
    void command.reply({
      embeds: [
        simpleEmbed(commands.topVoice.exec.activityQueryError, "error")
      ],
      ephemeral: true
    });
    return;
  }

  // Sort members & change format (QueryType => MembersData)
  members = membersMinutesQuery.value.members.sort((a, b) => {
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
  void command.reply({
    embeds: [
      simpleEmbed(message, "normal", msgParams(commands.topVoice.exec.embed.title, [commands.topVoice.subcmds.total.name]))
        .setFooter({ text: msgParams(commands.topVoice.exec.embed.footer, [page.page, page.maxPage]) })
    ]
  });

  logger.info(`${userWithId(command.user)} used the top-voice total command`);
};