import { incVoiceMinute } from "$core/api/requests/member";
import { setMemberCount } from "$core/api/requests/server-activity";
import { client } from "$core/client";
import { getGuild } from "$core/configs/guild";
import type { TaskExecute, TaskInterval } from "$core/utils/handler/task";
import { logger } from "$core/utils/logger";
import { gqlRequest } from "$core/utils/request";
import { userWithId } from "$core/utils/discord/user";
import type { GuildMember } from "discord.js";

export const interval: TaskInterval = "0 * * * * *";

export const execute: TaskExecute = async() => {
  const proGuild = await getGuild(client, "pro");
  const gameGuild = await getGuild(client, "game");

  // Update daily member count:
  const memberCount = proGuild.memberCount;

  if (memberCount) void gqlRequest(setMemberCount, { count: memberCount });

  // Update voice time of members:
  const updatedMembers: GuildMember[] = [];

  for (const voiceState of proGuild.voiceStates.cache.values()) {
    if (
      voiceState.member && !voiceState.member.user.bot
      && voiceState.channel && (!voiceState.selfMute || !voiceState.mute)
    ) {
      void gqlRequest(incVoiceMinute, { id: voiceState.member.user.id });
      updatedMembers.push(voiceState.member);
    }
  }

  for (const voiceState of gameGuild.voiceStates.cache.values()) {
    if (
      voiceState.member && !voiceState.member.user.bot
      && voiceState.channel && (!voiceState.selfMute || !voiceState.mute)
    ) {
      void gqlRequest(incVoiceMinute, { id: voiceState.member.user.id });
      updatedMembers.push(voiceState.member);
    }
  }

  if (updatedMembers.length) {
    logger.info(
      `Voice time updated for members: ${updatedMembers.map(member => userWithId(member.user)).join(", ")}`
    );
  }
};