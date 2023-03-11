import { incVoiceMinute } from "$core/api/requests/Member";
import { setMemberCount } from "$core/api/requests/ServerActivity";
import Client from "$core/Client";
import Task from "$core/tasks/Task";
import { gqlRequest } from "$core/utils/request";

export default class ServerActivityUpdate extends Task {

  public readonly enabledInDev = false;

  constructor() {
    super(60_000);
  }

  public async run(): Promise<void> {
    // Guilds instances:
    const proGuild = await Client.instance.getGuild();
    const gameGuild = await Client.instance.getGamesGuild();

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
  }

}