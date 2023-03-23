import { incVoiceMinute } from "$core/api/requests/member";
import { setMemberCount } from "$core/api/requests/server-activity";
import { client } from "$core/client";
import { getGuild } from "$core/configs/guild";
import { TaskExecute, TaskInterval } from "$core/utils/handler/task";
import { gqlRequest } from "$core/utils/request";

export const interval: TaskInterval = "0 * * * * *";

export const execute: TaskExecute = async() => {
  const proGuild = await getGuild(client, "pro");
  const gameGuild = await getGuild(client, "game");

  // Update daily member count:
  const memberCount = proGuild.memberCount;

  if (memberCount) gqlRequest(setMemberCount, { count: memberCount });

  // Update voice time of members:
  for (const voiceState of proGuild.voiceStates.cache.values()) {
    if (
      voiceState.member
    && !voiceState.member.user.bot
    && voiceState.channel
    && (!voiceState.selfMute || !voiceState.mute)
    ) {
      gqlRequest(incVoiceMinute, { id: voiceState.member.user.id });
    }
  }

  for (const voiceState of gameGuild.voiceStates.cache.values()) {
    if (
      voiceState.member
    && !voiceState.member.user.bot
    && voiceState.channel
    && (!voiceState.selfMute || !voiceState.mute)
    ) {
      gqlRequest(incVoiceMinute, { id: voiceState.member.user.id });
    }
  }
};