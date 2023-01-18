import { GuildMember } from "discord.js";
import { setAlwaysOnServer } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/request";

export default class GuildMemberRemove extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "guildMemberRemove";

  public async execute(member: GuildMember): Promise<void> {
    if (member.user.bot) return;

    gqlRequest(setAlwaysOnServer, {
      id: member.id,
      value: false
    });
  }

}