import { request } from "../../api/Request";
import { incVoiceMinute } from "../../api/requests/Member";
import { setMemberCount } from "../../api/requests/ServerActivity";
import Client from "../../Client";
import Task from "../Task";

export default class ServerActivityUpdate extends Task {

    constructor(){
        super(60_000);
    }

    public async run() : Promise<void> {
        // Update daily member count :
        request(setMemberCount, { count: Client.instance.getGuild().memberCount });

        // Update voice time of members :
        Client.instance.getGuild().voiceStates.cache.forEach(voiceState => {
            if(
                voiceState.member && !voiceState.member.user.bot && 
                !voiceState.selfMute && !voiceState.mute && 
                voiceState.channel
            ){
                request(incVoiceMinute, { id: voiceState.member.user.id });
            }
        });
    }
}