import { GuildMember } from "discord.js";
import { request } from "../../api/Request";
import { setUsernameAndprofilePicture } from "../../api/requests/Member";
import Event, { EventName } from "../Event";

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