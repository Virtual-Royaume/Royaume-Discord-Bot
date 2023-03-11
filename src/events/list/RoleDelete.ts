import { Role } from "discord.js";
import { getRoles, removeRole } from "$core/api/requests/MainRole";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/request";
import { gameGuildId } from "$resources/config/information.json";

export default class RoleDelete extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "roleDelete";

  public async execute(role: Role): Promise<void> {
    if (role.guild.id === gameGuildId) return;

    const rolesQuery = await gqlRequest(getRoles);

    if (!rolesQuery.success) return;

    if (rolesQuery.data.roles.find(r => r.roleId === role.id)) gqlRequest(removeRole, { roleId: role.id });
  }

}