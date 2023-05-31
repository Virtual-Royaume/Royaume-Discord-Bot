import type { RolesByCategory } from "./role.type";
import type { GetRolesQuery } from "#/utils/request";
import type { Result } from "rustic-error";
import { gqlRequest } from "#/utils/request";
import { getRoles } from "./role.gql";
import { ok } from "rustic-error";
import { error } from "rustic-error";

export const getRolesAsArray = async(): Promise<Result<GetRolesQuery["roles"], Error>> => {
  const response = await gqlRequest(getRoles);

  if (!response.ok) return error(Error("Unable to fetch the role list"));

  return ok(response.value.roles);
};

export const getRolesByCategory = async(): Promise<Result<RolesByCategory, Error>> => {
  // Get mains roles :
  const roles = await getRolesAsArray();

  if (!roles.ok) return error(roles.error);

  // Sort roles by category :
  const rolesIdsByCategory: RolesByCategory = {};

  for (const role of roles.value) {
    if (!rolesIdsByCategory[role.category]) rolesIdsByCategory[role.category] = [];

    rolesIdsByCategory[role.category].push(role.roleId);
  }

  return ok(rolesIdsByCategory);
};