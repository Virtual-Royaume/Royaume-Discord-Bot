import { setUsernameAndProfilePicture } from "$core/api/requests/member";
import { guilds } from "$core/configs/guild";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { gqlRequest } from "$core/utils/request";

export const event: EventName = "guildMemberUpdate";

export const execute: EventExecute<"guildMemberUpdate"> = async(oldMember, newMember) => {
  if (newMember.guild.id !== guilds.pro.guildId) return;

  gqlRequest(setUsernameAndProfilePicture, {
    id: newMember.id,
    username: newMember.displayName,
    profilePicture: newMember.displayAvatarURL()
  });
};