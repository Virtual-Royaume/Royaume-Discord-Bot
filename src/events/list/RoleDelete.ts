import { Role } from "discord.js";
import { request } from "../../api/Request";
import { getRoles, GetRolesType, removeRole } from "../../api/requests/MainRole";
import Event, { EventName } from "../Event";

export default class RoleDelete extends Event {

    public name: EventName = "roleDelete";

    public async execute(role: Role) : Promise<void> {
        const roles = (await request<GetRolesType>(getRoles)).roles;

        if (roles.find(r => r.roleId === role.id)) request(removeRole, { roleId: role.id });
    }
}