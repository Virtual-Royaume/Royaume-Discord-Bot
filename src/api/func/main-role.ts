import { getRoles } from "$core/api/requests/main-role";
import { gqlRequest } from "$core/utils/request";

type RolesByCategory = {
    [category: string]: string[]
}

export async function getRolesByCategory(): Promise<RolesByCategory> {
  // Get mains roles :
  const response = await gqlRequest(getRoles);

  if (!response.success) return {};

  const roles = response.data.roles;

  // Sort roles by category :
  const rolesIdsByCategory: RolesByCategory = {};

  if (!roles) return rolesIdsByCategory;

  for (const role of roles) {
    if (!rolesIdsByCategory[role.category]) rolesIdsByCategory[role.category] = [];

    rolesIdsByCategory[role.category].push(role.roleId);
  }

  return rolesIdsByCategory;
}