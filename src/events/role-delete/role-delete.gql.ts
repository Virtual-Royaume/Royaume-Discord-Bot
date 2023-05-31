import { graphql } from "#/utils/request";

export const removeRole = graphql(`
  mutation removeRole($roleId: ID!) {
    removeRole(roleId: $roleId)
  }
`);