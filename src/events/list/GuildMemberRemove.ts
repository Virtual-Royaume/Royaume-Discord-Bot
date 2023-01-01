import { GuildMember } from "discord.js";
import { setAlwaysOnServer } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/request";
import { isDevEnvironment } from "$core/utils/Environment";

export default class GuildMemberRemove extends Event {

  public name: EventName = "guildMemberRemove";

  public async execute(member: GuildMember): Promise<void> {
    if (isDevEnvironment) return;
    if (member.user.bot) return;

    gqlRequest(setAlwaysOnServer, {
      id: member.id,
      value: false
    });
  }

}