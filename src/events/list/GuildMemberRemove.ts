import { GuildMember } from "discord.js";
import Member from "../../database/src/models/Member";
import Event from "../Event";

export default class GuildMemberRemove extends Event {

    constructor(){
        super("guildMemberRemove");
    }

    public async run(member: GuildMember) : Promise<void> {
        if(member.user.bot) return;
        
        const memberDB = await Member.getMember(member.user.id);

        if(memberDB){
            memberDB.alwaysInTheServer = false;
            memberDB.save();
        }
    }
}