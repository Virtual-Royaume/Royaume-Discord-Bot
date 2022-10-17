import { incVoiceMinute } from "$core/api/requests/Member";
import { setMemberCount } from "$core/api/requests/ServerActivity";
import Client from "$core/Client";
import Task from "$core/tasks/Task";
import { gqlRequest } from "$core/utils/request";

export default class ServerActivityUpdate extends Task {

    constructor() {
        super(60_000);
    }

    public async run(): Promise<void> {
        // Update daily member count :
        const memberCount = (await Client.instance.getGuild()).memberCount;

        if (memberCount) gqlRequest(setMemberCount, { count: memberCount });

        // Update voice time of members :
        for (const voiceState of (await Client.instance.getGuild()).voiceStates.cache.values()) {
            if (
                voiceState.member && !voiceState.member.user.bot && voiceState.channel
                && (!voiceState.selfMute || !voiceState.mute)
            ) {
                gqlRequest(incVoiceMinute, { id: voiceState.member.user.id });
            }
        }
    }
}