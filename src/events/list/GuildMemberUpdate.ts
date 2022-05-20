import { GuildMember } from "discord.js";
import { request } from "../../api/Request";
import { setUsernameAndProfilPicture } from "../../api/requests/Member";
import Event from "../Event";

export default class GuildMemberUpdate extends Event {

    public name: string = "guildMemberUpdate";

    public async execute(_: GuildMember, newMember: GuildMember) : Promise<void> {
        request(setUsernameAndProfilPicture, { 
            id: newMember.id, 
            username: newMember.displayName,
            profilPicture: newMember.displayAvatarURL({ dynamic: true })
        });
    }
}