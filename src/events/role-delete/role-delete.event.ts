import { EventExecute, EventName } from "$core/utils/handler/event";
import { guilds } from "$core/configs/guild";
import { gqlRequest } from "$core/utils/request";
import { getRoles, removeRole } from "$core/api/requests/main-role";

export const event: EventName = "roleDelete";

export const execute: EventExecute<"roleDelete"> = async(role) => {
  if (role.guild.id !== guilds.pro.guildId) return;

  const rolesQuery = await gqlRequest(getRoles);

  if (!rolesQuery.success) return;

  if (rolesQuery.data.roles.find(r => r.roleId === role.id)) gqlRequest(removeRole, { roleId: role.id });
};