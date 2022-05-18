import { GuildMember } from "discord.js";
import Client from "../../client/Client";
import Event from "../Event";
import { verifRole } from "../../../resources/configs/information.json";

export default class GuildMemberAdd extends Event {

    constructor(){
        super("guildMemberAdd");
    }

    public async run(member: GuildMember) : Promise<void> {
        if(member.user.bot) return;

        const role = await Client.instance.getGuild().roles.fetch(verifRole);

        if(role) member.roles.add(role);

        // TODO : create the member with API 
    }
}