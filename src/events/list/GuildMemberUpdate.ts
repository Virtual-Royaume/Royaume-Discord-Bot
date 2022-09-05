import { GuildMember } from "discord.js";
import { request } from "$core/api/Request";
import { setUsernameAndprofilePicture } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";

export default class GuildMemberUpdate extends Event {

    public name: EventName = "guildMemberUpdate";

    public async execute(_: GuildMember, newMember: GuildMember) : Promise<void> {
        request(setUsernameAndprofilePicture, {
            id: newMember.id,
            username: newMember.displayName,
            profilePicture: newMember.displayAvatarURL({ dynamic: true })
        });
    }
}