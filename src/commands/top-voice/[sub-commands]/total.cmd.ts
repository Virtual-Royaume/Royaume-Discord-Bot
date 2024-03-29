import type { CommandExecute } from "#/utils/handler/command";
import type { MembersData } from "../top-voice.type";
import { formatPage, getPage } from "../top-voice.util";
import { commands } from "#/configs/message/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { memberPerPage } from "../top-voice.const";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";
import { getVoiceTime } from "./total.gql";

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