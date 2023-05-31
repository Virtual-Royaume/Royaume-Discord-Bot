import { createMember, getMember, getMembersOnServerStatus, setAlwaysOnServer } from "$core/api/requests/member";
import { client } from "$core/client";
import { getGuild } from "$core/configs/guild";
import { getGuildMembers } from "$core/utils/discord/guild";
import type { TaskExecute, TaskInterval } from "$core/utils/handler/task";
import { logger } from "$core/utils/logger";
import { gqlRequest } from "$core/utils/request";
import { userWithId } from "$core/utils/discord/user";

export const interval: TaskInterval = "0 */3 * * * *";

export const execute: TaskExecute = async() => {
  const proGuild = await getGuild(client, "pro");
  const gameGuild = await getGuild(client, "game");

  const proMembers = await getGuildMembers(proGuild);
  const gameMembers = await getGuildMembers(gameGuild);

  if (!proMembers || !gameMembers) {
    logger.error("Verify members task fail, unable to fetch guild members");
    return;
  }

  const members = proMembers.merge(
    gameMembers,
    proMember => ({ keep: true, value: proMember }),
    gameMember => ({ keep: true, value: gameMember }),
    (proMember, _) => ({ keep: true, value: proMember }),
  );
  const apiMembersQuery = await gqlRequest(getMembersOnServerStatus);

  if (!apiMembersQuery.ok) return;

  for (const apiMember of apiMembersQuery.value.members) {
    const realMember = members.get(apiMember._id);

    if (realMember && !realMember.user.bot) {
      members.delete(apiMember._id);
      continue;
    }

    // Remove members :
    logger.info(`Change ${apiMember.username} (${apiMember._id}) value of "isOnServer" API field to false`);
    void gqlRequest(setAlwaysOnServer, { id: apiMember._id, value: false });
  }

  for (const realMember of members.values()) {
    if (realMember.user.bot) continue;

    const apiMember = await gqlRequest(getMember, { id: realMember.id });

    if (!apiMember.ok) {
      logger.error(`Can not create an API member ${realMember.id} (${realMember.user.tag})`);
      return;
    }
    // Create member if he does not exist :
    if (!apiMember.value.member) {
      await gqlRequest(createMember, {
        id: realMember.id,
        username: realMember.displayName,
        profilePicture: realMember.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
      });
    }

    // Add member :
    logger.info(`Change ${userWithId(realMember.user)} value of "isOnServer" API field to true`);

    await gqlRequest(
      setAlwaysOnServer, { id: realMember.id, value: true }
    );
  }
};