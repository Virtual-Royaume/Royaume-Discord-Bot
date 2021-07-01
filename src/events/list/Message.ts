import { Message as Msg } from "discord.js";
import Member from "../../database/src/models/Member";
import ServerActivity from "../../database/src/models/ServerActivity";
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

        // Update count of messages sent by members per channel and month message count :
        const member = await Member.getMember(message.author.id);
        const columnOfChannel = Member.channelIDToPropertyName[message.channel.id];

        if(member){
            member.activity.monthMessageCount++;

            if(columnOfChannel){
                // @ts-ignore
                member.activity.channelsMessageCount[columnOfChannel]++;
            }

            member.save();
        }
    }
}