import { GuildMember } from "discord.js";
import Event from "../Event";

export default class GuildMemberRemove extends Event {

    constructor(){
        super("guildMemberRemove");
    }

    public async run(member: GuildMember) : Promise<void> {
        // if(member.user.bot) return;
        
        // const memberDB = await Member.getMember(member.user);

        // memberDB.alwaysInTheServer = false;
        // memberDB.save();
    }
}