import { GuildMember } from "discord.js";
import { request } from "../../api/Request";
import { setAlwaysOnServer } from "../../api/requests/Member";
import Event, { EventName } from "../Event";

export default class GuildMemberRemove extends Event {

    public name: EventName = "guildMemberRemove";

    public async execute(member: GuildMember) : Promise<void> {
        if (member.user.bot) return;

        request(setAlwaysOnServer, {
            id: member.id,
            value: false
        });
    }
}