import { GuildMember } from "discord.js";
import { setUsernameAndprofilePicture } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/Request";

export default class GuildMemberUpdate extends Event {

    public name: EventName = "guildMemberUpdate";

    public async execute(_: GuildMember, newMember: GuildMember): Promise<void> {
        gqlRequest(setUsernameAndprofilePicture, {
            id: newMember.id,
            username: newMember.displayName,
            profilePicture: newMember.displayAvatarURL()
        });
    }
}