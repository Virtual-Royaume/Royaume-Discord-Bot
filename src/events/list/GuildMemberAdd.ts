import { GuildMember } from "discord.js";
import Client from "../../Client";
import Event from "../Event";
import { verifRole } from "../../../resources/configs/information.json";

export default class GuildMemberAdd extends Event {

    public name: string = "guildMemberAdd";

    public async execute(member: GuildMember) : Promise<void> {
        if(member.user.bot) return;

        const role = await Client.instance.getGuild().roles.fetch(verifRole);

        if(role) member.roles.add(role);

        // TODO : create the member with API 
    }
}