import { request } from "$core/api/Request";
import { getRoles, GetRolesType } from "$core/api/requests/MainRole";

type RolesByCategory = {
    [category: string]: string[]
}

export async function getRolesByCategory() : Promise<RolesByCategory> {
    // Get mains roles :
    const roles = (await request<GetRolesType>(getRoles)).roles;

    // Sort roles by category :
    const rolesIdsByCategory: RolesByCategory = {};

    for (const role of roles) {
        if (!rolesIdsByCategory[role.category]) rolesIdsByCategory[role.category] = [];

        rolesIdsByCategory[role.category].push(role.roleId);
    }

    return rolesIdsByCategory;
}