import type { EventExecute, EventName } from "#/utils/handler/event";
import { guilds } from "#/configs/guild";
import { gqlRequest } from "#/utils/request";
import { logger } from "#/utils/logger";
import { removeRole } from "./role-delete.gql";
import { getRolesAsArray } from "#/utils/api/role/role.util";

export const event: EventName = "roleDelete";

export const execute: EventExecute<"roleDelete"> = async(role) => {
  if (role.guild.id !== guilds.pro.guildId) return;

  const rolesQuery = await getRolesAsArray();

  if (!rolesQuery.ok) return;

  if (rolesQuery.value.find(r => r.roleId === role.id)) void gqlRequest(removeRole, { roleId: role.id });

  logger.info(`Role ${role.name} (${role.id}) deleted`);
};