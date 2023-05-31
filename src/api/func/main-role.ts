import { getRoles } from "$core/api/requests/main-role";
import { gqlRequest } from "$core/utils/request";

type RolesByCategory = {
  [category: string]: string[];
}

export const getRolesByCategory = async(): Promise<RolesByCategory> => {
  // Get mains roles :
  const response = await gqlRequest(getRoles);

  if (!response.ok) return {};

  const roles = response.value.roles;

  // Sort roles by category :
  const rolesIdsByCategory: RolesByCategory = {};

  if (!roles) return rolesIdsByCategory;

  for (const role of roles) {
    if (!rolesIdsByCategory[role.category]) rolesIdsByCategory[role.category] = [];

    rolesIdsByCategory[role.category].push(role.roleId);
  }

  return rolesIdsByCategory;
};