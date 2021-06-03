import { Message as Msg } from "discord.js";
import Member from "../../database/member/Member";
import MemberActivity from "../../database/member/MemberActivity";
import ServerActivity from "../../database/ServerActivity";
import Event from "../Event";

export default class Message extends Event {

    constructor(){
        super("message");
    }

    public async run(message: Msg) : Promise<void> {
        if(message.author.bot) return;

        // Update number of messages in server activity :
        const serverActivity = await ServerActivity.getServerActivity();
        
        serverActivity.messageCount++;
        serverActivity.save();

        // Update count of messages sent by members per channel :
        const member = await Member.getMember(message.author);
        const columnOfChannel = MemberActivity.channelIdsToColumnName[message.channel.id];

        if(columnOfChannel){
            // @ts-ignore
            member.activity[columnOfChannel]++;
            member.save();
        }
    }
}