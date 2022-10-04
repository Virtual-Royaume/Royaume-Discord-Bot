import { getRoles, GetRolesType } from "$core/api/requests/MainRole";
import { gqlRequest } from "$core/utils/Request";

type RolesByCategory = {
    [category: string]: string[]
}

export async function getRolesByCategory(): Promise<RolesByCategory> {
    // Get mains roles :
    const roles = (await gqlRequest<GetRolesType, undefined>(getRoles)).data?.roles;

    // Sort roles by category :
    const rolesIdsByCategory: RolesByCategory = {};

    if (!roles) return rolesIdsByCategory;

    for (const role of roles) {
        if (!rolesIdsByCategory[role.category]) rolesIdsByCategory[role.category] = [];

        rolesIdsByCategory[role.category].push(role.roleId);
    }

    return rolesIdsByCategory;
}