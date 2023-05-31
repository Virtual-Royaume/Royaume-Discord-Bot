import type { EventExecute, EventName } from "#/utils/handler/event";
import { guilds } from "#/configs/guild";
import { gqlRequest } from "#/utils/request";
import { getRoles, removeRole } from "#/api/requests/main-role";
import { logger } from "#/utils/logger";

export const event: EventName = "roleDelete";

export const execute: EventExecute<"roleDelete"> = async(role) => {
  if (role.guild.id !== guilds.pro.guildId) return;

  const rolesQuery = await gqlRequest(getRoles);

  if (!rolesQuery.ok) return;

  if (rolesQuery.value.roles.find(r => r.roleId === role.id)) void gqlRequest(removeRole, { roleId: role.id });

  logger.info(`Role ${role.name} (${role.id}) deleted`);
};