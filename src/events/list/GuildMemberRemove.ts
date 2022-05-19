import { GuildMember } from "discord.js";
import Event from "../Event";

export default class GuildMemberRemove extends Event {

    public name: string = "guildMemberRemove";

    public async execute(member: GuildMember) : Promise<void> {
        // if(member.user.bot) return;
        
        // const memberDB = await Member.getMember(member.user);

        // memberDB.alwaysInTheServer = false;
        // memberDB.save();
    }
}