import { GuildMember } from "discord.js";
import Client from "../../Client";
import Event, { EventName } from "../Event";
import { verify } from "../../../resources/config/information.json";
import { request } from "../../api/Request";
import { createMember, CreateMemberType, setAlwaysOnServer } from "../../api/requests/Member";

export default class GuildMemberAdd extends Event {

    public name: EventName = "guildMemberAdd";

    public async execute(member: GuildMember) : Promise<void> {
        if (member.user.bot) return;

        // Add verification role :
        const role = await (await Client.instance.getGuild()).roles.fetch(verify.roles.waiting);

        if (role) member.roles.add(role);

        // Create the member if he dosen't exist :
        const result = await request<CreateMemberType>(createMember, {
            id: member.id,
            username: member.user.username,
            profilePicture: member.user.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
        });

        if (!result.createMember._id) request(setAlwaysOnServer, { id: member.id, value: true });
    }
}