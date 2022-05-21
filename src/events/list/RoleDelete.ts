import { Role } from "discord.js";
import { request } from "../../api/Request";
import { getRoles, removeRole } from "../../api/requests/MainRole";
import { MainRole } from "../../api/Schema";
import Event from "../Event";

export default class RoleDelete extends Event {

    public name: string = "roleDelete";

    public async execute(role: Role) : Promise<void> {
        const roles = (await request<{ roles: MainRole[] }>(getRoles)).roles;

        if(roles.find(r => r.roleId === role.id)) request(removeRole, { roleId: role.id });
    }
}