import { request } from "../../api/Request";
import { incVoiceMinute } from "../../api/requests/Member";
import { setMemberCount } from "../../api/requests/ServerActivity";
import Client from "../../Client";
import Task from "../Task";

export default class ServerActivityUpdate extends Task {

    constructor() {
        super(60_000);
    }

    public async run() : Promise<void> {
        // Update daily member count :
        const memberCount = (await Client.instance.getGuild()).memberCount;

        if (memberCount) request(setMemberCount, { count: memberCount });

        // Update voice time of members :
        if (!Client.instance.isProdEnvironment()) return;

        for (const voiceState of (await Client.instance.getGuild()).voiceStates.cache.values()) {
            if (
                voiceState.member && !voiceState.member.user.bot && voiceState.channel
                && (!voiceState.selfMute || !voiceState.mute)
            ) {
                request(incVoiceMinute, { id: voiceState.member.user.id });
            }
        }
    }
}