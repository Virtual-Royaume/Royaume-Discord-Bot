import { createMember, getMembersOnServerStatus, setAlwaysOnServer } from "$core/api/requests/member";
import { client } from "$core/client";
import { getGuild } from "$core/configs/guild";
import { TaskExecute, TaskInterval } from "$core/utils/handler/task";
import { logger } from "$core/utils/logger";
import { gqlRequest } from "$core/utils/request";

export const interval: TaskInterval = "0 */3 * * * *";

export const execute: TaskExecute = async() => {
  const realMembers = await (await getGuild(client, "pro")).members.fetch();
  const apiMembersQuery = await gqlRequest(getMembersOnServerStatus);

  if (!apiMembersQuery.success) return;

  for (const apiMember of apiMembersQuery.data.members) {
    const realMember = realMembers.get(apiMember._id);

    if (realMember && !realMember.user.bot) {
      realMembers.delete(apiMember._id);
      continue;
    }

    // Remove members :
    logger.info(`Fix ${apiMember._id} isOnServer value to false (${apiMember.username})`);
    gqlRequest(setAlwaysOnServer, { id: apiMember._id, value: false });
  }

  for (const realMember of realMembers.values()) {
    if (realMember.user.bot) continue;

    // Add member :
    logger.info(`Fix ${realMember.id} isOnServer value to true (${realMember.displayName})`);

    const response = await gqlRequest(
      setAlwaysOnServer, { id: realMember.id, value: true }
    );

    if (response.success) return;

    // Create member if he does not exist :
    await gqlRequest(createMember, {
      id: realMember.id,
      username: realMember.displayName,
      profilePicture: realMember.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
    });
  }
};