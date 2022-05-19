import { GuildMember } from "discord.js";
import Client from "../../Client";
import Event from "../Event";
import { verifRole } from "../../../resources/config/information.json";
import { request } from "../../api/Request";
import { createMember } from "../../api/requests/Member";

export default class GuildMemberAdd extends Event {

    public name: string = "guildMemberAdd";

    public async execute(member: GuildMember) : Promise<void> {
        if(member.user.bot) return;

        // Add verification role :
        const role = await Client.instance.getGuild().roles.fetch(verifRole);

        if(role) member.roles.add(role);

        // Create the member if he dosen't exist :
        request(createMember, {
            id: member.id,
            username: member.user.username,
            profilPicture: member.user.avatarURL
        });
    }
}