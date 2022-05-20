import { GuildMember } from "discord.js";
import { request } from "../../api/Request";
import { setUsername } from "../../api/requests/Member";
import Event from "../Event";

export default class GuildMemberUpdate extends Event {

    public name: string = "guildMemberUpdate";

    public async execute(_: GuildMember, newMember: GuildMember) : Promise<void> {
        request(setUsername, { id: newMember.id, username: newMember.displayName });
    }
}