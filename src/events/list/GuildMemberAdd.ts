import { GuildMember } from "discord.js";
import Client from "$core/Client";
import Event, { EventName } from "$core/events/Event";
import { verify } from "$resources/config/information.json";
import { createMember, CreateMemberType, CreateMemberVariables, setAlwaysOnServer } from "$core/api/requests/Member";
import { gqlRequest } from "$core/utils/Request";

export default class GuildMemberAdd extends Event {

    public name: EventName = "guildMemberAdd";

    public async execute(member: GuildMember): Promise<void> {
        if (member.user.bot) return;

        // Add verification role :
        const role = await (await Client.instance.getGuild()).roles.fetch(verify.roles.waiting);

        if (role) member.roles.add(role);

        // Create the member if he dosen't exist :
        const result = await gqlRequest<CreateMemberType, CreateMemberVariables>(createMember, {
            id: member.id,
            username: member.user.username,
            profilePicture: member.user.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
        });

        if (!result.data?.createMember._id) gqlRequest(setAlwaysOnServer, { id: member.id, value: true });
    }
}