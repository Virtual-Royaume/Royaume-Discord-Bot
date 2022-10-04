import { Role } from "discord.js";
import { getRoles, GetRolesType, removeRole } from "$core/api/requests/MainRole";
import Event, { EventName } from "$core/events/Event";
import { gqlRequest } from "$core/utils/Request";

export default class RoleDelete extends Event {

    public name: EventName = "roleDelete";

    public async execute(role: Role): Promise<void> {
        const roles = (await gqlRequest<GetRolesType, undefined>(getRoles)).data?.roles;

        if (!roles) return;

        if (roles.find(r => r.roleId === role.id)) gqlRequest(removeRole, { roleId: role.id });
    }
}