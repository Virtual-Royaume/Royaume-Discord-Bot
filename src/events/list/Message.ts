import { Message as Msg, TextChannel } from "discord.js";

import MessageMemberCount from "../../database/MessageMemberCount";

export default class Message {

    public async run(message: Msg){
        if(message.author.bot) return;

        // Count the number of messages sent by members :
        const memberMsgCount = await MessageMemberCount.findOne({userId: message.author.id});

        if(memberMsgCount){
            memberMsgCount.count = memberMsgCount.count + 1;
            memberMsgCount.username = message.author.username;

            MessageMemberCount.save(memberMsgCount);
        } else {
            let newMember = new MessageMemberCount();

            newMember.userId = message.author.id;
            newMember.username = message.author.username;
            newMember.count = 1;

            newMember.save();
        }
    }
}