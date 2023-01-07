import { GuildMember } from "discord.js";
import { setUsernameAndProfilePicture } from "$core/api/requests/Member";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/request";

export default class GuildMemberUpdate extends Event {

  public name: EventName = "guildMemberUpdate";

  public async execute(_: GuildMember, newMember: GuildMember): Promise<void> {
    gqlRequest(setUsernameAndProfilePicture, {
      id: newMember.id,
      username: newMember.displayName,
      profilePicture: newMember.displayAvatarURL()
    });
  }

}