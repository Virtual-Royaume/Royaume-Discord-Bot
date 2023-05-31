import { graphql } from "#/utils/request";

export const removeRole = graphql(`
  mutation removeRoleForEvent($roleId: ID!){
    removeRole(roleId: $roleId)
  }
`);