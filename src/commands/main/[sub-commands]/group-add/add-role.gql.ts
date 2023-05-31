import { graphql } from "#/utils/request";

export const addRole = graphql(`
  mutation addRole($roleId: ID!, $category: String!) {
    addRole(roleId: $roleId, category: $category)
  }
`);