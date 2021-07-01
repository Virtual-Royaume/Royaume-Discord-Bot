import dayjs from "dayjs";
import { User } from "discord.js";
import Client from "../../client/Client";
import { VoiceChannel } from "../../constants/ChannelID";
import Member from "../../database/src/models/Member";
import ServerActivity from "../../database/src/models/ServerActivity";
import Task from "../Task"

export default class ServerActivityUpdate extends Task { //MemberActivity ServerActivity

    constructor(){
        super(60000 /* 1 minute */);
    }

    public async run(timeout: NodeJS.Timeout) : Promise<void> {
        // Reset message of the month :
        if(dayjs().format("DD-HH-mm") === "01-00-00"){
            Member.MemberModel.updateMany({}, {"activity.voiceMinute": 0});
        }

        // Get server activity :
        const serverActivity = await ServerActivity.getServerActivity();

        // Update daily member count :
        if(Client.instance.getGuild().memberCount > serverActivity.memberCount){
            serverActivity.memberCount = Client.instance.getGuild().memberCount;
        }

        // Update voice time (member, server global) :
        let memberVoiceList: User[] = [];

        Client.instance.getGuild().voiceStates.cache.forEach(voiceState => {
            if(voiceState.member && !voiceState.member.user.bot && !voiceState.selfMute && voiceState.channel && voiceState.channel.id !== VoiceChannel.afk){
                memberVoiceList.push(voiceState.member.user);
            }
        });

        memberVoiceList.forEach(async user => {
            serverActivity.voiceMinute++;

            let member = await Member.getMember(user.id);

            if(member){
                member.activity.voiceMinute++;
                member.save();
            }
        });

        // Save data :
        serverActivity.save();
    }
}